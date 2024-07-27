const mongoose = require('mongoose');

const MessageBrodcastSchema = new mongoose.Schema({

    // strategy_id: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "strategies"
    // },

    Message: {
        type: String,
        default: null

    },
    broker_id: {
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

const Messagebrodcast_data = mongoose.model('Messagebrodcast', MessageBrodcastSchema);
module.exports = Messagebrodcast_data;
