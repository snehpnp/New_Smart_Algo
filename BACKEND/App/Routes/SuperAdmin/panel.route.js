
"use strict"

const router = require("express").Router()

const {AddPanel,EditPanel ,UserProfile,GetPanleinformation,GetAllPanel} = require('../../Controllers/Superadmin/panel.controller')



router.post('/add/panel', AddPanel)
router.post('/get/profile', UserProfile)
router.post('/get/panelinformation', GetPanleinformation)
router.post('/getall/panels', GetAllPanel)
router.post('/edit/panel', EditPanel)





// router.post('/getall/theme', GetAllTheme)



module.exports = router;


