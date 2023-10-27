const mongoose = require('mongoose');

const panelSchema = new mongoose.Schema({
    panel_name: {
        type: String,
        required: [true, "Please enter Panel name unique!"],
        unique: true
    },
    domain: {
        type: String,
        required: [true, "Please enter Domain name unique!"],
        unique: true
    },
    port: {
        type: String,
        required: [true, "Please enter Port name unique!"],

    },
    key: {
        type: String,
        unique: true
    },
    db_url: {
        type: String,
        unique: true
    },
    db_name: {
        type: String,
        // unique: true
    },
    ip_address: {
        type: String,
        required: true
    },
    is_active: {
        type: Number, // Change the type to Number
        enum: [1, 0], // Use numbers instead of strings
        default: 1
    },
    is_expired: {
        type: Number, // Change the type to Number
        enum: [1, 0], // Use numbers instead of strings
        default: 0
    },
    theme_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'theme_list',

    },
    broker_id: [{
        id: String,
        name: String
    }]
}, {
    timestamps: true
});

const panel_model = mongoose.model('All_panels', panelSchema);
module.exports = panel_model;
