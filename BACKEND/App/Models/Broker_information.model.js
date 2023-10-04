const { Schema, model } = require('mongoose');
//  const mongoose = require('mongoose');


const Broker_infor_Schema = Schema({
   
   
    broker_name: {
        type: String,
        default:null

    },
    app_code: {
        type: String,
        default:null

    },
    apiSecret: {
        type: String,
        default:null


    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    // This enables Mongoose to handle the _id field automatically
    _id: true,
    timestamps: true
});

const Broker_information = model('Broker_informstion', Broker_infor_Schema);
module.exports = Broker_information;
