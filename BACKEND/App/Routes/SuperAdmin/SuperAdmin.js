
"use strict"

const router = require("express").Router()
const { verifyToken } = require('../../Middleware/authjwt')


const { AddLicenseinPanle,GetAllClients ,getallSubadmin,GetAllMsges} = require('../../Controllers/Separate_Superadmin/Superadmin')



// router.post('/add/panel',verifyToken, AddPanel)
router.post('/license/add', AddLicenseinPanle)
router.post('/clients/get', GetAllClients)
router.post('/subadmin/get', getallSubadmin)
router.post('/help/get', GetAllMsges)







module.exports = router;


