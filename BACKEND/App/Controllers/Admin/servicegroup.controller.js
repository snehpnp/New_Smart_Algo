"use strict";
const bcrypt = require("bcrypt");
const db  = require('../../Models');

const serviceGroupName = db.serviceGroupName;
const services = db.services;
const serviceGroup_services_id = db.serviceGroup_services_id;
var dateTime = require('node-datetime');
var dt = dateTime.create();


class GroupService {
    async Addgroupservice(req, res) {
        try{


     //   const data = await services.findById({_id:'64d77617c9af6c1843e460f3'},{'name':1}).populate('categorie_id','name segment');

      

      
         // res.send({status:true,data:data})
       //   return
          //console.log("req body -",req.body)
       
      
        const groupdetails = req.body.groupdetails;
        const services_id = req.body.services_id;

        //console.log("groupdetails -",groupdetails)
      //  console.log("services_id -",services_id)
 
        serviceGroupName.create({
            name:groupdetails.name,
            description:groupdetails.description
          })
          .then((createdServicesGroupName) => {
          //  console.log('User created and saved:', createdServicesGroupName._id)
           const groupName_id = createdServicesGroupName._id;
           
           services_id.forEach(item => {
           
            serviceGroup_services_id.create({
                Servicegroup_id:groupName_id,
                Service_id:item.service_id,
                group_qty:item.group_qty,
                unique_column:groupName_id+'_'+item.service_id,
               
              })
              .then((createdGroupServiceId) => {
                console.log('User created createdGroupServiceId and saved:', createdGroupServiceId._id)
   
              })
              .catch((err) => {
                console.error('Error creating double service:', err.keyValue);
    
              });

              
           });
          
           res.send({ status: true, msg: "successfully Add!", data: createdServicesGroupName })

          })
          .catch((err) => {
            //console.error('Error creating and saving user:', err.keyValue.name);
            res.send({ status: false, msg: "Duplicate Value", data: err.keyValue.name })

          });
        }
        catch (error) {
            res.send({ msg: "Error=>", error })
        }

    }

//abc


}



module.exports = new GroupService();