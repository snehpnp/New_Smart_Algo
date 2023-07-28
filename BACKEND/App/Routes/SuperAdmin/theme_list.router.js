
"use strict"

const router = require("express").Router()

const { AddTheme} = require('../../Controllers/Superadmin/theme_list.controller')



router.post('/add-theme', AddTheme)


module.exports = router;


