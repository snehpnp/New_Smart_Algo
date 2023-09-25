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

      var groupServices = await serviceGroup_services_id.find({ name: groupdetails.name })
      console.log("groupServices", groupServices);

      if (groupServices.length > 0) {
        return res.send({ status: false, msg: "Name Is already Exist", data: groupServices })

      }


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

          return res.send({ status: true, msg: "successfully Add!", data: createdServicesGroupName })

        })
        .catch((err) => {
          //console.error('Error creating and saving user:', err.keyValue.name);
          return res.send({ status: false, msg: "Duplicate Value", data: err.keyValue.name })

        });
    }
    catch (error) {
      res.send({ msg: "Error=>", error })
    }

  }

  // EDIT GROUP SERVICES
  async Editgroupservice(req, res) {
    try {

      const groupdetails = req.body.groupdetails;
      const services_id = req.body.services_id;

      const objectId = new ObjectId(groupdetails.id);

      var groupServices = await serviceGroupName.find({ _id: { $ne: objectId }, name: groupdetails.name })

      if (groupServices.length > 0) {
        return res.send({ status: false, msg: "Name is already Exist", data: groupServices })

      }

      let result = await serviceGroupName.findByIdAndUpdate(
        objectId,
        {
          name: groupdetails.name,
          description: groupdetails.description
        },
        { new: true }
      )


      var GroupServicesIds = await serviceGroup_services_id.find({ Servicegroup_id: objectId })


      console.log("GroupServicesIds", GroupServicesIds);

      // EXIST STRATEGY RO CONVERT IN STRING AND ID
      var db_exist_group_services = [];
      GroupServicesIds.forEach(function (item, index) {
        db_exist_group_services.push(item.Service_id.toString());
      });

      console.log("=>",db_exist_group_services);

      // NEW INSERT STRATEGY TO CONVERT IN STRING AND ID
      var insert_Group_services = [];
      services_id.forEach(function (item, index) {
        insert_Group_services.push(item.service_id);
      });
      // console.log('insert_Group_services ', insert_Group_services);

      // ADD STRATEGY ARRAY
      var add_Group_services = [];
      insert_Group_services.forEach(function (item, index) {
        if (!db_exist_group_services.includes(item)) {
          add_Group_services.push(item);
        }
      });
      console.log('add add_startegy - ', add_Group_services);

      // DELETE STRATEGY ARRAY
      var delete_GroupServices = [];
      db_exist_group_services.forEach(function (item, index) {
        if (!insert_Group_services.includes(item)) {
          delete_GroupServices.push(item);
        }
      });
      console.log("delete_GroupServices", delete_GroupServices);


      // serviceGroup_services_id.create({
      //         Servicegroup_id: groupName_id,
      //         Service_id: item.service_id,
      //         group_qty: item.group_qty,
      //         unique_column: groupName_id + '_' + item.service_id,

      //       })



      // serviceGroupName.create({
      //   name: groupdetails.name,
      //   description: groupdetails.description
      // })
      //   .then((createdServicesGroupName) => {
      //     const groupName_id = createdServicesGroupName._id;

      //     services_id.forEach(item => {

      //       serviceGroup_services_id.create({
      //         Servicegroup_id: groupName_id,
      //         Service_id: item.service_id,
      //         group_qty: item.group_qty,
      //         unique_column: groupName_id + '_' + item.service_id,

      //       })
      //         .then((createdGroupServiceId) => {
      //           // console.log('User created createdGroupServiceId and saved:', createdGroupServiceId._id)

      //         })
      //         .catch((err) => {
      //           console.error('Error creating double service:', err.keyValue);

      //         });


      //     });

      //     return res.send({ status: true, msg: "successfully Add!", data: createdServicesGroupName })

      //   })
      //   .catch((err) => {
      //     //console.error('Error creating and saving user:', err.keyValue.name);
      //     return res.send({ status: false, msg: "Duplicate Value", data: err.keyValue.name })

      //   });
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

  // GET SERVICES BY GROUP ID
  async GetServicesByGroupId(req, res) {

    try {

      const { _id } = req.body
      console.log(_id);
      if (_id != "yyyyyyyYYYYYY") {
        const objectId = new ObjectId(_id);

        const pipeline = [
          {
            '$lookup': {
              'from': 'services',
              'localField': 'Service_id',
              'foreignField': '_id',
              'as': 'ServiceResult'
            }
          },
          {
            $match: {
              Servicegroup_id: objectId,
            }
          },
          {
            $project: {
              'ServiceResult.name': 1,
            },
          },
          {
            $unwind: '$ServiceResult', // Unwind the 'categoryResult' array
          },

        ];

        const Service_name_get = await serviceGroup_services_id.aggregate(pipeline);
        return res.send({ status: true, msg: 'Get All successfully ', data: Service_name_get });


      } else {
        return res.send({ status: false, msg: 'Empty DAta', data: [] });

      }


    }
    catch (error) {
      console.log("GET SERVICES NAME -", error);
    }

  }

  // GET SERVICES NAME
  async GetAllServicesUserNAme(req, res) {

    try {
      const { _id } = req.body
      var ServicesArr = []
      const objectId = new ObjectId(_id);

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
            'user.Email': 1, // Replace 'username' with the actual field name in 'users' collection
            'user.FullName': 1,
            'user.license_type': 1,
            'user.UserName': 1,
            'user.TradingStatus': 1,
          },
        },
      ];

      // Execute the aggregation pipeline
      const result = await groupServices_client1.aggregate(pipeline)

      const groupServices_user = await groupServices_client1.find({ groupService_id: objectId })

      if (groupServices_user.length == 0) {
        return res.send({ status: false, msg: 'NO DATA', data: result });
      }

      return res.send({ status: true, data: result, msg: 'Get All successfully' });



    } catch (error) {
      console.error("GET SERVICES NAME -", error);
      return res.send({ status: false, msg: 'Internal Server Error' });
    }

  }

}



module.exports = new GroupService();
