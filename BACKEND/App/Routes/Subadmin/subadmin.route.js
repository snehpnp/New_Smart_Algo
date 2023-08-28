
"use strict"

const router = require("express").Router()
const {verifyToken}= require('../../Middleware/authjwt')

const { AddSubadmin,getallSubadmin} = require('../../Controllers/Subadmin/subadmin.controller')



router.post('/add/subadmin', AddSubadmin);
router.post('/getall/subadmin', getallSubadmin);






module.exports = router;


