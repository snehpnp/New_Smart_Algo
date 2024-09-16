const mongoose = require('mongoose');

const PlanSchema  = new mongoose.Schema({
    name: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    prices: {
      monthly: { type: Number, required: true },
      quarterly: { type: Number, required: true },
      halfYearly: { type: Number, required: true },
      yearly: { type: Number, required: true },
    }
    
}, {
    // This enables Mongoose to handle the _id field automatically
    _id: true,
});

const plans = mongoose.model('Plan', PlanSchema );
module.exports = plans;
