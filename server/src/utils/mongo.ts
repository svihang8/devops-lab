import * as mongoose from 'mongoose';
import { constants } from '../constants';

export interface MongoDB {
  mongoose: mongoose.Mongoose,
  isConnected: Boolean,
  MONGO_URI: string,
  db?: mongoose.Mongoose,
};

export class MongoDB {
  constructor() {
    this.mongoose = mongoose
    this.isConnected = false
    this.MONGO_URI = constants['MONGO_URI']
    this.db = undefined;
  }

  async connect() {
    if (this.isConnected) return

    try {
      this.db = await this.mongoose.connect(this.MONGO_URI);
      const connection: mongoose.Connection = this.db.connection

      this.isConnected = connection.readyState === 1
      // if (this.isConnected) console.log('MongoDB connected')

      // connection.on('connected', () => console.log(' MongoDB connected')) // re-connected
      // connection.on('disconnected', () => console.log('MongoDB disconnected')) // disconnected
      // connection.on('error', (error) => console.log('MongoDB connection error', error)) // listen for errors during the session
    } catch (error) {
      try {
        if (error instanceof Error) console.log('MongoDB connection error:', error.message)
      } catch (error) {
        console.log('MongoDB connection error not of correct type');
      }

    }
  }
}

export let mongo = new MongoDB()
