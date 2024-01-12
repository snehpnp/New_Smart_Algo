"use strict";
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const db = require('../../Models');
const Message_brodcast = db.Messagebrodcast_data
const strategy = db.strategy
const strategy_client = db.strategy_client
const user = db.user


class Message {

    // ADD MESSAGE BRODCAST
    async AddMessageBrodcast(req, res) {
        try {
            const { Broker, message } = req.body
            var data = {
                broker_id: Broker,
                Message: message
            }

            const Message_brodcast_data = new Message_brodcast(data)
            Message_brodcast_data.save();
            return res.send({ status: true, msg: 'Strategy add Successfully', data: [] });


        } catch (error) {
            console.log("Error in Message brodast Add -", error.model);
            return res.send({ status: false, msg: 'Strategy not exist', data: [] });

        }
    }

    // GET ADD HELP
    async GetAllMessageBrodcast(req, res) {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            try {
                const result = await Message_brodcast.find({
                    createdAt: {
                        $gte: today,
                        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
                    },
                })

                if (result.length === 0) {
                    return res.send({ status: false, msg: 'No Msg Found', data: [] });
                }
                return res.send({ status: true, msg: 'All Help Msg', data: result });
            }
            catch (error) {
                return res.send({ status: false, msg: 'Error  to Create Generate Help Response.', error: error.message });
            }
        } catch (error) {
            console.log("Error Get All Message brodcast-", error);
        }
    }


    async GetMessageBrodcast(req, res) {
        try {
            const { id } = req.body;
            const objectId = new ObjectId(id);
            var broker_id1
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const result1 = await user.find({
                _id: objectId,
            }).select('license_type broker')

            if (result1.length == 0) {
                return res.send({ status: false, msg: 'Client Not Exist', data: [] });
            }

            var objectIds = ["-1"]

            if (result1[0].license_type == '0') {
                objectIds.push('0')
            } else {
                objectIds.push(result1[0].broker)
            }

            const result = await Message_brodcast.find({
                broker_id: { $in: objectIds },
                createdAt: {
                    $gte: today,
                    $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
                },
            })

            if (result.length == 0) {
                return res.send({ status: false, msg: 'message Empty', data: result });

            }
            return res.send({ status: true, msg: 'message get successufully', data: result });


        } catch (error) {
            console.log("Error Get  Message brodcast", error);
        }
    }


    async RemoveBroadCast(req, res) {
        try {

            const { id } = req.body;
            const objectId = new ObjectId(id);

            const get_user = await Message_brodcast.find({ _id: objectId });

            if (get_user.length == 0) {
                return res.send({ status: false, msg: "Empty data", data: [] });
            }

            var DeleteUser = await Message_brodcast.deleteOne({ _id: get_user });


            return res.send({ status: true, msg: 'Message Remove successfully', data: [] });

        } catch (error) {
            console.log("Error Remove Brodcast", error);
        }
    }

}


module.exports = new Message();