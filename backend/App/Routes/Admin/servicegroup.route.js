
"use strict"

const router = require("express").Router()
const { verifyToken } = require('../../Middleware/authjwt')

const { Addgroupservice, GetAllServices, GetAllCatagory, allServicesSymboll, GetServicesByGroupId1, getServiceByCatagory, getAllgroupServices, GetAllServicesName, DELETEGROUPSERVICES, GetAllServicesUserNAme, GetServicesByGroupId, Editgroupservice ,Addplans,GetAllPlans,GetPlansById,EditPlans,DeletePlans} = require('../../Controllers/Admin/servicegroup.controller')


router.get('/getAllService', GetAllServices)
router.post('/addgroupservice', Addgroupservice)
router.post('/edit/groupservice', Editgroupservice)
router.post('/all/symboll', allServicesSymboll)



router.get('/allCatagory', GetAllCatagory)
router.post('/ServiceByCatagory', getServiceByCatagory)
router.post('/getall/groupservices', getAllgroupServices)
router.post('/getall/servicesName', GetAllServicesName)
router.post('/getall/services/username', GetAllServicesUserNAme)
router.post('/get/services/bygroupid', GetServicesByGroupId)
router.post('/get/services/bygroupid1', GetServicesByGroupId1)
router.post('/delete/groupServices', DELETEGROUPSERVICES)

router.post('/addplans', Addplans)
router.get('/getallplans', GetAllPlans)
router.post('/getplansbyid', GetPlansById)
router.post('/editplans', EditPlans)

router.post('/deleteplans', DeletePlans)




module.exports = router;


