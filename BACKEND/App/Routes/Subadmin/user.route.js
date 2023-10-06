
"use strict"

const router = require("express").Router()
const { verifyToken } = require('../../Middleware/authjwt')

const { AddEmployee, Subadmn_Permission , getClientBySubadminId ,UpdateActiveStatus } = require('../../Controllers/Subadmin/user.controller')
// const { EditCompany, GetCompanyInfo, EditEmailInfo } = require('../../Controllers/Admin/company.controller')
// const { AddStragegy, GetOneStragegy, EditStragegy, GetAllStrategy, DeleteStragegy, GetAllStrategyForClient, ClientsAccordingToStrategy }  = require('../../Controllers/Admin/strategy.controller')



// USER ADD EDIT
router.post('/sub/add/employee',  AddEmployee);
router.post('/sub/get/permissions',  Subadmn_Permission);
router.post('/sub/get/clientbyId',  getClientBySubadminId);
router.post('/sub/update/useractive/status',  UpdateActiveStatus);



module.exports = router;


