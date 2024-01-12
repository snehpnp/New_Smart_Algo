

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

    Is_Active: {
        type: String,
        enum: ['1', '0'],
        default: '1'
    },
    Is_First_login: {
        type: String,
        enum: ['1', '0'],
        default: '0'
    },
    Role: {
        type: String,
        required: true
    },
    license_type: {
        type: String,
        enum: ['0', '1', '2'],  // 0 = 2 days 1= Demo 2 =Live
        default: '0'
    },
    licence: {
        type: String,
        default: null
    },

    AppLoginStatus: {
        type: String,
        enum: ['0', '1'],
        default: '0'
    },
    WebLoginStatus: {
        type: String,
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
    parent_id: {
        type: String,
        required: true,

    },
    parent_role: {
        type: String,
        required: true,

    },
    reset_password_status: {
        type: String,
        required: true,
        trim: true,
        default: '0'
    },
    service_given_month: {
        type: String,
        default: null
    },
    broker: {
        type: String,
        enum: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',], //1 = Market Hub,2=Alice Blue,3=Master Trust , 4 = Motilal Oswal
        default: '0'
    },
    access_token: {
        type: String,
        default: null
    },
    api_secret: {
        type: String,
        default: null
    },
    app_id: {
        type: String,
        default: null
    },
    client_code: {
        type: String,
        default: null
    },
    api_key: {
        type: String,
        default: null
    },
    app_key: {
        type: String,
        default: null
    },
    api_type: {
        type: String,
        default: null
    },
    demat_userid: {
        type: String,
        default: null
    },
    web_login_token: {
        type: String,
        default: null
    },
    app_login_token: {
        type: String,
        default: null
    },
    web_url: {
        type: String,
        enum: ['1', '2'], // 1 = Admin panel status , 2 = Tradinview status
        default: '1'
    },
    // qty_type: {
    //     type: String,
    //     enum: ['1', '2'], // 1 = Admin panel status , 2 = Tradinview status
    //     default: '1'
    // },
    signals_execution_type: {
        type: String,
        enum: ['1', '2'], // 1 = Admin panel status , 2 = Tradinview status
        default: '1'
    },
    multiple_strategy_select: {
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
