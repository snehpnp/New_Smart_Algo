
"use strict"

const router = require("express").Router()
const { verifyToken } = require('../../Middleware/authjwt')

const { AddEmployee, GetAllClients, loginClients, tradingOnClients } = require('../../Controllers/Admin/user.controller')
const { EditCompany, GetCompanyInfo, EditEmailInfo } = require('../../Controllers/Admin/company.controller')
const { AddStragegy, GetOneStragegy, EditStragegy, GetAllStrategy ,DeleteStragegy} = require('../../Controllers/Admin/strategy.controller')

const { AddEmployee,loginClients ,tradingOnClients} = require('../../Controllers/Admin/user.controller')
const { EditCompany, GetCompanyInfo } = require('../../Controllers/Admin/company.controller')
const { AddStragegy, GetOneStragegy, EditStragegy, GetAllStrategy, DeleteStrategy } = require('../../Controllers/Admin/strategy.controller')





// USER ADD EDIT
router.post('/add/employee', verifyToken, AddEmployee);
router.post('/getall/clients', GetAllClients);

router.post('/getall/loginclients', loginClients);
router.post('/getall/trdingon', tradingOnClients);




// COMPANY RELETE ROUTES
router.post('/edit/company', verifyToken, EditCompany);
router.post('/edit/emailinfo', verifyToken, EditEmailInfo);

router.get('/get/company', GetCompanyInfo);

// STRATEGY RELETED ROUTES
router.post('/add/strategy', verifyToken, AddStragegy);
router.post('/get/strategy', verifyToken, GetOneStragegy);
router.post('/edit/strategy', verifyToken, EditStragegy);
router.post('/getall/strategy', verifyToken, GetAllStrategy);

router.post('/delete/strategy', verifyToken, DeleteStragegy);

router.post('/delete/strategy', verifyToken, DeleteStrategy);








module.exports = router;


