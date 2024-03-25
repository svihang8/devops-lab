import * as Joi from 'joi';
import { Account } from '../../models/Account';
import { Request, Response, NextFunction } from 'express';
import { Document } from 'mongoose';
/*
login takes in parameters, validates their type, matches uid and password, and
logs in.
*/
const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { EMAIL, PASSWORD } = req.body;

    const validationSchema = Joi.object({
      'password': Joi.string(),
      'email': Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    });
    let { error, value } = await validationSchema.validateAsync({
      'password': PASSWORD,
      'email': EMAIL,
    });

    if (error) {
      res.status(400).json({ 'message': value });
      return;
    }

    const DOCUMENT: Document | null = await Account.findOne({ email: EMAIL, password: PASSWORD });

    if (!DOCUMENT) {
      res.status(400).json({ 'message': 'invalid email or password' });
      return;
    }

    res.status(200).json({ 'message': 'success', 'user': DOCUMENT });

    next();

  } catch (error) {
    res.status(500).send();
  }
};

module.exports = login;