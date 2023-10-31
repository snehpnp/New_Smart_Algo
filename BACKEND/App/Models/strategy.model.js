const mongoose = require('mongoose');

const { Schema, model } = require('mongoose');
const strategySchema = Schema({
    strategy_name: {
        type: String,
        unique: true
    },
    strategy_amount: {
        type: String,
        default: null

    },
    strategy_amount_month: {
        type: String,
        default: null
    },
    strategy_amount_quarterly: {
        type: String,
        default: null
    },
    strategy_amount_half_early: {
        type: String,
        default: null
    },
    strategy_amount_early: {
        type: String,
        default: null
    },
    strategy_description: {
        type: String,
        default: null
    },
    strategy_category: {
        type: String,
        default: null
    },
    strategy_segment: {
        type: String,
        default: null,
        index: true
    },
    strategy_indicator: {
        type: String,
        default: null
    },
    strategy_tester: {
        type: String,
        default: null
    },
    strategy_image: {
        type: String,
        default: null
    },
    plans: [{
        type: String, // Define the type for 'type' property
        price: Number // Define the type for 'price' property
    }],
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
