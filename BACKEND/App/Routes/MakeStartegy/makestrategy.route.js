
"use strict"

const router = require("express").Router()
const { verifyToken } = require('../../Middleware/authjwt')

const { gettimeFrame ,get_sources ,get_comparators,AddMakeStartegy,GetAllMakeStartegy,DeleteMakeStartegy,EditeMakeStartegy,UpdateMakeStartegy} = require('../../Controllers/MakeStartegy/makestrategy.controllers')


router.post('/get/getAlltimeframe',verifyToken,gettimeFrame);

router.post('/get_sources',verifyToken, get_sources);

router.post('/get_comparators',verifyToken, get_comparators);

router.post('/AddMakeStartegy',verifyToken, AddMakeStartegy);

router.post('/GetAllMakeStartegy',verifyToken, GetAllMakeStartegy);

router.post('/DeleteMakeStartegy',verifyToken, DeleteMakeStartegy);

router.post('/EditeMakeStartegy',verifyToken, EditeMakeStartegy);

router.post('/UpdateMakeStartegy',verifyToken, UpdateMakeStartegy);









module.exports = router;


