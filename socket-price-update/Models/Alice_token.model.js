const mongoose = require('mongoose');

const AliceTokenSchema = new mongoose.Schema({
    symbol: {
        type: String,
        required: true,
        index: true
    },
    expiry: {
        type: String,
        index: true

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
        index: true
    },
    option_type: {
        type: String,
        index: true
    },
    segment: {
        type: String,
        index: true
    },
    instrument_token: {
        type: String,
        // unique: true
        
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
    tkr : {
        type: String,
        default: null
    },
    a3tkr : {
        type: String,
        default: null
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
