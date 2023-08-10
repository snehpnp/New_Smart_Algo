
"use strict"

const router = require("express").Router()

const {AddPanel ,UserProfile} = require('../../Controllers/Superadmin/panel.controller')



router.post('/add/panel', AddPanel)
router.post('/get/profile', UserProfile)

// router.post('/getall/theme', GetAllTheme)



module.exports = router;


