import { model, Schema } from 'mongoose';

const categoriesSchema = new Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ['income', 'expense'],
      default: 'expense',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const CategoriesCollection = model('categories', categoriesSchema);
