const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');

const serviceGroupName = Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        default: null,
        unique: true,
    },
    description: {
        type: String,
        trim: true,
        default: null
    },
   
  
},
    {
       
        timestamps: true
    },

)
const serviceGroupName_model = model('serviceGroupName', serviceGroupName);



module.exports = serviceGroupName_model;

