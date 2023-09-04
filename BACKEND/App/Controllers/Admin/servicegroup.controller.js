"use strict";
const bcrypt = require("bcrypt");
const db = require('../../Models');

const serviceGroupName = db.serviceGroupName;
const services = db.services;
const serviceGroup_services_id = db.serviceGroup_services_id;
const categorie = db.categorie;

var dateTime = require('node-datetime');
var dt = dateTime.create();


class GroupService {

  // ADD GROUP SERVICES
  async Addgroupservice(req, res) {
    try {

      const groupdetails = req.body.groupdetails;
      const services_id = req.body.services_id;

      serviceGroupName.create({
        name: groupdetails.name,
        description: groupdetails.description
      })
        .then((createdServicesGroupName) => {
          const groupName_id = createdServicesGroupName._id;

          services_id.forEach(item => {

            serviceGroup_services_id.create({
              Servicegroup_id: groupName_id,
              Service_id: item.service_id,
              group_qty: item.group_qty,
              unique_column: groupName_id + '_' + item.service_id,

            })
              .then((createdGroupServiceId) => {
                // console.log('User created createdGroupServiceId and saved:', createdGroupServiceId._id)

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
          name: 1
          // // Exclude the rest of the 'categoryResult' fields if needed
          // 'categoryResult._id': 0,
          // 'categoryResult.fieldName3': 0,

          // Include other fields as needed
        },


      },
    ];

    const result = await services.aggregate(pipeline);

    if (result.length > 0) {
      res.send({ status: true, data: result });

    } else {
      res.send({ status: false, data: [] });

    }



  }

  //  GetAllCatagory
  async GetAllCatagory(req, res) {
    const pipeline = [
      {
        $project: {
          name: 1,
          segment: 1,
        },
      },
    ];

    const result = await categorie.aggregate(pipeline);

    if (result.length > 0) {
      res.send({ status: true, data: result });

    } else {
      res.send({ status: false, data: [] });

    }



    //
  }

  async getServiceByCatagory(req, res) {



    let pipeline;

    if (req.body.segment === 'all') {
      pipeline = [
        {
          $lookup: {
            from: 'categories',
            localField: 'categorie_id',
            foreignField: '_id',
            as: 'category',
          },
        },
        {
          $unwind: '$category', // Unwind the 'categoryResult' array
        },
        {
          $project: {
            'category.segment': 1,
            'category.name': 1,
            name: 1,
          },
        },
      ];
    } else {
      pipeline = [
        {
          $lookup: {
            from: 'categories',
            localField: 'categorie_id',
            foreignField: '_id',
            as: 'category',
          },
        },
        {
          $unwind: '$category', // Unwind the 'categoryResult' array
        },
        {
          $match: {
            $or: [
              { 'category.segment': req.body.segment },
              { 'category.segment': 'all' },
            ],
          },
        },
        {
          $project: {
            'category.segment': 1,
            'category.name': 1,
            name: 1,

          },
        },
      ];
    }


    const result = await services.aggregate(pipeline);

    if (result.length > 0) {
      res.send({ status: true, data: result });

    } else {
      res.send({ status: false, data: [] });

    }



  }

  // GET ALL GROUP BY SERVICES
  async getAllgroupServices(req, res) {
    try {
      const pipeline = [
        {
          '$lookup': {
            'from': 'servicegroup_services_ids', 
            'localField': '_id', 
            'foreignField': 'Servicegroup_id', 
            'as': 'result'
          }
        },
        {
          '$addFields': {
            'resultCount': { '$size': '$result' } // Add a field to store the count of 'result' array
          }
        }
      ];
  
      const result = await serviceGroupName.aggregate(pipeline);
  
      if (result.length > 0) {
        res.send({ status: true, data: result, msg: 'Get All successfully' });
      } else {
        res.send({ status: false, data: [],  msg: 'false' });
      }
  
    } catch (error) {
      console.log("Get All Group Services Error - ", error);
      res.status(500).send({ status: false, data: [],  msg: 'An error occurred' });
    }
  }
  

}



module.exports = new GroupService();
