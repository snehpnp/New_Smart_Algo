const mongoose = require('mongoose');

const themeSchema = new mongoose.Schema({
    themeId: {
        type: Number,
        unique: true
    },
    theme_name: {
        type: String,
        required: true,
        unique: true,
        default: null
    },
    theme_version: {
        type: String,
        required: true,
        default: null
    },
    primary_col: {
        type: String,
        required: true,
        default: null
    },
     nav_head_col: {
        type: String,
        required: true,
        default: null
    },
     header_col: {
        type: String,
        required: true,
        default: null
    },
     sidebar_col: {
        type: String,
        required: true,
        default: null
    },
    layout: {
        type: String,
        required: true,
        default: null
    },
    sidebar: {
        type: String,
        required: true,
        default: null
    },
    header_position: {
        type: String,
        required: true,
        default: null
    },
    header_position: {
        type: String,
        required: true,
        default: null
    },
    container: {
        type: String,
        required: true,
        default: null
    },
    body_font: {
        type: String,
        required: true,
        default: null
    },
    dashboard: {
        type: String,
        required: true,
        default: null
    },
    image: {
        type: String,
        required: true,
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

const Theme_List = mongoose.model('theme_list', themeSchema);
module.exports = Theme_List;
