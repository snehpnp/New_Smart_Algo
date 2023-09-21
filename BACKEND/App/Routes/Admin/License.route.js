
"use strict"

const router = require("express").Router()
const { verifyToken } = require('../../Middleware/authjwt')

const {GetExpiredclients,GetTransctionLicense } = require('../../Controllers/Admin/license.controller')


// USER ADD EDIT
router.post('/getall/expired/user', GetExpiredclients);
router.post('/getall/transection/license', GetTransctionLicense);




module.exports = router;


