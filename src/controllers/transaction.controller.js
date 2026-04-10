const transactionModel = require("../models/transaction.model")
const ledgerModel = require("../models/ledger.model")
const accountModel = require("../models/account.model")
const emailService = require("../services/email.service")
const mongoose = require("mongoose")

/**
 * - Create a new transaction
 * THE 10-STEP TRANSFER FLOW:
      * 1. Validate request
      * 2. Validate idempotency key
      * 3. Check account status
      * 4. Derive sender balance from ledger
      * 5. Create transaction (PENDING)
      * 6. Create DEBIT ledger entry
      * 7. Create CREDIT ledger entry
      * 8. Mark transaction COMPLETED
      * 9. Commit MongoDB session
      * 10. Send email notification
 */

async function createTransaction(req, res) {
     const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

     if(!fromAccount || !toAccount || !amount || !idempotencyKey){
          return res.status(400).json({
               message: "fromAccount, toAccount, amount and idempotencyKey are required for creating a transaction"
          })
     }
     const fromUserAccount = await accountModel.findOne({
          _id : fromAccount
     })

     const toUserAccount = await accountModel.findOne({
          _id : toAccount
     })

     if(!fromUserAccount || !toUserAccount){
          return res.status(404).json({
               message: "One or both accounts not found"
          })
     }

     const isTransactionExist = await transactionModel.findOne({
          idempotencyKey: idempotencyKey
     })

     if(isTransactionExist){
          if(isTransactionExist.status === "completed"){
               return res.status(200).json({
                    message: "Transaction already exists and is completed",
                    transaction: isTransactionExist
               })
          }

          if(isTransactionExist.status === "pending"){
               return res.status(200).json({
                    message: "Transaction is still processing",
               })
          }

          if(isTransactionExist.status === "failed"){
               return res.status(500).json({
                    message: "Transaction processing failed , please try again",
               })
          }

          if(isTransactionExist.status === "reversed"){
               return res.status(500).json({
                    message: "Transaction was reversed, please try again",
               })
          }
     }

     if(fromUserAccount.status !== "active" || toUserAccount.status !== "active"){
          return res.status(400).json({
               message: "One or both accounts are not active"
          })
     }

     const balance = await fromUserAccount.getBalance()

     if(balance < amount){
          return res.status(400).json({
               message: `Insufficient funds in the sender's account. Current balance is ${balance}. Requested amount is ${amount}`
          })
     }

     let transaction;
     try {

     const session = await mongoose.startSession()
     session.startTransaction()

     transaction = (await transactionModel.create([{
          fromAccount,
          toAccount,
          amount,
          idempotencyKey,
          status: "pending"
     }], { session }))[0]

     const debitledgerEntry = await ledgerModel.create([{
          account: fromAccount,
          amount: amount,
          transaction: transaction._id,
          type: "debit"
     }], { session })

     await (() => {
          return new Promise((resolve) => setTimeout(resolve, 10 * 1000)) // Simulating a delay in processing the transaction to test idempotency
     })

     const creditedLedgerEntry = await ledgerModel.create([{
          account: toAccount,
          amount: amount,
          transaction: transaction._id,
          type: "credit"
     }], { session })

     await transactionModel.findOneAndUpdate(
     {_id: transaction._id}, 
     {status: "completed"}, 
     { session })

     await session.commitTransaction()
     session.endSession()
     }
      catch (error) {
          
          return res.status(500).json({
               message: "Transaction processing failed, please try again",
               error: error.message
          })
     }



     // Send email notification to sender and receiver
     await emailService.sendTransactionEmail(req.user.email, req.user.name, amount, toUserAccount)

     return res.status(201).json({
          message: "Transaction created successfully",
          transaction: transaction
     })
}

async function createInitialFundsTransaction(req, res) {
     const { toAccount, amount, idempotencyKey } = req.body

     if(!toAccount || !amount || !idempotencyKey){
          return res.status(400).json({
               message: "toAccount, amount and idempotencyKey are required for creating an initial funds transaction"
          })
     }

     const toUserAccount = await accountModel.findOne({ 
          _id : toAccount
     })

     if(!toUserAccount){
          return res.status(404).json({
               message: "Account not found"
          })
     }

     const fromUserAccount = await accountModel.findOne({
          user: req.user._id
     })

     if(!fromUserAccount){
          return res.status(404).json({
               message: "System account for the user not found"
          })
     }

     const session = await mongoose.startSession()
     session.startTransaction()

     const transaction = new transactionModel({
          fromAccount: fromUserAccount._id,
          toAccount,
          amount,
          idempotencyKey,
          status: "pending"
     })

     const debitledgerEntry = await ledgerModel.create([{
          account: fromUserAccount._id,
          amount: amount,
          transaction: transaction._id,
          type: "debit"
     }], { session })

     const creditedLedgerEntry = await ledgerModel.create([{
          account: toUserAccount._id,
          amount: amount,
          transaction: transaction._id,
          type: "credit"
     }], { session })

     transaction.status = "completed"
     await transaction.save({ session })

     await session.commitTransaction()
     session.endSession()

     return res.status(201).json({
          message: "Initial funds transaction created successfully",
          transactionId: transaction
     })
}

module.exports = { createTransaction, createInitialFundsTransaction }