import * as mongoose from 'mongoose';

/*
validate if email matches regex expression
*/
const validateEmail = (email: string) => {
  const RE = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return RE.test(email)
}

/*
schema definition of Account model
*/
const INSTANCE: mongoose.Schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      validate: [validateEmail, 'invalid email address']
    },
    password: {
      type: String,
      required: true,
    },
    portfolios: {
      type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Portfolio'
      }],
      default: []
    },
    role: {
      type: String,
      required: true,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  },
)

const MODEL_NAME: string = 'Account'

export const Account = mongoose.model(MODEL_NAME, INSTANCE);
