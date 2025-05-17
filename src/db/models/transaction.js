import { model, Schema } from 'mongoose';

const transactionsSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'categories',
      required: true,
    },
    date: {
      type: String,
      required: true,
      validate: {
        validator: (v) => /^\d{4}-\d{2}-\d{2}$/.test(v),
        message: 'Дата должна быть в формате ГГГГ-ММ-ДД',
      },
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
