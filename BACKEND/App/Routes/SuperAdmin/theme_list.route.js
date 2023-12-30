
"use strict"

const router = require("express").Router()
const { verifyToken } = require('../../Middleware/authjwt')


const { AddTheme, GetAllTheme ,UpdatetThemeImage ,  GetThemeByIdThemeId  } = require('../../Controllers/Superadmin/theme_list.controller')


router.post('/add/theme', AddTheme)
router.get('/getall/theme', GetAllTheme)

router.post('/find_one/theme',  GetThemeByIdThemeId)
router.post('/find_one_update/theme_img',  UpdatetThemeImage)



module.exports = router;


