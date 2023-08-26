const mongoose = require('mongoose');

const { Schema, model } = require('mongoose');
const strategySchema = Schema({
    strategy_name: {
        type: String,
        // required: true,
        unique: true
    },
    strategy_amount: {
        type: String,
        // required: true,
        default: null

    },
    strategy_description: {
        type: String,
        // required: true,
        default: null
    },
    strategy_category: {
        type: String,
        // required: true,
        default: null
    },
    strategy_segment: {
        type: String,
        // required: true,
        default: null
    },
    strategy_indicator: {
        type: String,
        // required: true,
        default: null
    },
    strategy_tester: {
        type: String,
        // required: true,
        default: null
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

const strategy = model('strategy', strategySchema);
module.exports = strategy;
