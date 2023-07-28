

"use strict"

const { Schema, model } = require('mongoose');
const mongoose = require('mongoose')
const Role = require('./role.model')

// Employee Financial Information Collection
const userModel = Schema({
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
        unique: true,
        default: null
    },
    Password: {
        type: String,
        required: true,
        trim: true,
        default: null
    },
    Otp: {
        type: String,
        required: true,
        trim: true,
        default: null
    },
    CreateDate: {
        type: Date,
        default: Date.now
    },
    StartDate: {
        type: Date,
        required: true,
        default: null
    },
    EndDate: {
        type: Date,
        required: true,
        default: null
    },
    LoginStatus: {
        type: String,
        enum: ['0', '1'],
        default: '0'
    },

    Role: {
        type: String,
        required: true
    }

},
    {
        timestamps: true
    },

)
const User_model = model('USER_MODEL', userModel);



module.exports = { User_model: User_model };
