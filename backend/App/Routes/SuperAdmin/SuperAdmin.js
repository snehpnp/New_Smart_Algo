
"use strict"

const router = require("express").Router()
const { verifyToken } = require('../../Middleware/authjwt')


const { AddLicenseinPanle,GetAllClients ,getallSubadmin,GetAllMsges ,AddAdjustMonthPanle} = require('../../Controllers/Separate_Superadmin/Superadmin')



router.post('/license/add', AddLicenseinPanle)
router.post('/adjust_month/add', AddAdjustMonthPanle)
router.post('/clients/get', GetAllClients)
router.post('/subadmin/get', getallSubadmin)
router.post('/help/get', GetAllMsges)







module.exports = router;


