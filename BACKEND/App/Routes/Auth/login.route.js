
"use strict"

const router = require("express").Router()

const { login,verifyUser,logoutUser , ForgetPassword ,UpdatePassword , ResetPassword} = require('../../Controllers/Auth/login.controller')



router.post('/login', login)
router.post('/verifyUser', verifyUser)
router.post('/logoutUser', logoutUser)
router.post('/forgetpassword', ForgetPassword)
router.post('/update', UpdatePassword)
router.post('/resetpassword', ResetPassword)




module.exports = router;


