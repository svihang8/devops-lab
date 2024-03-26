import * as path from 'path';
require('dotenv').config({ path: path.resolve(__dirname, `../../.env`) });
const NODE_ENV: string | undefined = process.env.NODE_ENV;
require('dotenv').config({ path: path.resolve(__dirname, `../../.env.${NODE_ENV}`) });

export interface Constants {
  ORIGIN: string,
  PORT: number,
  MONGO_URI: string,
  JWT_SECRET: string,
}

export class Constants {
  constructor() {
    this.ORIGIN = '*';
    this.PORT = parseInt(process.env.PORT || '8080');
    this.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/MyDatabase';
    this.JWT_SECRET = process.env.JWT_SECRET || 'unsafe_secret';
  }
}


export let constants = new Constants();