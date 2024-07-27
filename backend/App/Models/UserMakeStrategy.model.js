const mongoose = require('mongoose');

const userMakeStrategySchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "USER"
    },
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        default: null
    },
    tokensymbol: {
        type: String,
        required: true,
    },
    show_strategy: {
        type: String,
        required: true,
    },
    symbol_name: {
        type: String,
        required: true,
    },
    strategy_name: {
        type: String,
        required: true,
    },
    segment: {
        type: String,
        required: true,
    },
    strike_price: {
        type: String,
    },
    option_type: {
        type: String,
    },
    expiry: {
        type: String,
    },

    indicator: {
        type: String,
        required: true,
    },
    timeframe: {
        type: String,
    },
    price_source: {
        type: String,
        required: true,
    },
    period: {
        type: String,
        required: true,

    },
    inside_indicator: {
        type: String,
        required: true,

    },
    condition: {
        type: String,
        required: true,
    },
    exch_seg: {
        type: String,
    },
    condition_source: {
        type: String,
    },
    buffer_value: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    offset: {
        type: String,
        required: true,
    },
    target: {
        type: String,
        required: true,
    },
    stoploss: {
        type: String,
        required: true,
    },
    tsl: {
        type: String,
        required: true,
    },
    panelKey: {
        type: String,
        required: true,
    },
    entryTime: {
        type: Date,
    },
    exitTime: {
        type: Date,
    },
    notradeTime: {
        type: Date,
    },
    condition_array: {
        type: Object,
        required: true,
    },
    timeTradeConddition_array: {
        type: Object,
        required: true,
    },
    target_stoloss_array: {
        type: Object,
        required: true,
    },
    numberOfTrade: {
        type: String,
    },
    maxProfit: {
        type: String,
    },
    maxLoss: {
        type: String,
    },
    numberOfTrade_count_trade: {
        type: Number,
        default: 0
    },


    status: {
        type: String,
        enum: ['1', '2'],
        default: '1'
    }

}, {
    // This enables Mongoose to handle the _id field automatically
    strictPopulate: false,

    timestamps: true,
    _id: true,
});

const userMakeStrategy = mongoose.model('usermakestrategy', userMakeStrategySchema);
module.exports = userMakeStrategy;
