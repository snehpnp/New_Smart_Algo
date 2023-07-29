
"use strict"

const router = require("express").Router()

const { login,verifyUser} = require('../../Controllers/Auth/login.controller')



router.post('/login', login)
router.post('/verifyUser', verifyUser)



module.exports = router;


