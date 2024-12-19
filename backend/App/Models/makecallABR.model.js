const mongoose = require('mongoose');

const { Schema, model } = require('mongoose');
const MakecallABRsSchema = Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "USER",
        index: true
    },
    Symbol: {
        type: String,
        default: null
    },
    TType: {
        type: String,
        default: null
    },
    Tr_Price: {
        type: String,
        default: null
    },
    Price: {
        type: String,
        default: null
    },
    EntryPrice: {
        type: String,
        default: null
    },
    Sq_Value: {
        type: String,
        default: null
    },
    Sl_Value: {
        type: String,
        default: null
    },
    TSL: {
        type: String,
        default: null
    },
    Segment: {
        type: String,
        default: null
    },
    Strike: {
        type: String,
        default: null
    },
    OType: {
        type: String,
        default: null
    },
    Expiry: {
        type: String,
        default: null
    },
    Strategy: {
        type: String,
        default: null
    },
    Quntity: {
        type: String,
        default: null
    },
    Key: {
        type: String,
        default: null
    },
    TradeType: {
        type: String,
        default: null
    },
    Target: {
        type: String,
        default: null
    },
    StopLoss: {
        type: String,
        default: null
    },
    ExitTime: {
        type: String,
        default: null
    },
    NoTradeTime: {
        type: String,
        default: null
    },
    sl_status: {
        type: String,
        default: null
    },
    token: {
        type: String,
        default: null
    },
    EntryPriceRange_one: {
        type: String,
        default: null
    },
    EntryPriceRange_two: {
        type: String,
        default: null
    },
    ABR_TYPE: {
        type: String,
        default: null
    },
    marketTimeAmo: {
        type: String,
        default: null
    },
    WiseTypeDropdown: {
        type: String,
        default: null
    },
    status: {
        type: Number,
        default: '0'
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

const makecallABR = model('makecallABRs', MakecallABRsSchema);
module.exports = makecallABR;


