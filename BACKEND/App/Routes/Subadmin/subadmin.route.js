
"use strict"

const router = require("express").Router()
const {verifyToken}= require('../../Middleware/authjwt')

const { AddSubadmin,EditSubadmin,getallSubadmin,getallSubadminClients,getOneSubadmin} = require('../../Controllers/Subadmin/subadmin.controller')



router.post('/add/subadmin', AddSubadmin);
router.post('/edit/subadmin', EditSubadmin);

router.post('/getall/subadmin', getallSubadmin);
router.post('/getall/subadmin/clients', getallSubadminClients);
router.post('/get/subadmin', getOneSubadmin);








module.exports = router;


