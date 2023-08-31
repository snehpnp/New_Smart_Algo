
"use strict"

const router = require("express").Router()
const {verifyToken}= require('../../Middleware/authjwt')

const { AddSubadmin,getallSubadmin,getallSubadminClients} = require('../../Controllers/Subadmin/subadmin.controller')



router.post('/add/subadmin', AddSubadmin);
router.post('/getall/subadmin', getallSubadmin);
router.post('/getall/subadmin/clients', getallSubadminClients);







module.exports = router;


