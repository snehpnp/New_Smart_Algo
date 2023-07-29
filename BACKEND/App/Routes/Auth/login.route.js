
"use strict"

const router = require("express").Router()

const { login,verifyUser,logoutUser} = require('../../Controllers/Auth/login.controller')



router.post('/login', login)
router.post('/verifyUser', verifyUser)
router.post('/logoutUser', logoutUser)




module.exports = router;


