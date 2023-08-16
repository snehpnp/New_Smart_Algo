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


      //  const data = await services.findById({_id:'64d77617c9af6c1843e460f1'},{'name':1}).populate('categorie_id','name segment');

      

      
      // res.send({status:true,data:data})
      //    return
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

// SErvices Work

async GetAllServices(req, res) {
  
  const pipeline = [

    {
      $lookup: {
        from: 'categories',
        localField: 'categorie_id',
        foreignField: '_id',
        as: 'categoryResult'
      }
    },
    
    {
      $unwind: '$categoryResult', // Unwind the 'categoryResult' array
    },
    {
      $project: {
        // Include fields from the original collection
        'categoryResult.segment': 1,
        'categoryResult.name': 1,
         name : 1
        // // Exclude the rest of the 'categoryResult' fields if needed
        // 'categoryResult._id': 0,
        // 'categoryResult.fieldName3': 0,
        
        // Include other fields as needed
      },


    },
  ];

  const result = await services.aggregate(pipeline);
  
  if(result.length > 0){
    res.send({status:true,data:result});
    
  }else{
    res.send({status:false,data:[]});

  }



}


}



module.exports = new GroupService();