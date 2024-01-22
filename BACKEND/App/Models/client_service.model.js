const mongoose = require('mongoose');

const { Schema, model } = require('mongoose');
const clientServiceSchema = Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "USER"
    },
    group_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "serviceGroupName"
    },
    service_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Services"
    },
    strategy_id:[ 
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "strategy"
       }
    ],
    order_type: {
        type: String,
        enum: ['1', '2', '3', '4'],
        default: '1'
    },
    product_type: {
        type: String,
        enum: ['1', '2', '3', '4'],
        default: '2'
    },
    active_status: {
        type: String,
        enum: ['0', '1'],
        default: '1'
    },
    quantity: {
        type: String,
        default: '1'
    },
    lot_size: {
        type: String,
        default: '1'
    },
    uniqueUserService: {
        type: String,
        default: null
    },
}, {

    _id: true,
    timestamps: true
});

const client_services = model('client_services', clientServiceSchema);
module.exports = client_services;
