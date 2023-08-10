const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    category_id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    segment: {
        type: String,
        required: true,
    }, 
    status: {
        type: Number,
        required: true,
        default:0
    },
     CID: {
        type: String,
        required: true,
 
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
    
}, {
    // This enables Mongoose to handle the _id field automatically
    _id: true,
});

const categorys = mongoose.model('category', categorySchema);
module.exports = categorys;
