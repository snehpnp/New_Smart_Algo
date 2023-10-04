
"use strict"

const router = require("express").Router()
const { verifyToken } = require('../../Middleware/authjwt')

const { AdminDashboard ,add_broker_information} = require('../../Controllers/Admin/dashboard.controller')


router.post('/get/dashboard/count', verifyToken, AdminDashboard)
router.post('/add/broker_information', add_broker_information)







module.exports = router;


