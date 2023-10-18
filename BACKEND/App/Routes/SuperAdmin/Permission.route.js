
"use strict"

const router = require("express").Router()
const { verifyToken } = require('../../Middleware/authjwt')


const { GetPanelDetails, GetAllClients, GetAllSubadmins, GetAllAdminHelps,GetAll_Broker_details ,  AddLicensePanle } = require('../../Controllers/Superadmin/Permission.controller')




router.post('/get/panel/info', GetPanelDetails)

router.post('/getall/panel/clients', GetAllClients)
router.post('/getall/panel/subadmins', GetAllSubadmins)

router.post('/add/license', AddLicensePanle)
router.post('/getall/panel/helps', GetAllAdminHelps)
router.post('/getall/brokers', GetAll_Broker_details)




module.exports = router;


