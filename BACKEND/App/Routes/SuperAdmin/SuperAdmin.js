
"use strict"

const router = require("express").Router()
const { verifyToken } = require('../../Middleware/authjwt')


const { AddLicenseinPanle } = require('../../Controllers/Separate_Superadmin/Superadmin')



// router.post('/add/panel',verifyToken, AddPanel)
router.post('/add/license', AddLicenseinPanle)




module.exports = router;


