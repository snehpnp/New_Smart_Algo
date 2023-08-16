
"use strict"

const router = require("express").Router()
const {verifyToken}= require('../../Middleware/authjwt')

const { Addgroupservice , GetAllServices } = require('../../Controllers/Admin/servicegroup.controller')


router.get('/getAllService', GetAllServices)
router.post('/addgroupservice', Addgroupservice)


module.exports = router;


