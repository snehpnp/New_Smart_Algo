
"use strict"

const router = require("express").Router()
const { verifyToken } = require('../../Middleware/authjwt')

const { GetAccessToken ,GetOrderFullInformation,GetLivePrice,Cancel_order,GetOrderFullInformationAll} = require('../../Controllers/Brokerassecc_token/Alice')



router.get('/AliceBlue', GetAccessToken);
router.post('/aliceblue/get/orderinfo', GetOrderFullInformation);
router.post('/get/token', GetLivePrice);
router.post('/order/cancel', Cancel_order);
router.post('/getall/order/info', GetOrderFullInformationAll);







module.exports = router;


