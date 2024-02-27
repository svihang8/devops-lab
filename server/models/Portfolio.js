const mongoose = require('mongoose')

/*
schema definition of Portfolio model
*/
const instance = new mongoose.Schema(
    {
        /*
          document ID is set by default via MongoDB - next line is deprecated
          _id: mongoose.Schema.Types.ObjectId,
        */
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

const modelName = 'Portfolio'

module.exports = mongoose.model(modelName, instance)
