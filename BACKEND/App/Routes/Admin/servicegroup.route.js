
"use strict"

const router = require("express").Router()
const {verifyToken}= require('../../Middleware/authjwt')

const { Addgroupservice } = require('../../Controllers/Admin/servicegroup.controller')


router.post('/addgroupservice', Addgroupservice)


module.exports = router;


