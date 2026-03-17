import mongoose from 'mongoose';

const openingBalanceSchema = new mongoose.Schema(
  {
    monthKey: {
      type: String,
      required: true,
      index: true,
    },
    account: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

openingBalanceSchema.index({ monthKey: 1, account: 1 }, { unique: true });

export const OpeningBalance = mongoose.model('OpeningBalance', openingBalanceSchema);
