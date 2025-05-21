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
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0.01, 'The amount must be greater than 0'],
      max: [1000000, 'The amount cannot exceed 1 000 000'],
    },
    comment: {
      type: String,
      minlength: [2, 'Comment must contain at least 2 characters'],
      maxlength: [192, 'The comment must not exceed 192 characters'],
      default: '',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

transactionsSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.createdAt;
  delete obj.updatedAt;

  // Приводим дату к формату YYYY-MM-DD
  if (obj.date instanceof Date) {
    obj.date = obj.date.toISOString().split('T')[0];
  }

  return obj;
};

export const TransactionsCollection = model('transactions', transactionsSchema);
