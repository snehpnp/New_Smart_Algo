"use strict"

const router = require("express").Router()

const { getBrokerCredential} = require('../../Controllers/Comman/Optionchain')



router.post('/get/brokercredentail', getBrokerCredential);




module.exports = router;
