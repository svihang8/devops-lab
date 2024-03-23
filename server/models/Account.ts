const mongoose = require('mongoose')

/*
validate if email matches regex expression
*/
const validateEmail = (email) => {
  const RE = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return RE.test(email)
}

/*
schema definition of Account model
*/
const instance = new mongoose.Schema(
  {
    /*
      document ID is set by default via MongoDB - next line is deprecated
      _id: mongoose.Schema.Types.ObjectId,
    */
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
      type: [Portfolio],
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

const modelName = 'Account'

module.exports = mongoose.model(modelName, instance)
