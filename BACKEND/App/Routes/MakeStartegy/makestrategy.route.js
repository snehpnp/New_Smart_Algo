
"use strict"

const router = require("express").Router()
const { verifyToken } = require('../../Middleware/authjwt')

const { gettimeFrame ,get_sources ,get_comparators,AddMakeStartegy} = require('../../Controllers/MakeStartegy/makestrategy.controllers')


router.post('/get/getAlltimeframe',verifyToken,gettimeFrame);

router.post('/get_sources',verifyToken, get_sources);

router.post('/get_comparators',verifyToken, get_comparators);

router.post('/AddMakeStartegy',verifyToken, AddMakeStartegy);




module.exports = router;


