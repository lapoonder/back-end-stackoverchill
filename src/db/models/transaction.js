import { model, Schema } from 'mongoose';
import { CategoriesCollection } from './category.js';

const transactionsSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['income', 'expense'],
      default: 'expense',
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'categories',
      required: true,
      validate: {
        validator: async function (value) {
        const category = await CategoriesCollection.findById(value);
        return !!category
      }, message: "Invalid category"
      }

    },
    date: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0.01, 'Сумма должна быть больше 0'],
      max: [1000000, 'Сумма не может превышать 1 000 000'],
    },
    comment: {
      type: String,
      minlength: [2, 'Комментарий должен содержать минимум 2 символа'],
      maxlength: [192, 'Комментарий не должен превышать 192 символа'],
      default: '',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const TransactionsCollection = model('transactions', transactionsSchema);
