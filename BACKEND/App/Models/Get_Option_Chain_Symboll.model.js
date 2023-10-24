const mongoose = require('mongoose');

const Get_Option_Chain_Symboll_Schema = new mongoose.Schema({

    symbol: {
        type: String,
        required: true,
        index: true
    },
    token: {
        type: String,
        required: true,
        index: true
    },
    price: {
        type: String,
        required: true,
        index: true
    },
}, {
    _id: true,
    timestamps: true
});

const option_chain_symbols = mongoose.model('option_chain_symbols', Get_Option_Chain_Symboll_Schema);
module.exports = option_chain_symbols;
