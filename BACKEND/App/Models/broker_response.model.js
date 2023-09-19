const mongoose = require('mongoose');

const { Schema, model } = require('mongoose');
const BrokerResponseSchema = Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "USER"
    },
    symbol: {               //SYMBOL FOR IDENTIFY TRADE
        type: String,
    },
    type: {                 //TYPE TRADE WHICH TYPE   [LE,LX,SE,SX]                        
        type: String,
    },
    trading_symbol: {       //TRADING_SYMBOL IF SYMBOL IS NOT EMPTY TO FILL OTHER WISE IS EMPTY
        type: String,
    },
    strategy: {             //STRATEGY ON THIS STRATEGY TO TRADE EXCUTE
        type: String,
    },
    broker_name: {          //BROKER NAME
        type: String,
    },
    send_request: {         //SEND REQUEST TO LIKE TRADE [DATA] 
        type: String,
    },
    order_status: {         //FIRST PLACE ORDER STATUS 
        type: String,
    },
    reject_reason: {        // FIRCT PLACE ORDER REJECT RESON
        type: String,
    },
    receive_signal: {
        type: String,
    },
    order_id: {             //IF TRADE EXCUTE TRUE HIS ORDER ID
        type: String,
    },
    signal: {               //BROKERRESPONSE TO TRADE HIS CLIECK ON THIS FILE
        type: String,
    },
    order_view_status: {    //ORDER VIEW BUTTON  0 = NO CLICK , 1 = CLICK  
        type: String,
        enum: ['0', '1'],
        default: '0'
    },
    order_view_response: {  //IF SECOND API CALL TO get response data
        type: String,

    },
    order_view_date: {      //SECOND API ALL DATA STORE IN BASE64 FORM
        type: String,
    },

    open_possition_qty: {   // IF EXIT THA ORDER AND POSTION TRADE QYT
        type: String,

    },
    client_persnal_key: {   //IF TRADE ID PERSNAL TO PERSNAL KEY
        type: String,
    },
    token: {                //SYMBOL TOKEN 
        type: String,
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

const BrokerResponse = model('broker_response', BrokerResponseSchema);
module.exports = BrokerResponse;


