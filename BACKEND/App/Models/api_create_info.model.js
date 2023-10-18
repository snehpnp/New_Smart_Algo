const mongoose = require('mongoose');

const panelSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please enter Panel name unique!"],
        unique: true
    },
    broker_id: {
        type: String,
        // required: [true, "Please enter Panel name unique!"],
        // unique: true
    },
    description: {
        type: String,
        required: true,
        // unique: true
    },
    steponeurl: {
        type: String,
        // required: true,
        // unique: true
    },
    imageone: {
        type: String,
        // unique: true
    },
    steptwourl: {
        type: String,
        // unique: true
    },
    imagetwo: {
        type: String,
        // required: true,
        // unique: true
    },
    stepthree: {
        type: String,
        // unique: true
    },
    imagethree: {
        type: String,
        // required: true,
        // unique: true
    },
    note: {
        type: String,
        // required: true,
        // unique: true
    },
    youtubeurl: {
        type: String,
        // required: true,
        // unique: true
    },



}, {
    timestamps: true
});

const panel_model = mongoose.model('api_create_info', panelSchema);
module.exports = panel_model;
