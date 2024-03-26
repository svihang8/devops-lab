import * as jwt from 'jsonwebtoken';
import { constants } from '../constants';
import { Request, Response, NextFunction } from 'express';


export const signToken = (payload: string | Buffer | object = {}, expiresIn = '12hr') => {
  try {
    const token = jwt.sign(payload, constants['JWT_SECRET'], { expiresIn: expiresIn })

    return token;

  } catch (error) {
    console.error(error);
  }
};

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body;

    if (!token) {
      res.status(401).json({
        message: 'token missing'
      });
    }

    let auth: string | jwt.JwtPayload;

    try {
      auth = jwt.verify(token, constants['JWT_SECRET'])
      req.body.auth = auth;
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        res.status(401).json({
          message: 'token expired'
        })
      }
    }

  } catch (error) {
    console.error(error);
    res.status(500).json();
  }
};