"use strict"

const router = require("express").Router()

const { findActivityCategory,findActivity} = require('../../Controllers/Comman/Activity')




router.post('/find/activity/category', findActivityCategory);
router.post('/find/activity', findActivity);





module.exports = router;
