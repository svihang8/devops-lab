import * as Joi from 'joi';
import { Account } from '../../models/Account';
import { Request, Response, NextFunction } from 'express';
import { Document } from 'mongoose';
import { encrypt } from '../../utils/bcrypt';

/*
register takes in parameters, validates their type, and creates an document
in Account.
*/
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password, email } = req.body;

    const VALIDATION_SCHEMA: Joi.ObjectSchema = Joi.object({
      'username': Joi.string().required(),
      'password': Joi.string().required(),
      'email': Joi.string().required()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    });

    const { value, error } = VALIDATION_SCHEMA.validate({
      'username': username,
      'password': password,
      'email': email
    });

    if (error) {
      res.status(422).json({
        "message": "error",
        "error": "missing username, email, or password"
      }).end();;
    }

    const accountExists = await Account.findOne({
      email: email
    });

    if (accountExists) {
      res.status(409).json({
        "message": "error",
        "error": "account already exists"
      }).end();
    }

    const hashedPassword = await encrypt(password);

    const DOCUMENT: Document = await Account.create({
      username: username, password: hashedPassword, email: email
    });

    if (DOCUMENT) {
      res.status(200).json({
        'message': 'success',
        'user': 'account successfully created'
      }).end();;
    };

  } catch (error) {
    res.status(500).json();
  }
};