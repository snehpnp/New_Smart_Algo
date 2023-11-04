
"use strict"

const router = require("express").Router()
const {verifyToken}= require('../../Middleware/authjwt')

const { GetAdminSignals } = require('../../Controllers/Admin/signals.controller')


router.post('/get/allsignals', GetAdminSignals)






module.exports = router;


