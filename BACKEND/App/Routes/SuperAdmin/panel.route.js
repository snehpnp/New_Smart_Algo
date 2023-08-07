
"use strict"

const router = require("express").Router()

const {AddPanel} = require('../../Controllers/Superadmin/panel.controller')



router.post('/add/panel', AddPanel)
// router.post('/getall/theme', GetAllTheme)



module.exports = router;


