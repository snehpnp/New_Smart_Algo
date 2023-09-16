
"use strict"

const router = require("express").Router()
const {verifyToken}= require('../../Middleware/authjwt')

const { GetAdminTradeHistory } = require('../../Controllers/Admin/tradehistory.controller')


router.post('/get/tradhistory', GetAdminTradeHistory)






module.exports = router;


