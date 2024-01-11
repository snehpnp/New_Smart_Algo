
"use strict"

const router = require("express").Router()
const { verifyToken } = require('../../Middleware/authjwt')

const { AdminDashboard ,add_broker_information,getall_broker_information,update_broker_information,get_broker_information} = require('../../Controllers/Admin/dashboard.controller')


router.post('/get/dashboard/count', AdminDashboard)
router.post('/add/broker_information', add_broker_information)
router.post('/update/broker_information', update_broker_information)
router.post('/getall/broker_information', getall_broker_information)
router.post('/get/broker_information', get_broker_information)









module.exports = router;


