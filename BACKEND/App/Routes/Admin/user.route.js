
"use strict"

const router = require("express").Router()
const { verifyToken } = require('../../Middleware/authjwt')

const { AddEmployee, GetAllClients, loginClients, tradingOnClients,GetTradingStatus ,UpdateActiveStatus} = require('../../Controllers/Admin/user.controller')
const { EditCompany, GetCompanyInfo, EditEmailInfo } = require('../../Controllers/Admin/company.controller')
const { AddStragegy, GetOneStragegy, EditStragegy, GetAllStrategy ,DeleteStragegy ,GetAllStrategyForClient} = require('../../Controllers/Admin/strategy.controller')




// USER ADD EDIT
router.post('/add/employee', verifyToken, AddEmployee);
router.post('/getall/clients', GetAllClients);
router.post('/update/useractive/status', UpdateActiveStatus);


router.post('/getall/loginclients', loginClients);
router.post('/getall/trdingon', tradingOnClients);
router.post('/getall/tadingstatus', GetTradingStatus);





// COMPANY RELETE ROUTES
router.post('/edit/company', verifyToken, EditCompany);
router.post('/edit/emailinfo', verifyToken, EditEmailInfo);

router.get('/get/company', GetCompanyInfo);

// STRATEGY RELETED ROUTES
router.post('/add/strategy', verifyToken, AddStragegy);
router.post('/get/strategy', verifyToken, GetOneStragegy);
router.post('/edit/strategy', verifyToken, EditStragegy);
router.post('/getall/strategy', verifyToken, GetAllStrategy);
router.get('/getall/strategy_for_add_client',  GetAllStrategyForClient);

router.post('/delete/strategy', verifyToken, DeleteStragegy);


module.exports = router;


