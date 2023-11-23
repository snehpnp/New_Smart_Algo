const { Schema, model } = require('mongoose');
//  const mongoose = require('mongoose');


const Broker_infor_Schema = Schema({


    broker_name: {
        type: String,
        unique: true,
        default: null

    },
    app_code: {
        type: String,
        default: null

    },
    apiSecret: {
        type: String,
        default: null
    },
    api_key: {
        type: String,
        default: null
    },
    client_code: {
        type: String,
        default: null
    },
    broker_id: {
        type: String,
        enum: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], //1 = Market Hub,2=Alice Blue,3=Master Trust , 4 = Motilal Oswal 5="Zebull" ,6="IIFl" ,7="Kotak" ,8="Mandot" ,9="Choice" ,10="Anand Rathi" ,11="B2C" ,12="Angel" ,13="5-Paisa" ,14="Zerodha"
        default: '0'
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
