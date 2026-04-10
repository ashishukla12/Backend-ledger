const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({

  fromAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: [true, 'From account is required'],
    index: true
  },
  toAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account', 
    required: [true, 'To account is required'],
    index: true
  },
  status:{
    type: String,
    enum: {
      values: ['pending', 'completed', 'failed','reversed'],
      message: 'Status must be either pending, completed, failed or reversed'
    },
    default: 'pending'
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required for creating a transaction'],
    min: [0, 'Transaction amount cannot be negative']
  },
  idempotencyKey: {
    type: String,
    required: [true, 'Idempotency key is required for creating a transaction'],
    unique: true,
    index: true
  }
}, { 
  timestamps: true 
})

const transactionModel = mongoose.model("transaction", transactionSchema)

module.exports = transactionModel