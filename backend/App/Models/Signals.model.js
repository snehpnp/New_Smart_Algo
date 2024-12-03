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
    exit_status: {
        type: String,
        default: null
    },
    ft_time: {
        type: String,
        default: null
    },

    target: {
        type: String,
        default:0
    },
    stop_loss: {
        type: String,
        default:0

    },
    exit_time: {
        type: String,
        default:0
    },
    exit_time1: {
        type: String,
        default:0
    },
    sl_status: {
        type: String,
        enum: ['0', '1'], // 1 = Admin panel status , 2 = Tradinview status
        default: '0'
    },
    price_type: {
        type: String,
        default: ''
    },
    users_id: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        }
    ],
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


