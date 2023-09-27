const mongoose = require('mongoose');

const userActivitySchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "USER"
    },
    Strategy: {
        type: String,
        default: null
    },
    quantity: {
        type: String,
        default: null
    },

    message: {
        type: String,
        default: null
    },
    role: {
        type: String,
        default: null
    },
    device: {
        type: String,
        default: null
    },
    system_ip: {
        type: String,
        default: null
    },
    custom_date: {
        type: String,
        default: new Date()
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    // This enables Mongoose to handle the _id field automatically
    _id: true,
});

const user_activity_logs = mongoose.model('user_activity_logs', userActivitySchema);
module.exports = user_activity_logs;
