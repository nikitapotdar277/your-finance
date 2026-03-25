import mongoose from 'mongoose';

const categoryGroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    childCategories: {
      type: [String],
      default: [],
    },
    cardPaymentFilter: {
      toAccounts: {
        type: [String],
        default: [],
      },
      includeCategories: {
        type: [String],
        default: [],
      },
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

categoryGroupSchema.index({ name: 1 });

export const CategoryGroup = mongoose.model('CategoryGroup', categoryGroupSchema);