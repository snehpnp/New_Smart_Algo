
"use strict"

const router = require("express").Router()
const { verifyToken } = require('../../Middleware/authjwt')


const { get_servicename, get_indicators } = require('../../Controllers/Strategy/strategy.controllers')



router.post('/add/getservicename' ,get_servicename);
router.get('/get_indicators', get_indicators);




module.exports = router;