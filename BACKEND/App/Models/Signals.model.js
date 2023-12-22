const mongoose = require('mongoose');

const { Schema, model } = require('mongoose');
const SignalsSchema = Schema({
    symbol: {
        type: String,
    },
    type: {
        type: String,
    },
    order_type: {
        type: String,
    },
    product_type: {
        type: String,
    },
    price: {
        type: String,
    },
    qty_percent: {
        type: String,
    },

    exchange: {
        type: String,
    },

    sq_value: {
        type: String,
    },

    sl_value: {
        type: String,
    },
    tsl: {
        type: String,
    },

    tr_price: {
        type: String,
    },
    dt: {
        type: String,
    },
    dt_date: {
        type: String,
    },
    strategy: {
        type: String,
    },
    option_type: {
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
    TradeType: {
        type: String,
    },
    token: {
        type: String,
    },
    lot_size: {
        type: String,
    },
    MakeStartegyName: {
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

const signals = model('signals', SignalsSchema);
module.exports = signals;


