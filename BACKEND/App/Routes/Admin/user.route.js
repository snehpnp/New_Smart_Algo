
"use strict"

const router = require("express").Router()
const {verifyToken}= require('../../Middleware/authjwt')

const { AddEmployee} = require('../../Controllers/Admin/user.controller')
const { EditCompany} = require('../../Controllers/Admin/company.controller')




router.post('/add/employee', AddEmployee)
router.post('/edit/company', EditCompany)



module.exports = router;


