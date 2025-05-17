import { model, Schema } from 'mongoose';

const categoriesSchema = new Schema(
  {
    name: { type: String, required: true },
    categoryType: {
      type: String,
      required: true,
      enum: ['income', 'expense'],
      default: 'income',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const CategoriesCollection = model('categories', categoriesSchema);
