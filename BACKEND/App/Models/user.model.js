

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
        min: 10,
        max: 10,
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
        // required: true,
        default: null
    },
    EndDate: {
        type: Date,
        // required: true,
        default: null
    },
    ActiveStatus: {
        type: String,
        enum: ['1', '0'],
        default: '1'
    },
    Role: {
        type: String,
        required: true
    },
    AppLoginStatus: {
        type: String,
        required: true,
        enum: ['0', '1'],
        default: '0'
    },
    WebLoginStatus: {
        type: String,
        required: true,
        enum: ['0', '1'],
        default: '0'
    },
    TradingStatus: {
        type: String,
        enum: ['off', 'on'],
        default: 'off'
    },
    client_key: {
        type: String,
        required: true,
        trim: true,
        default: null
    },
    client_key: {
        type: String,
        required: true,
        trim: true,
        default: null
    },
    reset_password_status: {
        type: String,
        required: true,
        trim: true,
        default: '0'
    },


},
    {
        timestamps: true
    },

)
const User_model = model('USER', userModel);



module.exports = User_model;
