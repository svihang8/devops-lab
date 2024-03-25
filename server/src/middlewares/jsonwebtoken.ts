import * as jwt from 'jsonwebtoken';
import { constants } from '../constants';
import { Request, Response, NextFunction } from 'express';


const signToken = (payload = {}, expiresIn = '12hr') => {
  try {
    const token = jwt.sign(payload, constants['JWT_SECRET'], { expiresIn: expiresIn })

    return token;

  } catch (error) {
    console.error(error);
  }
};

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body;

    if (!token) {
      res.status(401).json({
        message: 'missing JWT'
      });
    }

    const auth = jwt.verify(token, constants['JWT_SECRET']);

    if (!auth) {
      res.status(401).json({
        message: 'JWT not valid'
      })
    }

    req.body.auth = auth;

    next();

  } catch (error) {
    res.status(500).send();
  }
};

module.exports = { signToken, verifyToken };