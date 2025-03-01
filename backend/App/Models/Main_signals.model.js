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
    entry_qty: {
        type: String,
    },

    exit_qty: {
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

    dt_date: {
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
    complete_trade: {
        type: String,
        enum: ['0', '1'], // 1 = Admin panel status , 2 = Tradinview status
        default: '0'
    },
    exit_status: {
        type: String,
        default: null
    },
    pendin_order_status: {
        type: String,
        default:0
    },
    modify_order_status: {
        type: String,
        default:0
    },

    signals_id: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'signals'
        }
    ],
   Entry_users_id: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        }
    ],
    Exit_users_id: [
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

MainSignalsSchema.index({
    strategy: 1,
    trade_symbol: 1,
    symbol: 1,
    client_persnal_key: 1,
    createdAt: 1,
    segment: 1,
    Entry_users_id: 1
});

const MainSignal = model('MainSignal', MainSignalsSchema);
module.exports = MainSignal;


