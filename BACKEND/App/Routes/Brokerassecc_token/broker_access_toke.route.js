
"use strict"

const router = require("express").Router()
const { verifyToken } = require('../../Middleware/authjwt')

const { GetAccessToken } = require('../../Controllers/Brokerassecc_token/Alice')



router.get('/aliceblue/access_token', GetAccessToken);








module.exports = router;


