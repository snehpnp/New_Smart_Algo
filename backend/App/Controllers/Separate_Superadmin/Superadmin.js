"use strict";
const db = require("../../Models");
const user = db.user;
const count_licenses = db.count_licenses;
const company_information = db.company_information;
const HelpCenter_modal = db.HelpCenter;
const Signals = db.Signals;
const MainSignals = db.MainSignals;
const Old_MainSignals = db.OldMainSignals;
const Old_Signals = db.OldSignals;
const user_activity_logs = db.user_activity_logs;
const strategy_client = db.strategy_client;
const client_services = db.client_services;
const groupService_User = db.groupService_User;
const Superadmin_History = db.Superadmin_History;

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const { logger, getIPAddress } = require("../../Helper/logger.helper");
const { formattedDateTime } = require("../../Helper/time.helper");

class SuperAdmin {
  async AddLicenseinPanle(req, res) {
    try {
      // const { id, license } = req.body
      const { license } = req.body;

      const findResult = await company_information.find().select("licenses");
      const findAdmin = await user
        .find({ Role: "ADMIN" })
        .select("_id client_key");

      const newLicensesValue =
        Number(findResult[0].licenses || 0) + Number(license);

      const updateOperation = {
        $set: {
          licenses: newLicensesValue,
        },
      };

      const objectId = findAdmin[0]._id;

      const queryCondition = {
        panel_key: findAdmin[0].client_key, // Replace with your desired query condition
      };

      const updateResult = await company_information.updateMany(
        queryCondition,
        updateOperation
      );

      const filter = { createdAt: new Date() }; // Specify the filter based on createdAt

      const result = await count_licenses.updateOne(
        filter,
        {
          $setOnInsert: {
            admin_license: Number(license),
            user_id: objectId,
            createdAt: new Date(),
          },
        },
        {
          upsert: true,
        }
      );

      return res.send({
        status: true,
        msg: "Add License",
        data: updateResult,
      });
    } catch (error) {
      console.log("Error Add License error-", error);
      return res.send({
        status: false,
        msg: "Add License",
        data: error,
      });
    }
  }

  async AddAdjustMonthPanle(req, res) {
    try {
      // const { id, license } = req.body
      const { month } = req.body
      const currentDate = new Date();
      const monthsPrior = Number(month); // Change this value to 3, 4, or any other number of months
      const millisecondsPerMonth = 2629800000; // approximate milliseconds per month
      const datePrior = new Date(currentDate.getTime() - (monthsPrior * millisecondsPerMonth));

      const updateResult = await company_information.updateMany({}
        , {
          $set: {
            month_ago_number: monthsPrior,
            month_ago_date: datePrior
          },
        },
        { upsert: true });

      return res.send({
        status: true,
        msg: "Add month",
        data: updateResult
      });


    } catch (error) {
      console.log("Error Add month error-", error);
      return res.send({
        status: false,
        msg: "Add month",
        data: error
      });
    }
  }

  async GetAllClients(req, res) {
    try {
      const getAllClients = await user
        .find({ Role: "USER" })
        .sort({ createdAt: -1 });

      if (getAllClients.length == 0) {
        return res.send({
          status: false,
          msg: "Empty data",
          data: [],
        });
      }

      // DATA GET SUCCESSFULLY
      return res.send({
        status: true,
        msg: "Get All Clients",
        data: getAllClients,
      });
    } catch (error) {
      return res.send({
        status: false,
        msg: "Empty data",
        data: [],
      });
    }
  }

  async getallSubadmin(req, res) {
    try {
      // GET LOGIN CLIENTS
      const getAllSubAdmins = await user.find({
        Role: "SUBADMIN",
      });

      // IF DATA NOT EXIST
      if (getAllSubAdmins.length == 0) {
        return res.send({
          status: false,
          msg: "Empty data",
          data: [],
          totalCount: totalCount,
        });
      }

      // DATA GET SUCCESSFULLY
      return res.send({
        status: true,
        msg: "Get All Subadmins",
        data: getAllSubAdmins,
      });
    } catch (error) {
      console.log("Error getallSubadmin error -", error);
    }
  }

