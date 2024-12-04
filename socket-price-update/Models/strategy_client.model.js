const mongoose = require('mongoose');

const { Schema, model } = require('mongoose');
const strategy_clientSchema =  Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "USER",
        index: true
    },
    strategy_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "strategy",
        index: true
    },
  
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    // This enables Mongoose to handle the _id field automatically
    _id: true,
    timestamps: true
});

const strategy_client =model('strategy_client', strategy_clientSchema);
module.exports = strategy_client;
