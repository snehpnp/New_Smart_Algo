
"use strict"

const router = require("express").Router()

const { login} = require('../../Controllers/Auth/login.controller')



router.post('/login', login)


module.exports = router;


