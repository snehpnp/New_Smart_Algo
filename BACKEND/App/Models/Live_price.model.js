const mongoose = require('mongoose');

const LivePriceSchema = new mongoose.Schema({

    broker_name: {
        type: String,
        default: null
    },
    user_id: {
        type: String,
        default: null
    },
    access_token: {
        type: String,
        default: null

    },
    trading_status: {
        type: String,
        default: null
    },
    Role: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},
    {
        timestamps: true,
        _id: true,
    });

const live_price_data = mongoose.model('live_price', LivePriceSchema);
module.exports = live_price_data;
