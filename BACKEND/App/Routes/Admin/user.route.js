
"use strict"

const router = require("express").Router()
const {verifyToken}= require('../../Middleware/authjwt')

const { AddEmployee} = require('../../Controllers/Admin/user.controller')
const { EditCompany,GetCompanyInfo} = require('../../Controllers/Admin/company.controller')




router.post('/add/employee', AddEmployee)
router.post('/edit/company', EditCompany)
router.get('/get/company', GetCompanyInfo)




module.exports = router;


