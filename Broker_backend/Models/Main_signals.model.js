const mongoose = require('mongoose');

const { Schema, model } = require('mongoose');
const MainSignalsSchema = Schema({
    symbol: {
        type: String,
    },
    entry_type: {
        type: String,
    },
    exit_type: {
        type: String,
    },
    entry_price: {
        type: String,
    },
    exit_price: {
        type: String,
    },
    entry_qty_percent: {
        type: String,
    },

    exit_qty_percent: {
        type: String,
    },
    entry_dt_date: {
        type: String,
    },
    exit_dt_date: {
        type: String,
    },
    exchange: {
        type: String,
    },

    strategy: {
        type: String,
    },
    option_type: {
        type: String,
    },

    dt: {
        type: String,
    },
    strike: {
        type: String,
    },
    expiry: {
        type: String,
    },
    segment: {
        type: String,
    },
    trade_symbol: {
        type: String,
    },
    client_persnal_key: {
        type: String,
    },
    token: {
        type: String,
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

const MainSignal = model('MainSignal', MainSignalsSchema);
module.exports = MainSignal;


