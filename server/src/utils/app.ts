import * as express from 'express';
import * as cors from 'cors';
import { constants } from '../constants';
import { Errback, Request, Response, NextFunction } from 'express';
const initialization = () => {
  let app: express.Express = express.default();
  middlewares(app);
  errorHandling(app);
  return app;
};

const middlewares = (app: express.Express) => {
  app.use(cors.default({ origin: constants['ORIGIN'] }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }))
}

const errorHandling = (app: express.Express) => {
  app.use((err: Errback, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500).send();
    next();
    return;
  })
}

export const app: express.Express = initialization();
