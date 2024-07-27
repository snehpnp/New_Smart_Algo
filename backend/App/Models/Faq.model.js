const mongoose = require('mongoose');

const FaqSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true,
    },
    answer1: {
        type: String,
     
    },
    type: {
        type: String,
        required: true,
    },
    img1: {
        type: String,
    
    },
    img2: {
        type: String,
       
    },
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

const FAQ = mongoose.model('FAQ', FaqSchema);
module.exports = FAQ;
