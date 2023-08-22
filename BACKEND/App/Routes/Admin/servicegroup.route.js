
"use strict"

const router = require("express").Router()
const {verifyToken}= require('../../Middleware/authjwt')

const { Addgroupservice , GetAllServices , GetAllCatagory  , getServiceByCatagory} = require('../../Controllers/Admin/servicegroup.controller')


router.get('/getAllService', GetAllServices)
router.post('/addgroupservice', Addgroupservice)
router.get('/allCatagory', GetAllCatagory)
router.post('/ServiceByCatagory', getServiceByCatagory)




module.exports = router;