  async GetAllMsges(req, res) {
    try {
      const { _id } = req.body;
      const objectId = new ObjectId(_id);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      try {
        const result = await HelpCenter_modal.find({
          // admin_id: objectId,
          createdAt: {
            $gte: today,
            $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
          },
        });

        if (result.length === 0) {
          return res.send({ status: false, msg: "No Msg Found", data: [] });
        }
        return res.send({ status: true, msg: "All Help Msg", data: result });
      } catch (error) {
        return res.send({
          status: false,
          msg: "Error  to Create Generate Help Response.",
          error: error.message,
        });
      }
    } catch (error) {
      console.log("Error Help Center error-", error);
    }
  }

  async getSignal(req, res) {
    try {

      const toDate = req.body.fromDate;
      const fromDate = req.body.toDate;


      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);

      const endOfToday = new Date(today);
      endOfToday.setHours(23, 59, 59, 999);



      let startDateObj = new Date(toDate ? toDate : yesterday);
      let endDateObj = new Date(fromDate ? fromDate :endOfToday);


      const filteredSignals = await MainSignals.find({
        createdAt: {
          $gte: new Date(startDateObj),
          $lte: new Date(endDateObj),
        },
      }).sort({ createdAt: -1 });

      if (filteredSignals.length == 0) {
        return res.send({
          status: false,
          msg: "Empty data",
          data: [],
        });
      }

      // DATA GET SUCCESSFULLY
      return res.send({
        status: true,
        msg: "Get All Clients",
        data: filteredSignals,
      });
    } catch (error) {
      return res.send({
        status: false,
        msg: "Empty data",
        data: [],
      });
    }
  }

  async UpdateSignal(req, res) {
    try {
      const { id, price, signalId, entryPriceID, panel_name, superadmin_name } =
        req.body;

      if (!id) {
        return res.send({ status: false, msg: "Id is not Found", data: [] });
      }
      if (signalId.length <= 0) {
        return res.send({
          status: false,
          msg: "signalId is not Found",
          data: [],
        });
      }

      if (entryPriceID == 1) {
        // Update Number Of Trade
        const filter = { _id: id };
        const update_Price = {
          $set: {
            entry_price: price,
          },
        };

        const filter2 = { _id: signalId[0] };
        const update_Price2 = {
          $set: {
            price: price,
          },
        };

        const updateData = await MainSignals.updateOne(filter, update_Price);
        const updateInSignal = await Signals.updateOne(filter2, update_Price2);
        const superadmin_History = new Superadmin_History({
          superadmin_name: superadmin_name,
          panal_name: panel_name,
          msg: "Super admin update price" + price,
        });

        await superadmin_History.save();
        return res.send({
          status: true,
          msg: "price is updated successfully",
          data: [],
        });
      } else {
        // Update Number Of Trade
        const filter = { _id: id };
        const update_Price = {
          $set: {
            exit_price: price,
          },
        };

        const filter2 = { _id: signalId[1] };
        const update_Price2 = {
          $set: {
            price: price,
          },
        };

        const updateData = await MainSignals.updateOne(filter, update_Price);
        const updateInSignal = await Signals.updateOne(filter2, update_Price2);
        return res.send({
          status: true,
          msg: "price is updated successfully",
          data: [],
        });
      }
    } catch (err) {
      return res.send({ status: false, msg: "server side error", data: [] });
    }
  }

  async deletedSignal(req, res) {
    try {
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);

      const endOfToday = new Date(today);
      endOfToday.setHours(23, 59, 59, 999);

      const filteredSignals = await Old_MainSignals.find({
        createdAt: {
          $gte: yesterday,
          $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      }).sort({ createdAt: -1 });

      if (filteredSignals.length == 0) {
        return res.send({
          status: false,
          msg: "Empty data",
          data: [],
        });
      }

      // DATA GET SUCCESSFULLY
      return res.send({
        status: true,
        msg: "Get All Clients",
        data: filteredSignals,
      });
    } catch (error) {
      return res.send({
        status: false,
        msg: "Empty data",
        data: [],
      });
    }
  }

  async DeleteSignal(req, res) {
    try {
      const { id, superadmin_name, panel_name } = req.body;

      if (!id) {
        return res.send({
          status: false,
          msg: "Id is not found",
          data: [],
        });
      }

      let findData = await MainSignals.findOne({ _id: new ObjectId(id) });

      if (!findData) {
        return res.send({
          status: false,
          msg: "Invalid id found",
          data: [],
        });
      }

      const backupData = {
        ...findData._doc,
        backup_id: findData._id,
      };

      const filter = { backup_id: findData._id };
      const updatePrice = { $set: backupData };

      const updateData = await Old_MainSignals.updateOne(filter, updatePrice, {
        upsert: true,
      });

      if (!updateData.acknowledged) {
        return res.send({
          status: false,
          msg: "Failed to insert/update in the backup collection",
          data: [],
        });
      }
      if (
        Array.isArray(findData.signals_id) &&
        findData.signals_id.length > 0
      ) {
        await Promise.all(
          findData.signals_id.map(async (sigId) => {
            try {
              let SignalData = await Signals.findOne({ _id: sigId });

              if (SignalData) {
                const SignalBackupData = {
                  ...SignalData._doc,
                  backup_id: SignalData._id,
                };

                const signalUpdateData = await Old_Signals.updateOne(
                  { backup_id: SignalData._id },
                  { $set: SignalBackupData },
                  { upsert: true }
                );

                if (!signalUpdateData.acknowledged) {
                  throw new Error(
                    `Failed to insert/update signal with id ${sigId} in the backup collection`
                  );
                }

                await Signals.deleteOne({ _id: sigId });
              }
            } catch (error) {
              console.log(`Error processing signal id ${sigId}:`, error);
            }
          })
        );
      }

      await MainSignals.deleteOne({ _id: findData._id });
      const superadmin_History = new Superadmin_History({
        superadmin_name: superadmin_name,
        panal_name: panel_name,
        msg: "Super admin Delete signal",
      });

      await superadmin_History.save();

      return res.send({
        status: true,
        msg: "Data found and backed up successfully",
        data: findData,
      });
    } catch (error) {
      console.log("Error in DeleteSignal:", error);
      res.status(500).send({
        status: false,
        msg: "An error occurred",
        data: [],
      });
    }
  }

  async backupSignal(req, res) {
    try {
      const { id, superadmin_name, panel_name } = req.body;

      if (!id) {
        return res.send({
          status: false,
          msg: "ID is not found",
          data: [],
        });
      }

      const findData = await Old_MainSignals.findOne({ backup_id: id });

      if (!findData) {
        return res.send({
          status: false,
          msg: "Invalid Backup ID",
          data: [],
        });
      }

      if (findData.signals_id) {
        findData.signals_id.forEach(async (sglId) => {
          try {
            const findOldSignal = await Old_Signals.findOne({
              backup_id: sglId,
            });

            if (findOldSignal) {
              const { backup_id, ...signalWithoutBackupId } =
                findOldSignal._doc;

              const signalUpdateData = await Signals.updateOne(
                { _id: sglId },
                { $set: signalWithoutBackupId },
                { upsert: true }
              );

              if (!signalUpdateData.acknowledged) {
                return res.send({
                  status: false,
                  msg: "Faild to revert back old signal to signal",
                  data: [],
                });
              }
              await Old_Signals.deleteOne({ _id: sglId });
            } else {
              return res.send({
                status: false,
                msg: `Signal with backup_id ${sglId} not found.`,
                data: [],
              });
            }

            const { backup_id, ...signalWithoutBackupId } = findData._doc;

            const signalUpdateData = await MainSignals.updateOne(
              { _id: id },
              { $set: signalWithoutBackupId },
              { upsert: true }
            );

            await Old_MainSignals.deleteOne({ _id: id });

            const superadmin_History = new Superadmin_History({
              superadmin_name: superadmin_name,
              panal_name: panel_name,
              msg: "Super admin Delete signal",
            });

            await superadmin_History.save();

            return res.send({
              status: true,
              msg: "Data found and backed up successfully",
              data: findData,
            });
          } catch (err) {
            console.log(`Error finding signal with backup_id ${sglId}:`, err);
          }
        });
      }
    } catch (err) {
      console.log("Error finding data:", err);
      res.status(500).send({
        status: false,
        msg: "Internal Server Error",
        data: [],
      });
    }
  }

  async FindUserById(req, res) {
    try {
      const { id } = req.body;

      if (!id) {
        return res.send({
          status: false,
          msg: "Id is not Found",
          data: [],
        });
      }
      const findUser = await user.findOne({ _id: id });

      if (!findUser) {
        return res.send({
          status: false,
          msg: "Invalid Id Found",
          data: [],
        });
      }

      

      const getToMonth = await user.aggregate([
        { $match: { _id: new ObjectId(id) } },
        {
          $lookup: {
            from: "count_licenses",
            localField: "_id",
            foreignField: "user_id",
            as: "licenses"
          }
        },
        // Use unwind with `preserveNullAndEmptyArrays: true` to retain user data even if no licenses are found
        { $unwind: { path: "$licenses", preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: "$_id",
            // Use $ifNull to handle cases where `licenses.license` is null or doesn't exist
            totalLicence: { 
              $sum: { 
                $toDouble: { 
                  $ifNull: ["$licenses.license", 0]  // If `licenses.license` is null, default to 0
                }
              }
            },
            UserName: { $first: "$UserName" },
            CreateDate: { $first: "$CreateDate" },
            StartDate: { $first: "$StartDate" },
            EndDate: { $first: "$EndDate" },
            licence: { $first: "$licence" },
            Email: { $first: "$Email" },
            PhoneNo: { $first: "$PhoneNo" },
            FullName: { $first: "$FullName" }
          }
        },
        {
          $project: {
            _id: 0,
            UserName: 1,
            totalLicence: 1,
            CreateDate: 1,
            licence: 1,
            EndDate: 1,
            StartDate: 1,
            Email: 1,
            FullName: 1,
            PhoneNo: 1,
          }
        }
      ]).exec();

      const GetCountLicenceDAta = await count_licenses.find({ user_id: id }).sort({ createdAt: -1 })

      return res.send({ status: true, msg: "Get Data", data: getToMonth, data1: GetCountLicenceDAta });

    } catch (err) {

      return res.send({ status: false, msg: 'Internal server error', data: [] });
    }
}

  async UpdateUser(req, res) {
  try {
    const {
      id,
      FullName,
      UserName,
      Email,
      PhoneNo,
      superadmin_name,
      panel_name,
    } = req.body;

    const data = {
      FullName: FullName,
      UserName: UserName,
      Email: Email,
      PhoneNo: PhoneNo,
    };
    const updateUser = await user.updateOne({ _id: id }, data);

    if (!updateUser.acknowledged) {
      return res.send({
        status: false,
        msg: "User Not Update some error occer",
        data: [],
      });
    }
    const superadmin_History = new Superadmin_History({
      superadmin_name: superadmin_name,
      panal_name: panel_name,
      msg: "Super admin Update User",
    });

    await superadmin_History.save();

    return res.send({
      status: true,
      msg: "User Updated Successfully",
      data: [],
    });
  } catch (err) {
    return res.send({
      status: false,
      msg: "Internal server error",
      data: [],
    });
  }
}

  async UserDelete(req, res) {
  try {
    const { id, panel_name, superadmin_name } = req.body;
    if (!id) {
      return res.send({ status: false, msg: "Id is Not Found", data: [] });
    }

    const deleteUser = await user.deleteMany({ _id: id });
    await count_licenses.deleteMany({ user_id: id });
    await strategy_client.deleteMany({ user_id: id });
    await user_activity_logs.deleteMany({ user_id: id });
    await client_services.deleteMany({ user_id: id });
    await groupService_User.deleteMany({ user_id: id });

    if (!deleteUser.acknowledged) {
      return res.send({ status: false, msg: "Invalid User Id", data: [] });
    }

    const superadmin_History = new Superadmin_History({
      superadmin_name: superadmin_name,
      panal_name: panel_name,
      msg: "Super admin delete User",
    });

    await superadmin_History.save();

    return res.send({
      status: true,
      msg: "User Deleted Successfully ",
      data: [],
    });
  } catch (err) {
    res.sends({
      status: false,
      msg: "internal server error",
      data: [],
    });
  }
}

  async findOneUser(req, res) {
  try {
    const { id } = req.body;

    if (!id) {
      return res.send({ status: false, msg: "Id Not Found", data: [] });
    }

    const getToMonth = await user
      .aggregate([
        { $match: { _id: new ObjectId(id) } },
        {
          $lookup: {
            from: "count_licenses",
            localField: "_id",
            foreignField: "user_id",
            as: "licenses",
          },
        },
        { $unwind: "$licenses" },
        {
          $group: {
            _id: "$_id",
            totalLicence: { $sum: { $toDouble: "$licenses.license" } },
            UserName: { $first: "$UserName" },
            CreateDate: { $first: "$CreateDate" },
            StartDate: { $first: "$StartDate" },
            EndDate: { $first: "$EndDate" },
            licence: { $first: "$licence" },
          },
        },
        {
          $project: {
            _id: 0,
            UserName: 1,
            totalLicence: 1,
            CreateDate: 1,
            licence: 1,
            EndDate: 1,
            StartDate: 1,
          },
        },
      ])
      .exec();

    const GetCountLicenceDAta = await count_licenses
      .find({ user_id: id })
      .sort({ createdAt: -1 });

    return res.send({
      status: true,
      msg: "Get Data",
      data: getToMonth,
      data1: GetCountLicenceDAta,
    });
  } catch (err) {
    return res.send({
      status: false,
      msg: "Internal server error",
      data: [],
    });
  }
}

  async LicenseCut(req, res) {
  try {
    const { UserName, licence } = req.body;

    // Find user with the specified username and license type
    const UserGet = await user
      .find({ UserName: UserName, license_type: "2" })
      .select("licence StartDate EndDate");

    if (UserGet.length === 0) {
      return res.send({
        status: false,
        msg: "User Not Found",
        data: [],
      });
    }

    // Find and sort licenses by creation date (descending)
    const CountLicenseData = await count_licenses
      .find({ user_id: UserGet[0]._id })
      .sort({ createdAt: -1 });

    // Calculate the updated license count and new end date
    let UpdateLicense = UserGet[0].licence - licence;
    let UpdateEndDate = new Date(UserGet[0].EndDate);
    UpdateEndDate.setMonth(UpdateEndDate.getMonth() - licence); // Subtract months based on 'licence'

    // Update the user's license and end date
    await user.updateOne(
      { _id: UserGet[0]._id },
      {
        $set: {
          licence: UpdateLicense,
          EndDate: UpdateEndDate,
        },
      }
    );

    // Remove the specified number of licenses from CountLicenseData
    const licensesToRemove = CountLicenseData.slice(0, licence);

    // Loop over the licenses to remove and delete them from the database
    for (const license of licensesToRemove) {
      await count_licenses.deleteOne({ _id: license._id });
    }

    return res.send({
      status: true,
      msg: "License updated and records removed successfully",
      data: {
        UpdateLicense,
        UpdateEndDate,
        removedLicenses: licensesToRemove,
      },
    });

  } catch (err) {
    return res.send({
      status: false,
      msg: "Internal server error",
      data: [],
    });
  }
}
  
  
}

module.exports = new SuperAdmin();
