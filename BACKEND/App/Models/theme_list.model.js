const mongoose = require('mongoose');

const themeSchema = new mongoose.Schema({
    themeId: {
        type: Number,
        // required: true,
        unique: true
    },
    theme_name: {

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
