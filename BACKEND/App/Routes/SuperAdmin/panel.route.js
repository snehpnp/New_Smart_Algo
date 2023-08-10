
"use strict"

const router = require("express").Router()

const {AddPanel ,UserProfile,GetPanleinformation,GetAllPanel} = require('../../Controllers/Superadmin/panel.controller')



router.post('/add/panel', AddPanel)
router.post('/get/profile', UserProfile)
router.post('/get/panelinformation', GetPanleinformation)
router.post('/getall/panels', GetAllPanel)




// router.post('/getall/theme', GetAllTheme)



module.exports = router;


