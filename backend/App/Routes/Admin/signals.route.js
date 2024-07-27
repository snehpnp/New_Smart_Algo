
"use strict"

const router = require("express").Router()
const { verifyToken } = require('../../Middleware/authjwt')

const { GetAdminSignals, GetStrickPriceFromSheet } = require('../../Controllers/Admin/signals.controller')


router.post('/get/allsignals', GetAdminSignals)
router.get('/get/price', GetStrickPriceFromSheet)


module.exports = router;


