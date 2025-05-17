import { model, Schema } from 'mongoose';
import validator from 'validator';

const usersSchema = new Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, 'Неверный формат email'],
    },
    password: { type: String, required: true },
    balance: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false },
);

usersSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  obj.balance = Number(obj.balance).toFixed(2);
  return obj;
};

export const UsersCollection = model('users', usersSchema);
