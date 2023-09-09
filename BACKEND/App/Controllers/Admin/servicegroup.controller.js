"use strict";
const bcrypt = require("bcrypt");
const db = require('../../Models');
var dateTime = require('node-datetime');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const serviceGroupName = db.serviceGroupName;
const services = db.services;
const serviceGroup_services_id = db.serviceGroup_services_id;
const categorie = db.categorie;
const groupServices_client1 = db.groupService_User;


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

      return res.json({ status: true, msg: 'Get all', data: result });

    } else {

      return res.json({ status: false, msg: 'An error occurred', data: [] });
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
        res.send({ status: false, data: [], msg: 'false' });
      }

    } catch (error) {
      console.log("Get All Group Services Error - ", error);
      res.status(500).send({ status: false, data: [], msg: 'An error occurred' });
    }
  }


  // DELETE GROUP SERVICES 


  async DELETEGROUPSERVICES(req, res) {
    try {
      const { id } = req.body; // Assuming your ID is passed as 'id' in the request body

      console.log("Received ID:", id);

      // Convert the string ID to an ObjectId
      const objectId = new ObjectId(id);

      const groupServices_user = await groupServices_client1.find({ groupService_id: objectId })


      if (groupServices_user.length != 0) {
        return res.json({ status: false, msg: 'This group already assign', data: groupServices_user });
      }

      const result = await serviceGroupName.deleteOne({ _id: objectId });
      const result1 = await serviceGroup_services_id.deleteMany({ Servicegroup_id: objectId });

      console.log("result", result.acknowledged);


      // Handle the results here, e.g., send them in the response
      if (result.acknowledged == true) {
        return res.send({ status: true, msg: 'Delete successfully ', data: result.acknowledged });

      }
    } catch (error) {
      console.error("Error:", error);

      return res.json({ status: false, msg: 'server error delete group service-', data: error });
    }
  }


  // GET SERVICES NAME
  async GetAllServicesName(req, res) {

    try {
      const { data } = req.body
      var ServicesArr = []

      data.result.forEach(async (info) => {

        const Service_name_get = await services.findOne({ _id: info.Service_id });
        if (Service_name_get) {
          ServicesArr.push(Service_name_get)

          if (data.result.length == ServicesArr.length) {
            return res.send({ status: true, msg: 'Get All successfully ', data: ServicesArr });
          }
        }

      })



    } catch (error) {
      console.log("GET SERVICES NAME -", error);
    }

  }



  // GET SERVICES NAME
  async GetAllServicesUserNAme(req, res) {

    try {
      const { data } = req.body
      var ServicesArr = []
      const objectId = new ObjectId(data._id);



    // Define the aggregation pipeline
    const pipeline = [
      {
        $match: {
          groupService_id: objectId, // Replace 'objectId' with your actual ObjectId
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $project: {     
          username: '$user.FullName', // Replace 'username' with the actual field name in 'users' collection
        },
      },
    ];

    // Execute the aggregation pipeline
    const result = await groupServices_client1.aggregate(pipeline)
console.log("result",result);






      const groupServices_user = await groupServices_client1.find({ groupService_id: objectId })

      if (groupServices_user.length == 0) {
        return res.send({ status: false, msg: 'NO DATA', data: groupServices_user });
      }

      return res.send({ status: true, data: groupServices_user, msg: 'Get All successfully' });



    } catch (error) {
      console.log("GET SERVICES NAME -", error);
    }

  }

}



module.exports = new GroupService();
