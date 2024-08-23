
"use strict"

const router = require("express").Router()
const {verifyToken}= require('../../Middleware/authjwt')

const { GetAdminTradeHistory,GetAdminsevenTradeHistory ,AdminTradingStatus,AdminTradingOff,AdminTradingStatusGet} = require('../../Controllers/Admin/tradehistory.controller')


router.post('/get/tradhistory', GetAdminTradeHistory)
router.post('/get/entry/tradhistory', GetAdminsevenTradeHistory)
router.post('/admin/tradingoff', AdminTradingOff)
router.post('/admin/trading/status', AdminTradingStatus)

router.get('/admin/trading/status/get', AdminTradingStatusGet)








module.exports = router;


