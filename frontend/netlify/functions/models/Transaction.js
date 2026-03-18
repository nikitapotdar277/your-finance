import mongoose from 'mongoose';

const VALID_TYPES = ['expense', 'income', 'card_payment', 'reimbursement', 'transfer'];

const transactionSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    monthKey: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: VALID_TYPES,
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    fromAccount: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    toAccount: {
      type: String,
      default: '',
      trim: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

transactionSchema.index({ monthKey: 1, type: 1 });
transactionSchema.index({ monthKey: 1, category: 1 });
transactionSchema.index({ monthKey: 1, fromAccount: 1 });

export const Transaction = mongoose.model('Transaction', transactionSchema);
