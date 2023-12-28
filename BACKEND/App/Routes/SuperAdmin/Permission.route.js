
"use strict"

const router = require("express").Router()
const { verifyToken } = require('../../Middleware/authjwt')


const { GetPanelDetails, GetAllClients, GetAllSubadmins, updateBrokerPermission, CloseThePanel, GetAllAdminHelps, GetAll_Broker_details, Admin_Permissions, AddLicensePanle, GetPanlePermistion } = require('../../Controllers/Superadmin/Permission.controller')




router.post('/get/panel/info', GetPanelDetails)
router.post('/update/panel/broker', updateBrokerPermission)
router.post('/getall/panel/clients', GetAllClients)
router.post('/getall/panel/subadmins', GetAllSubadmins)

router.post('/add/license', AddLicensePanle)
router.post('/getall/panel/helps', GetAllAdminHelps)
router.post('/getall/brokers', GetAll_Broker_details)
router.post('/update/permission', Admin_Permissions)
router.post('/get/panel/permission', GetPanlePermistion)

router.post('/get/panel/panelclose', CloseThePanel)






module.exports = router;


