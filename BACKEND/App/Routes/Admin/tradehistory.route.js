
"use strict"

const router = require("express").Router()
const {verifyToken}= require('../../Middleware/authjwt')

const { GetAdminTradeHistory,GetAdminsevenTradeHistory ,AdminTradingOff} = require('../../Controllers/Admin/tradehistory.controller')


router.post('/get/tradhistory', GetAdminTradeHistory)
router.post('/get/entry/tradhistory', GetAdminsevenTradeHistory)
router.post('/admin/tradingoff', AdminTradingOff)








module.exports = router;


