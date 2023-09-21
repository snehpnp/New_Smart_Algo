
"use strict"

const router = require("express").Router()
const { verifyToken } = require('../../Middleware/authjwt')

const { AdminDashboard } = require('../../Controllers/Admin/dashboard.controller')


router.post('/get/dashboard/count', verifyToken, AdminDashboard)






module.exports = router;


