const joi = require('joi');
const bcrypt = require('bcryptjs')
const Account = require('../../models/Account');

/*
login takes in parameters, validates their type, matches uid and password, and
logs in.
*/
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const validationSchema = Joi.object({
      password: Joi.string(),
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    });
    let { error, value } = await validationSchema.validateAsync({
      password: password,
      email: email
    })
    if (error) {
      res.status(400).json({ 'message': value });
      return;
    }

    const document = await Account.findOne({ email: email, password: password });

    if (!document) {
      res.status(400).json({ 'message': 'invalid email or password' });
      return;
    }

    res.status(200).json({ 'message': 'success', 'user': document });

    next();

  } catch (error) {
    res.status(500).send();
  }
};

module.exports = login;