
"use strict"

const router = require("express").Router()
const { verifyToken } = require('../../Middleware/authjwt')


const { AddPanel, EditPanel, UserProfile, GetPanleinformation, GetAllPanel, CreateAPiInfo, GetAllAPiInfo  , UpdateAPiInfo,GetPanlebroker} = require('../../Controllers/Superadmin/panel.controller')
const { UpdatePanelTheme } = require('../../Controllers/Superadmin/theme_list.controller')



router.post('/add/panel', AddPanel)
router.post('/get/profile', UserProfile)
router.post('/get/panelinformation', GetPanleinformation)
router.post('/get/panel/broker', GetPanlebroker)

router.post('/getall/panels', GetAllPanel)
router.post('/edit/panel', EditPanel)
router.post('/update/panel_theme', verifyToken, UpdatePanelTheme)

router.post('/add/apicreateinfo', CreateAPiInfo)
router.get('/getall/apicreateinfo', verifyToken, GetAllAPiInfo)
router.post('/update/apicreateinfo', verifyToken, UpdateAPiInfo)






// router.post('/getall/theme', GetAllTheme)



module.exports = router;


