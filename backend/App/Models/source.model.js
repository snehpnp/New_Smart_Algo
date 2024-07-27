const mongoose = require('mongoose');

const { Schema, model } = require('mongoose');
const sourcesSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    value: {
        type: String,
        required: true,
    },
  
}, {
    // This enables Mongoose to handle the _id field automatically
    _id: true,
    timestamps: true
});

const sources = model('sources', sourcesSchema);
module.exports = sources;


