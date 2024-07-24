"use strict"

const { Schema, model } = require('mongoose');
const mongoose = require('mongoose')
const Role = require('./role.model')

// Employee Financial Information Collection
const userSignUp = Schema({
    FullName: {
        type: String,
        required: true,
        trim: true,
        default: null
    },
    UserName: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        default: null
    },
    Email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        default: null
    },
    PhoneNo: {
        type: String,
        required: true,
        trim: true,
        min: 10,
        max: 10,
        unique: true,
        default: null
    },
    refer_code: {
        type: String,
        trim: true,
        default: null
    },
    refer_points: {
        type: Number
    },
    ActiveStatus: {
        type: String,
        enum: ['0', '1','2'],
        default: '0'
    },
},
{
    timestamps: true
}
)
const UserSignUp_model = model('UserSignUp', userSignUp);



module.exports = UserSignUp_model;
