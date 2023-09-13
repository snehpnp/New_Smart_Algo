
"use strict"

const router = require("express").Router()
const {verifyToken}= require('../../Middleware/authjwt')

const { getusertradingStatus} = require('../../Controllers/User/Trading_status')
const { getClientServices} = require('../../Controllers/User/Dashboard')




// CLIENT SERVICES
router.post('/getall/user/clientServices', getClientServices);

// TRADING STATUS
router.post('/getall/user/trading_status', getusertradingStatus);







module.exports = router;


