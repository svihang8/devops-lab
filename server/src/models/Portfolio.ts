import * as mongoose from 'mongoose';

const INSTANCE: mongoose.Schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
        },
        stocks: {
            type: [{
                'stock': String,
                'amount': String,
            }]
        }
    },
    {
        timestamps: true,
    },
)

const MODEL_NAME: string = 'Portfolio';

export const Portfolio = mongoose.model(MODEL_NAME, INSTANCE);
