
"use strict"

const router = require("express").Router()
const { verifyToken } = require('../../Middleware/authjwt')


const { GetLicenseDetails,GetAllClients} = require('../../Controllers/Superadmin/Permission.controller')




router.post('/get/panel/license', GetLicenseDetails)

router.post('/getall/panel/clients', GetAllClients)



module.exports = router;


