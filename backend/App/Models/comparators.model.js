const mongoose = require('mongoose');

const { Schema, model } = require('mongoose');
const comparatorsSchema = Schema({
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

const comparators = model('comparators', comparatorsSchema);
module.exports = comparators;


