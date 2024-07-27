
"use strict"

const router = require("express").Router()
const { verifyToken } = require('../../Middleware/authjwt')

const { GetAllMsges } = require('../../Controllers/Admin/HelpCenter.controller')


router.post('/getall/helps',  GetAllMsges)




module.exports = router;


