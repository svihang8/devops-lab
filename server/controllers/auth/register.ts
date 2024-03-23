const Joi = require('joi');
const Account = require('../../models/Account');

/*
register takes in parameters, validates their type, and creates an document
in Account.
*/
const register = async (req, res, next) => {
  try {
    const { username, password, email } = req.body;
    const validationSchema = Joi.object({
      username: Joi.string(),
      password: Joi.string(),
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    });
    let { error, value } = await validationSchema.validateAsync({
      username: username,
      password: password,
      email: email
    })
    if (error) {
      res.status(400).json({ 'message': value });
      return;
    }
    const document = await Account.create({
      username: username, password: password, email: email
    });
    res.status(200).json({
      'message': 'success',
      'user': document,
    });
    next();
  } catch (error) {
    res.status(500).send();
  }
};

module.exports = register;