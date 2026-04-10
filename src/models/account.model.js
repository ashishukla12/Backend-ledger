const mongoose = require("mongoose")
const ledger = require("./ledger.model")

const accountSchema = new mongoose.Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"user",
    required: [true, "User reference is required for account"],
    index: true
  },
  status:{
    type: String,
    enum:{
      values:["ACTIVE",'FROZEN','CLOSED'],
      message: "Status must be either ACTIVE, FROZEN or CLOSED"
    },
    default: "ACTIVE"
  },
  currency:{
    type: String,
    required: [true, "Currency is required for account"],
    default: "INR"
  },

},{
  timestamps: true
})

accountSchema.index({user: 1, status: 1}) // Compound index for efficient querying by user and status it uses b+ tree indexing which is efficient for range queries and sorting operations on these fields.

accountSchema.methods.getBalance = async function() {

  const balanceData = await ledgerModel.aggregate([
    {
      $match: {
        account: this._id}
    },
    {
      $group: {
        _id: null,
        totalDebit: {
          $sum: {
            $cond: [
              { $eq: ["$type", "debit"] },
              "$amount",
              0
            ]
          }
        }
      }
    },
    {
      $group: {
        _id: null,
        totalCredit: {
          $sum: {
            $cond: [
              { $eq: ["$type", "credit"] },
              "$amount",
              0
            ]
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        balance: { $subtract: ["$totalCredit", "$totalDebit"] }
      }
    }
  ])

  if(balanceData.length === 0){
    return 0
  }  
  
  return balanceData[0].balance
}

const accountModel = mongoose.model("account", accountSchema)

module.exports = accountModel