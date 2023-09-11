
"use strict"

const router = require("express").Router()
const {verifyToken}= require('../../Middleware/authjwt')

const { Addgroupservice , GetAllServices , GetAllCatagory  , getServiceByCatagory,getAllgroupServices,GetAllServicesName,DELETEGROUPSERVICES,GetAllServicesUserNAme ,GetServicesByGroupId} = require('../../Controllers/Admin/servicegroup.controller')


router.get('/getAllService', GetAllServices)
router.post('/addgroupservice', Addgroupservice)
router.get('/allCatagory', GetAllCatagory)
router.post('/ServiceByCatagory', getServiceByCatagory)
router.post('/getall/groupservices', getAllgroupServices)
router.post('/getall/servicesName', GetAllServicesName)
router.post('/getall/services/username', GetAllServicesUserNAme)
router.post('/get/services/bygroupid', GetServicesByGroupId)


router.post('/delete/groupServices', DELETEGROUPSERVICES)







module.exports = router;


