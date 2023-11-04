
"use strict"

const router = require("express").Router()
const { verifyToken } = require('../../Middleware/authjwt')

const { gettimeFrame } = require('../../Controllers/MakeStartegy/makestrategy.controllers')


router.post('/get/getAlltimeframe',verifyToken,gettimeFrame);


module.exports = router;


