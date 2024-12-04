"use strict"

const { Schema, model } = require('mongoose');
const mongoose = require('mongoose')
const Role = require('./role.model')

// Employee Financial Information Collection
const userReedeem = Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "USER"
    },
    reedeem_points: {
        type: Number
    },
    ActiveStatus: {
        type: String,
        enum: ['0', '1','2'],  //0 = panding 1= reject 2= approved
        default: '0'
    },
},
{
    timestamps: true
}
)
const userReedeem_modal = model('User_reedeem', userReedeem);



module.exports = userReedeem_modal;
