
"use strict"

const router = require("express").Router()
const { verifyToken } = require('../../Middleware/authjwt')

const { getusertradingStatus } = require('../../Controllers/User/Trading_status')
const { getClientServices } = require('../../Controllers/User/Dashboard')
const { GetUserBrokerResponse } = require('../../Controllers/User/BrokerReponse')





// CLIENT SERVICES
router.post('/getall/user/clientServices', verifyToken, getClientServices);

// TRADING STATUS
router.post('/getall/user/trading_status', getusertradingStatus);


// TRADING STATUS
router.post('/getall/user/brokeresponse', GetUserBrokerResponse);







module.exports = router;


