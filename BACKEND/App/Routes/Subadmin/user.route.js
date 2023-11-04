
"use strict"

const router = require("express").Router()
const { verifyToken } = require('../../Middleware/authjwt')

const { AddEmployee, UpdateUser,Subadmn_Permission , getClientBySubadminId ,UpdateActiveStatus } = require('../../Controllers/Subadmin/user.controller')


// USER ADD EDIT
router.post('/sub/add/employee',  AddEmployee);
router.post('/sub/update/employee',  UpdateUser);

router.post('/sub/get/permissions',  Subadmn_Permission);
router.post('/sub/get/clientbyId',  getClientBySubadminId);
router.post('/sub/update/useractive/status',  UpdateActiveStatus);




module.exports = router;


