const mongoose = require('mongoose');

const ledgerSchema = new mongoose.Schema({
  account:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: [true, 'Account is required'],
    index: true,
    immutable: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    immutable: true
  },
  transaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
    required: [true, 'Transaction is required'],
    index: true,
    immutable: true
  },
  type: {
    type: String,
    enum: ['debit', 'credit'],
    required: [true, 'Type is required'],
    immutable: true
  }
})


function preventledgerModification() {
  throw new Error('Ledger entries cannot be modified or deleted');
}

ledgerSchema.pre('save', preventledgerModification);
ledgerSchema.pre('updateOne', preventledgerModification);
ledgerSchema.pre('deleteOne', preventledgerModification);
ledgerSchema.pre('findOneAndUpdate', preventledgerModification);
ledgerSchema.pre('findOneAndDelete', preventledgerModification);
ledgerSchema.pre('findOneAndRemove', preventledgerModification);
ledgerSchema.pre('remove', preventledgerModification);
ledgerSchema.pre('deleteMany', preventledgerModification);
ledgerSchema.pre('updateMany', preventledgerModification);
ledgerSchema.pre('findOneAndReplace', preventledgerModification);

const ledgerModel = mongoose.model("ledger", ledgerSchema);

module.exports = ledgerModel;