
"use strict"

const router = require("express").Router()
const { verifyToken } = require('../../Middleware/authjwt')


const { AddPanel, EditPanel, UserProfile, GetPanleinformation, GetAllPanel, CreateAPiInfo, GetAllAPiInfo, GetAllAPiInfo_Super, UpdateAPiInfo, GetPanlebroker, GetHistoryData,updateQuery ,createView,GetAllFaq,AddFaq,DeleteFaq,UpdateFaq} = require('../../Controllers/Superadmin/panel.controller')
const { UpdatePanelTheme } = require('../../Controllers/Superadmin/theme_list.controller')



router.post('/add/panel', verifyToken, AddPanel)
router.post('/get/profile',verifyToken, UserProfile)
router.post('/get/panelinformation', GetPanleinformation)
router.post('/get/panel/broker', GetPanlebroker)

router.post('/getall/panels', GetAllPanel)
router.post('/edit/panel', EditPanel)
router.post('/update/panel_theme', verifyToken, UpdatePanelTheme)

router.post('/add/apicreateinfo', CreateAPiInfo)
router.post('/getall/apicreateinfo', GetAllAPiInfo)
router.post('/getall/apicreateinfo_super', verifyToken, GetAllAPiInfo_Super)
router.post('/update/apicreateinfo', verifyToken, UpdateAPiInfo)
router.get('/getall/history', GetHistoryData)

router.post('/update/query', updateQuery)

router.post('/view/crete', createView)
router.post('/add/faq', AddFaq)

router.get('/getll/faq', GetAllFaq)
router.post('/delete/faq', DeleteFaq)
router.post('/update/faq', UpdateFaq)





module.exports = router;


