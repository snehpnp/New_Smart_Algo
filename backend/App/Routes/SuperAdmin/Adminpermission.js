
"use strict"

const router = require("express").Router()


const {UpdateAdminPermission,updatePnlPosition,GetPnlPostion} = require('../../Controllers/Superadmin/Adminpermission.controller')


router.post('/update/adminpermission', UpdateAdminPermission)

router.post('/update/pnlposition', updatePnlPosition)

router.get('/get/pnlposition', GetPnlPostion)



module.exports = router;


