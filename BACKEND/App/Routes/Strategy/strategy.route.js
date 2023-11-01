
"use strict"

const router = require("express").Router()

const { get_servicename, get_indicators, get_sources } = require('../../Controllers/Strategy/strategy.controllers')



router.post('/add/getservicename', get_servicename);
router.get('/get_indicators', get_indicators);
router.get('/get_sources', get_sources);



module.exports = router;