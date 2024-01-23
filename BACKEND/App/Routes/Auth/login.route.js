
"use strict"

const router = require("express").Router()
const {verifyToken}= require('../../Middleware/authjwt')

const { login, signup,deletesignupclients, showuserdata ,verifyUser,logoutUser,ForgetPassword ,UpdatePassword , ResetPassword,goToDashboard,sessionClearmail,logout_other_device} = require('../../Controllers/Auth/login.controller')



router.post('/login', login)
router.get('/showuserdata', showuserdata)
router.post('/deletesignupclients', deletesignupclients)
router.post('/signup', signup)
router.post('/verifyUser', verifyUser)
router.post('/logoutUser', logoutUser)
router.post('/forgetpassword', ForgetPassword)
router.post('/update', UpdatePassword)
router.post('/resetpassword', ResetPassword)
router.post('/goToDashboard', goToDashboard)
router.post('/session/clear', sessionClearmail)
router.post('/logout/other/device', logout_other_device) 







module.exports = router;


