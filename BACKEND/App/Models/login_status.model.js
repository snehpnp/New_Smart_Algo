const mongoose = require('mongoose');

const userActivitySchema = new mongoose.Schema({
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

const Role = mongoose.model('login_status', userActivitySchema);
module.exports = Role;
