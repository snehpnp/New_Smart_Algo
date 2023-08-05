
"use strict"

const router = require("express").Router()
const {verifyToken}= require('../../Middleware/authjwt')

const { AddEmployee} = require('../../Controllers/Admin/user.controller')
const { EditCompany,GetCompanyInfo} = require('../../Controllers/Admin/company.controller')
const { AddStragegy,GetOneStragegy,EditStragegy,GetAllStrategy} = require('../../Controllers/Admin/strategy.controller')





router.post('/add/employee', AddEmployee);

// COMPANY RELETE ROUTES
router.post('/edit/company', EditCompany);
router.get('/get/company', GetCompanyInfo);

// STRATEGY RELETED ROUTES
router.post('/add/strategy',verifyToken, AddStragegy);
router.post('/get/strategy', GetOneStragegy);
router.post('/edit/strategy', EditStragegy);
router.post('/getall/strategy', GetAllStrategy);







module.exports = router;


