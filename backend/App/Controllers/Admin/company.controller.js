"use strict";
const db = require('../../Models');
const mongoose = require('mongoose')
const company_information = db.company_information
const { formattedDateTime } = require('../../Helper/time.helper')
const ObjectId = mongoose.Types.ObjectId;
const Permission_Logs = db.Permission_Logs;
class Company {

    async EditCompany(req, res) {
        try {
            var companydata = req.body.data
            var _id = req.body.id;

            company_information.findById(_id)
                .then(async (value) => {
                    if (!value) {
                        return res.send({ status: false, msg: 'Id not match', data: [] });
                    }
                    const filter = { _id: _id };
                    const updateOperation = { $set: companydata };
                    const result = await company_information.updateOne(filter, updateOperation);
                    if (!result) {
                        return res.send({ status: false, msg: 'Company not update', data: [] });
                    }
                    return res.send({ status: true, msg: 'Update Successfully.', data: [] });
                })


        } catch (error) {
            console.log("Error Edit Company Api -", error);
        }
    }

    async UpdateDisclaimer(req, res) {
        try {
            const { id, disclaimer, dataArr, disclaimer_status } = req.body;
    
            const findData = await company_information.findOne();
            if (!findData) {
                return res.send({
                    status: false,
                    msg: "Id is not Match",
                    data: []
                });
            }
    
            const filter = { _id: findData._id };
            let updateOperation;
    
            if (disclaimer_status) {
                updateOperation = { $set: { disclaimer_status: disclaimer_status } };
            } else {
                updateOperation = { $set: { disclaimer: disclaimer, dissArr: dataArr } };
            }
    
            const result = await company_information.updateOne(filter, updateOperation);
            if (result.nModified === 0) {
                return res.send({ status: false, msg: 'Company not updated', data: [] });
            }
    
            return res.send({ status: true, msg: 'Update Successfully.', data: [] });
        } catch (error) {
            return res.status(500).send({ status: false, msg: 'Server Error', data: [] });
        }
    }

    async GetCompanyInfo(req, res) {
        try {

            var compantInfo = await company_information.find()
            var Permission_Logs_data = await Permission_Logs.find()


            if (!compantInfo) {
                return res.send({ status: false, msg: 'Server issue Not find Company information.', data: [] });
            }
            return res.send({ status: true, msg: 'Done', data: compantInfo,Permission_Logs_data:Permission_Logs_data });
        } catch (error) {
            console.log("Error Company Information Get -", error);
           
            return
        }
    }

    async GetCompany_logo(req, res) {
        try {

            var compantInfo = await company_information.find().select('logo favicon panel_name loginimage')
            if (!compantInfo) {
                return res.send({ status: false, msg: 'Server issue Not find Company information.', data: [] });
            }

            return res.send({ status: true, msg: 'Done', data: compantInfo });


        } catch (error) {
            console.log("Error Company Logo Get -", error);
          

        }
    }

    async EditEmailInfo(req, res) {

        try {
            var companydata = req.body.data
            var _id = req.body.id;


            company_information.findById(_id)
                .then(async (value) => {
                    if (!value) {
                        return res.send({ status: false, msg: 'Id not match', data: [] });
                    }
                    const filter = { _id: _id };
                    const updateOperation = { $set: companydata };
                    const result = await company_information.updateOne(filter, updateOperation);
                    if (!result) {
                        return res.send({ status: false, msg: 'Company not update', data: [] });
                    }

                    return res.send({ status: true, msg: 'Update Successfully.', data: [] });

                })


        } catch (error) {
            console.log("Error Edit Email Information-", error);
        }
    }

    async UpdatePricePermission(req, res) {
        try {
            const Status = req.body.status;
    
            const Match = await company_information.findOne().select('price_permission');
    
            if (!Match) {
                return res.send({ status: false, msg: 'Server issue: Company information not found.', data: [] });
            }
    
            if (Match.price_permission == Status) {
                
               
                return res.send({ status: false, msg: 'Price Permission is already set to the desired status.', data: [] });
            }
    
            const filter = { _id: Match._id };
            const updateOperation = { $set: { price_permission: Status } };
            const result = await company_information.updateOne(filter, updateOperation);
    
            var permission_logs = new Permission_Logs({
                status: Status,
                msg: 'Price Permission ' + (Status == 1 ? "on" : "off") + ' updated',
            });
            await permission_logs.save();
    
            if (result.nModified === 0) {
                return res.send({ status: false, msg: 'Company not updated', data: [] });
            }
    
    
            return res.send({ status: true, msg: 'Update Successfully.', data: [] });
    
        } catch (error) {
            console.log("Error Update Price Permission -", error);
            return res.send({ status: false, msg: 'Something went wrong. Please try again.', data: [] });
        }
    }
    

}


module.exports = new Company();