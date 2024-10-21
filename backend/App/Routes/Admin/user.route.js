
"use strict"

const router = require("express").Router()
const { verifyToken } = require('../../Middleware/authjwt')
const { upload } = require('../../Helper/imgUpload');

const { AddEmployee, UpdateUser, GetAllClients, GetAllExpiredClients ,loginClients, tradingOnClients, GetclientKey , GetTradingStatus, UpdateActiveStatus, DeleteUser, GetUserInfo, Update_Broker_Keys,GetDuplicateData ,DawnloadStatusandResponse,GetAllStarClients,UpdateStarStatus,GetAllReferalClients,GetLastUserName} = require('../../Controllers/Admin/user.controller')
const { EditCompany, GetCompanyInfo, GetCompany_logo, EditEmailInfo , UpdateDisclaimer } = require('../../Controllers/Admin/company.controller')
const { AddStragegy, GetOneStragegy, EditStragegy, GetAllStrategy, DeleteStragegy, GetAllStrategyForClient, ClientsAccordingToStrategy ,GetAddRemoveStrategy ,UpdateAddRemoveStrategy } = require('../../Controllers/Admin/strategy.controller')

const { AddMessageBrodcast, GetAllMessageBrodcast, GetMessageBrodcast, RemoveBroadCast } = require('../../Controllers/Admin/messagebrodcast.controller')
const { Get_Option_Symbol, Get_Option_Symbol_Expiry, Get_Option_All_Round_Token ,Get_Option_All_Token_Chain, Open_Position ,update_stop_loss,Stock_chain,subscribr_token ,update_option_symbols_status} = require('../../Controllers/Admin/option_chain.controller')

// USER ADD EDIT
router.post('/add/employee', verifyToken, AddEmployee);
router.post('/update/employee', verifyToken, UpdateUser);
// router.post('/update/employee', verifyToken, UpdateUser);

router.post('/getall/clients', GetAllClients);
router.post('/getall/expiredclients', GetAllExpiredClients);
router.post('/update/useractive/status', UpdateActiveStatus);
router.post('/delete/user', DeleteUser);
router.post('/getall/loginclients', loginClients);
router.post('/getall/trdingon', tradingOnClients);
router.post('/getall/tadingstatus', GetTradingStatus);
router.post('/getall/userinfo', GetUserInfo);
router.post('/update/brokerkeys', Update_Broker_Keys);
router.post('/get/panel_key', GetclientKey);

router.post('/getall/star/clients', GetAllStarClients);
router.post('/update/star/status', UpdateStarStatus);


router.get('/get/last/username', GetLastUserName);

 

// COMPANY RELETE ROUTES
router.post('/edit/company', verifyToken, EditCompany);
router.post('/update/disclaimer', UpdateDisclaimer);


// router.post('/edit/emailinfo', verifyToken,upload.single('image'), EditEmailInfo);
router.post('/edit/emailinfo',  EditEmailInfo);

router.get('/get/company', GetCompanyInfo);
router.get('/get/company_logo', GetCompany_logo);


// STRATEGY RELETED ROUTES
router.post('/add/strategy', verifyToken, AddStragegy);
router.post('/get/strategy', verifyToken, GetOneStragegy);
router.post('/edit/strategy', verifyToken, EditStragegy);
router.post('/getall/strategy', verifyToken, GetAllStrategy);
router.get('/getall/strategy_for_add_client', GetAllStrategyForClient);
router.post('/delete/strategy', verifyToken, DeleteStragegy);
router.post('/get/strategy/client', ClientsAccordingToStrategy);

// STRATEGY REMOVE AND ADD GET CLIENT

router.post('/get/add_remove_client_strategy', GetAddRemoveStrategy);
router.post('/get/update_add_remove_client_strategy', UpdateAddRemoveStrategy);


// MESSAGE BRODCAST
router.post('/add/messagebrodcast', AddMessageBrodcast);
router.post('/getall/messagebrodcast', GetAllMessageBrodcast);
router.post('/get/messagebrodcast', GetMessageBrodcast);
router.post('/remove/messagebrodcast', RemoveBroadCast);


router.post('/get/option_symbols', Get_Option_Symbol);
router.post('/get/option_symbol_expiry', Get_Option_Symbol_Expiry);
router.post('/get/all_round_token', Get_Option_All_Round_Token);
router.post('/get/option/chain', Get_Option_All_Token_Chain);
router.post('/update/subscribe/token', subscribr_token);
router.post('/update/option_symbols_status', update_option_symbols_status);


router.post('/get/open_position', Open_Position);
router.post('/update/signal', update_stop_loss);
router.post('/get/stockchain', Stock_chain);
router.post('/get/stockchain', Stock_chain);




router.get('/get/duplicatedata', GetDuplicateData);

router.post('/dawnload/data', DawnloadStatusandResponse);


router.post('/getall/referaluser', GetAllReferalClients);





module.exports = router;


