
"use strict"

const router = require("express").Router()
const { verifyToken } = require('../../Middleware/authjwt')

const { AddEmployee, Subadmn_Permission , UpdateUser, GetAllClients, loginClients, tradingOnClients, GetTradingStatus, UpdateActiveStatus, DeleteUser, GetUserInfo, Update_Broker_Keys } = require('../../Controllers/Subadmin/user.controller')
const { EditCompany, GetCompanyInfo, EditEmailInfo } = require('../../Controllers/Admin/company.controller')
const { AddStragegy, GetOneStragegy, EditStragegy, GetAllStrategy, DeleteStragegy, GetAllStrategyForClient, ClientsAccordingToStrategy }  = require('../../Controllers/Admin/strategy.controller')



// USER ADD EDIT
router.post('/sub/add/employee',  AddEmployee);
router.post('/sub/get/permissions',  Subadmn_Permission);

// router.post('/update/employee', verifyToken, UpdateUser);
// router.post('/getall/clients', GetAllClients);
// router.post('/update/useractive/status', UpdateActiveStatus);
// router.post('/delete/user', DeleteUser);
// router.post('/getall/loginclients', loginClients);
// router.post('/getall/trdingon', tradingOnClients);
// router.post('/getall/tadingstatus', GetTradingStatus);
// router.post('/getall/userinfo', GetUserInfo);
// router.post('/update/brokerkeys', Update_Broker_Keys);




// // STRATEGY RELETED ROUTES
// router.post('/add/strategy', verifyToken, AddStragegy);
// router.post('/get/strategy', verifyToken, GetOneStragegy);
// router.post('/edit/strategy', verifyToken, EditStragegy);
// router.post('/getall/strategy', verifyToken, GetAllStrategy);
// router.get('/getall/strategy_for_add_client', GetAllStrategyForClient);
// router.post('/delete/strategy', verifyToken, DeleteStragegy);
// router.post('/get/strategy/client', ClientsAccordingToStrategy);


module.exports = router;


