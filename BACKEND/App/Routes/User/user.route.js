
"use strict"

const router = require("express").Router()
const {verifyToken}= require('../../Middleware/authjwt')

const { getusertradingStatus} = require('../../Controllers/User/Trading_status')



router.post('/getall/user/trading_status', getusertradingStatus);







module.exports = router;


