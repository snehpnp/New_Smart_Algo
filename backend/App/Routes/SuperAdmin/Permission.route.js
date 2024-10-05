
"use strict"

const router = require("express").Router()
const { verifyToken } = require('../../Middleware/authjwt')


const { GetPanelDetails, GetAllClients, GetAllSubadmins, updateBrokerPermission, CloseThePanel, GetAllAdminHelps, GetAll_Broker_details, Admin_Permissions, AddLicensePanle, GetPanlePermistion ,getAllSignals ,DeleteHistory,AddAdjustMonth,DeleteLicense} = require('../../Controllers/Superadmin/Permission.controller')

const {getSignal , UpdateSignal , DeleteSignal , backupSignal, deletedSignal , FindUserById ,UpdateUser , UserDelete , findOneUser,LicenseCut} = require('../../Controllers/Separate_Superadmin/Superadmin')



router.post('/get/panel/info', GetPanelDetails)
router.post('/update/panel/broker', updateBrokerPermission)
router.post('/getall/panel/clients', GetAllClients)
router.post('/getall/panel/subadmins', GetAllSubadmins)

router.post('/add/license', AddLicensePanle)
router.post('/add/adjust_month', AddAdjustMonth)

router.post('/getall/panel/helps', GetAllAdminHelps)
router.post('/getall/brokers', GetAll_Broker_details)
router.post('/update/permission', Admin_Permissions)
router.post('/get/panel/permission', GetPanlePermistion)

router.post('/get/panel/panelclose', CloseThePanel)
router.post('/get/signal',getSignal )
router.post('/update/price',UpdateSignal )
router.post('/signal/delete' , DeleteSignal)
router.post('/backup/signal' , backupSignal)
router.post('/deleted/signal' , deletedSignal)
router.post('/findUserById' , FindUserById)
router.post('/super/update/user' , UpdateUser)
router.post('/user/delete' , UserDelete)
router.post('/findOneUser' , findOneUser)

router.post('/delete/history' , DeleteHistory)

router.post('/delete/license' , LicenseCut)

router.post('/delete/license1' , DeleteLicense)







router.post('/get/signals',getAllSignals )










module.exports = router;


