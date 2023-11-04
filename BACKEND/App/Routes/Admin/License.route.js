
"use strict"

const router = require("express").Router()
const { verifyToken } = require('../../Middleware/authjwt')

const {GetExpiredclients,GetTransctionLicense  , GetSelectedMonthLicence} = require('../../Controllers/Admin/license.controller')


// USER ADD EDIT
router.post('/getall/expired/user', GetExpiredclients);
router.post('/getall/transection/license', GetTransctionLicense);
router.post('/getall/selectedmonth/license', GetSelectedMonthLicence);




module.exports = router;


