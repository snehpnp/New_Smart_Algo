const mongoose = require('mongoose');

const AliceTokenSchema = new mongoose.Schema({
    symbol: {
        type: String,
        required: true,
    },
    expiry: {
        type: String,

    },
    expiry_month_year: {
        type: String,
    },
    expiry_date: {
        type: String,
    },
    expiry_str: {
        type: String,
    },
    strike: {
        type: String,
    },
    option_type: {
        type: String,
    },
    segment: {
        type: String,
    },
    instrument_token: {
        type: String,
    },
    lotsize: {
        type: String,
    },
    tradesymbol: {
        type: String,
    },  
    exch_seg: {
        type: String,
    },
    tradesymbol_m_w: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

}, {
    // This enables Mongoose to handle the _id field automatically
    _id: true,
});

const alice_tokens = mongoose.model('alice_token', AliceTokenSchema);
module.exports = alice_tokens;
