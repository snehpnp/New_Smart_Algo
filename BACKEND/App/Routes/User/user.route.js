
"use strict"

const router = require("express").Router()
const { verifyToken } = require('../../Middleware/authjwt')

const { getusertradingStatus } = require('../../Controllers/User/Trading_status')
const { getClientServices ,updateClientServices} = require('../../Controllers/User/Dashboard')
const { GetUserBrokerResponse } = require('../../Controllers/User/BrokerReponse')
const { GetUserTradeSignals } = require('../../Controllers/User/Signals')
const { GetUserTradeHistory } = require('../../Controllers/User/TradeHistory')
const { GetUserStrategy } = require('../../Controllers/User/Strategy_Desc')
const { AddHelp } = require('../../Controllers/User/HelpCenter')
const { GetAllSymbols } = require('../../Controllers/User/MakeStrategy')





// CLIENT SERVICES
router.post('/getall/user/clientServices', verifyToken, getClientServices);
router.post('/update/clientServices', updateClientServices);


// TRADING STATUS
router.post('/getall/user/trading_status', getusertradingStatus);


// BROKER RESPONSE
router.post('/getall/user/brokeresponse', GetUserBrokerResponse);

// SIGNALS
router.post('/getall/user/signals', GetUserTradeSignals);

// SIGNALS
router.post('/getall/user/tradehistory', GetUserTradeHistory);
// Strategy
router.post('/getall/user/strategy', GetUserStrategy);


// Help Center
router.post('/create/user/help', AddHelp);


// Make Strategy...
router.get('/getall/user/symbols', GetAllSymbols);







module.exports = router;


