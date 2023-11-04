
"use strict"

const router = require("express").Router()
const { verifyToken } = require('../../Middleware/authjwt')


const { AddTheme, GetAllTheme , GetThemeByIdThemeId  } = require('../../Controllers/Superadmin/theme_list.controller')


router.post('/add/theme', AddTheme)
router.get('/getall/theme', GetAllTheme)

router.post('/find_one/theme',  GetThemeByIdThemeId)



module.exports = router;


