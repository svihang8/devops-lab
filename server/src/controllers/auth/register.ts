import * as Joi from 'joi';
import { Account } from '../../models/Account';
import { Request, Response, NextFunction } from 'express';
import { Document } from 'mongoose';

/*
register takes in parameters, validates their type, and creates an document
in Account.
*/
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { USERNAME, PASSWORD, EMAIL } = req.body;

    const VALIDATION_SCHEMA: Joi.ObjectSchema = Joi.object({
      'username': Joi.string(),
      'password': Joi.string(),
      'email': Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    });

    let validationError: Joi.ValidationError;

    let { error, value } = await VALIDATION_SCHEMA.validateAsync({
      'username': USERNAME,
      'password': PASSWORD,
      'email': EMAIL
    });
    validationError = error;

    if (validationError) {
      res.status(400).json({ 'message': validationError });
      return;
    }

    const DOCUMENT: Document = await Account.create({
      username: USERNAME, password: PASSWORD, email: EMAIL
    });

    res.status(200).json({
      'message': 'success',
      'user': DOCUMENT,
    });

    next();
  } catch (error) {
    res.status(500).send();
  }
};