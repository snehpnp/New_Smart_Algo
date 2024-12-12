const mongoose = require('mongoose');

const StockLivePrice = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
        unique: true, 
    },
    curtime: {
        type: String,
        required: true,
        index: true
    },
    exc : {
        type: String,
        required: true
    },
    ft :{
        type: String,
        required: true
    },
    lp : {
        type: String,
        required: true
    },
}, {
    _id: true, 
});

const Stock_Live_Price = mongoose.model('stock_live_price', StockLivePrice, 'stock_live_price');
module.exports = Stock_Live_Price;
