const mongoose = require('mongoose');

const Admin_Permission_Schema = new mongoose.Schema({

    Option_chain: {
        type: Number,
        enum: [0, 1],
        default: 0
    },
    Create_Strategy: {
        type: Number,
        enum: [0, 1],
        default: 0
    },
    Trade_History: {
        type: Number,
        enum: [0, 1],
        default: 0
    },

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'all_panels'
    },
}, {
    _id: true,
    timestamps: true
});

const Admin_Permission = mongoose.model('admin_permission', Admin_Permission_Schema);
module.exports = Admin_Permission;
