
"use strict"

const router = require("express").Router()
const {verifyToken}= require('../../Middleware/authjwt')

const { login, signup,deletesignupclients, showuserdata ,verifyUser,logoutUser,ForgetPassword ,UpdatePassword , ResetPassword,goToDashboard,sessionClearmail,logout_other_device,DisclaimerMailSend,reedeemRequest,GetreedeemRequest,updatereedeemRequest} = require('../../Controllers/Auth/login.controller')



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

router.get('/send/mail', DisclaimerMailSend) 


router.post('/reedeem/points', reedeemRequest) 
router.post('/get/reedeem', GetreedeemRequest) 

router.post('/update/reedeem', updatereedeemRequest) 








module.exports = router;


