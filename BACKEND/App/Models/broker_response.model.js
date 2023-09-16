const mongoose = require('mongoose');

const { Schema, model } = require('mongoose');
const BrokerResponseSchema = Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "USER"
    },
    symbol: {
        type: String,
    },
    type: {
        type: String,
    },
    trading_symbol: {
        type: String,
    },
    strategy: {
        type: String,
    },
    exchange: {
        type: String,
    },
    option_type: {
        type: String,
    },
    expiry: {
        type: String,
    },
    broker_name: {
        type: String,
    },
    send_request: {
        type: String,
    },
    order_status: {
        type: String,
    },
    reject_reason: {
        type: String,
    },
    receive_signal: {
        type: String,
    },
    order_id: {
        type: String,
    },
    signal: {
        type: String,
    },
    order_view_status: {
        type: String,
        enum: ['0', '1'],
        default: '0'
    },
    order_view_response: {
        type: String,

    },
    order_view_date: {
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

const BrokerResponse = model('broker_response', BrokerResponseSchema);
module.exports = BrokerResponse;


