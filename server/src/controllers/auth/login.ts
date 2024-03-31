import * as Joi from 'joi';
import { Account } from '../../models/Account';
import { Request, Response, NextFunction } from 'express';
import { Document } from 'mongoose';
import { compare } from '../../utils/bcrypt';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const validationSchema = Joi.object({
      'password': Joi.string().required(),
      'email': Joi.string().required()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    });

    const { value, error } = await validationSchema.validate({
      'password': password,
      'email': email,
    });

    if (error) {
      res.status(422).json({
        'message': 'error',
        'error': 'missing email or password'
      }).end();
    }

    const DOCUMENT: Document | null = await Account.findOne({ 'email': email });
    console.log(DOCUMENT);
    if (!DOCUMENT) {
      res.status(400).json({
        'message': 'error',
        'error': 'invalid email',
      }).end();
    }

    const hashedPassword = DOCUMENT?.toObject()['password'];
    console.log(`hashed password\n${hashedPassword}`)
    const isValid = await compare(password, hashedPassword);
    console.log(`valid?\n${isValid}`)
    if (!isValid) {
      res.status(400).json({
        'message': 'error',
        'error': 'invalid password',
      }).end();
    }

    res.status(200).json({
      'message': 'success',
      'user': 'account successfully logged in'
    });

    //next();

  } catch (error) {
    //console.error(error);
    res.status(500).json();
  }
};