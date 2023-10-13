"use strict";
const db = require('../../Models');
const Message_brodcast = db.Messagebrodcast_data
const strategy = db.strategy
const strategy_client = db.strategy_client


// const { formattedDateTime } = require('../../Helper/time.helper')
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


class Message {

    // ADD MESSAGE BRODCAST
    async AddMessageBrodcast(req, res) {
        try {

            const { starteg_id, message } = req.body
            var Find_strategy = await strategy.find({ _id: starteg_id })
            if (Find_strategy.length == 0) {
                return res.send({ status: false, msg: 'Strategy not exist', data: [] });
            }
            var data = {
                strategy_id: Find_strategy[0]._id,
                Message: message
            }

            const Message_brodcast_data = new Message_brodcast(data)
            Message_brodcast_data.save();
            return res.send({ status: true, msg: 'Strategy add Successfully', data: [] });


        } catch (error) {
            console.log("Error in Message brodast -", error.model);
            return res.send({ status: false, msg: 'Strategy not exist', data: [] });

        }
    }


    // GET ADD HELP
    async GetAllMessageBrodcast(req, res) {
        try {

            // const { _id } = req.body;
            // const objectId = new ObjectId(_id);

            const today = new Date();
            today.setHours(0, 0, 0, 0);


            try {
                const result = await Message_brodcast.find({
                    // admin_id: objectId,
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
            console.log("Help- Center error-", error);
        }
    }


    async GetMessageBrodcast(req, res) {
        try {

            const { id } = req.body;
            const objectId = new ObjectId(id);

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const result1 = await strategy_client.find({
                user_id: objectId,

            })


            if (result1.length == 0) {
                return res.send({ status: false, msg: 'Client Not Exist', data: [] });

            }

            var Strategy_sms = []

            result1.forEach(async (data) => {

                const result = await Message_brodcast.find({
                    strategy_id: data.strategy_id,
                    createdAt: {
                        $gte: today,
                        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
                    },
                })

                Strategy_sms.push(result[0])

                // console.log("Strategy_sms", Strategy_sms);

            })

                return res.send({ status: true, msg: 'message get successufully', data: [] });

            // try {
            //     const result = await Message_brodcast.find({
            //         // admin_id: objectId,
            //         createdAt: {
            //             $gte: today,
            //             $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
            //         },
            //     })

            //     if (result.length === 0) {
            //         return res.send({ status: false, msg: 'No Msg Found', data: [] });
            //     }
            //     return res.send({ status: true, msg: 'All Help Msg', data: result });
            // }
            // catch (error) {
            //     return res.send({ status: false, msg: 'Error  to Create Generate Help Response.', error: error.message });
            // }

        } catch (error) {
            console.log("Help- Center error-", error);
        }
    }


}


module.exports = new Message();