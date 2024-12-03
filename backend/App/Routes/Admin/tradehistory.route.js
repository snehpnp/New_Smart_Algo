
"use strict"

const router = require("express").Router()
const {verifyToken}= require('../../Middleware/authjwt')

const { GetAdminTradeHistory,GetAdminTradeHistoryCal,GetAdminsevenTradeHistory ,AdminTradingStatus,AdminTradingOff,AdminTradingStatusGet,GetAdminTradeHistory1,GetSignalsAdmin} = require('../../Controllers/Admin/tradehistory.controller')


router.post('/get/tradhistory', GetAdminTradeHistory)
router.post('/get/tradhistory/cal', GetAdminTradeHistoryCal)

router.post('/get/entry/tradhistory', GetAdminsevenTradeHistory)
router.post('/admin/tradingoff', AdminTradingOff)
router.post('/admin/trading/status', AdminTradingStatus)

router.post('/admin/trading/status/get', AdminTradingStatusGet)




router.post('/get/tradhistory1', GetAdminTradeHistory1)
router.post('/get/signals/admin', GetSignalsAdmin)



module.exports = router;


