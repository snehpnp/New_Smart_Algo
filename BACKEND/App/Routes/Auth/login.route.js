
"use strict"

const router = require("express").Router()
const {verifyToken}= require('../../Middleware/authjwt')

const { login,verifyUser,logoutUser , ForgetPassword ,UpdatePassword , ResetPassword,goToDashboard} = require('../../Controllers/Auth/login.controller')



router.post('/login', login)
router.post('/verifyUser', verifyUser)
router.post('/logoutUser', logoutUser)
router.post('/forgetpassword', ForgetPassword)
router.post('/update',verifyToken, UpdatePassword)
router.post('/resetpassword', ResetPassword)
router.post('/goToDashboard', goToDashboard)





module.exports = router;


