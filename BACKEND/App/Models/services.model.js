const mongoose = require('mongoose');

const servicesSchema = new mongoose.Schema({
    user_Id: {
        type: String,
        required: true,
        unique: true    
    },
     login_status: {
        type: String,
        required: true,
        unique: true
    },
   
    createdAt: {
        type: Date,
        default: Date.now
    }
},{
    // This enables Mongoose to handle the _id field automatically
    _id: true,
  });

const Services = mongoose.model('Services', servicesSchema);
module.exports = Services;
