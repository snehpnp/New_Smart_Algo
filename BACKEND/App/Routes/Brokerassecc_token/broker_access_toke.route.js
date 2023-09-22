
"use strict"

const router = require("express").Router()
const { verifyToken } = require('../../Middleware/authjwt')

const { GetAccessToken ,GetOrderFullInformation} = require('../../Controllers/Brokerassecc_token/Alice')



router.get('/AliceBlue', GetAccessToken);
router.post('/aliceblue/get/orderinfo', GetOrderFullInformation);









module.exports = router;


