
"use strict"

const router = require("express").Router()
const {verifyToken}= require('../../Middleware/authjwt')

const { AddSubadmin} = require('../../Controllers/Subadmin/subadmin.controller')



router.post('/add/subadmin', AddSubadmin)





module.exports = router;


