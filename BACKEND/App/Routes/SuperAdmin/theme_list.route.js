
"use strict"

const router = require("express").Router()

const { AddTheme,GetAllTheme} = require('../../Controllers/Superadmin/theme_list.controller')



router.post('/add/theme', AddTheme)
router.post('/getall/theme', GetAllTheme)



module.exports = router;


