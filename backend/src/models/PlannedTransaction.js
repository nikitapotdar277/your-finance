import mongoose from 'mongoose';

const PLANNED_TYPES = ['income', 'expense'];

const plannedTransactionSchema = new mongoose.Schema(
  {
    monthKey: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: PLANNED_TYPES,
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    fromAccount: {
      type: String,
      required: true,
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

plannedTransactionSchema.index({ monthKey: 1, type: 1 });

export const PlannedTransaction = mongoose.model('PlannedTransaction', plannedTransactionSchema);
