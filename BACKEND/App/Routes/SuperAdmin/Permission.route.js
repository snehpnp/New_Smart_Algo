
"use strict"

const router = require("express").Router()
const { verifyToken } = require('../../Middleware/authjwt')


const { GetPanelDetails,GetAllClients,GetAllSubadmins,AddLicensePanle} = require('../../Controllers/Superadmin/Permission.controller')




router.post('/get/panel/info', GetPanelDetails)

router.post('/getall/panel/clients', GetAllClients)
router.post('/getall/panel/subadmins', GetAllSubadmins)

router.post('/add/license', AddLicensePanle)




module.exports = router;


