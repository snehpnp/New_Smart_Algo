"use strict";
var axios = require('axios');

const db = require('../../Models');
const BrokerResponse_modal = db.BrokerResponse
const User = db.user;
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const { formattedDateTime } = require('../../Helper/time.helper')

class BrokerReponse {


    // GET ADMIN SIGNALS

    async GetUserBrokerResponse(req, res) {
        try {
            const { _id } = req.body;
            var objectId = new ObjectId(_id);
            console.log("run 12");
            try {
                GetAllBrokerResponse(_id)
            } catch (error) {

            }

            try {
                const currentDate = new Date();
                // Step 1: Check if today is a Saturday (6) or Sunday (0)
                if (currentDate.getDay() === 6) {
                    currentDate.setDate(currentDate.getDate() - 1);
                }

                currentDate.setHours(0, 0, 0, 0);
                const endOfDay = new Date(currentDate);
                endOfDay.setHours(23, 59, 59, 999);
                console.log(currentDate);
                console.log(endOfDay);


                const filteredSignals = await BrokerResponse_modal.find({
                    user_id: objectId,
                    createdAt: {
                        $gte: currentDate, // Greater than or equal to the start of the day
                        $lte: endOfDay,    // Less than or equal to the end of the day
                    },
                }).sort({ createdAt: -1 });

                if (filteredSignals.length === 0) {
                    return res.json({ status: false, msg: 'No Data Found', data: [] });
                }
                return res.status(200).json({ status: true, msg: 'All Broker Response', data: filteredSignals });
            } catch (error) {
                return res.status(500).json({ status: false, msg: 'Error fetching Broker Response.', error: error.message });
            }

        } catch (error) {
            console.log("Theme error-", error);
        }
    }



}



const GetAllBrokerResponse = async (user_id) => {
    const objectId = new ObjectId(user_id);
    var FindUserAccessToken = await User.find({ _id: objectId });

    const today = new Date();
    today.setHours(0, 0, 0, 0);


    var FindUserBrokerResponse = await BrokerResponse_modal.find({
        user_id: objectId, order_view_status: "0", createdAt: {
            $gte: today
        }
    });
// console.log(FindUserBrokerResponse.length);

    if (FindUserBrokerResponse.length > 0) {

        FindUserBrokerResponse.forEach((data1) => {


            let data = JSON.stringify({
                "nestOrderNumber": data1.order_id
            });

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/placeOrder/orderHistory',
                headers: {
                    'Authorization': "Bearer " + FindUserAccessToken[0].demat_userid + " " + FindUserAccessToken[0].access_token,
                    'Content-Type': 'application/json',
                },
                data: data
            };
            axios(config)
                .then(async (response) => {
                    // console.log(response.data[0]);
                    if (response.data[0]) {

                        const message = (JSON.stringify(response.data[0]));

                        let result = await BrokerResponse_modal.findByIdAndUpdate(
                            { _id: data1._id },
                            {
                                order_view_date: message,
                                order_view_status: '1',
                                order_view_response: response.data[0].Status,
                                reject_reason: response.data[0].rejectionreason

                            },
                            { new: true }
                        )


                    } else {
                        // console.log("NO DATA FOUND");
                    }
                })
                .catch(async (error) => {
                    console.log(error);
                });


        })


    }
}
module.exports = new BrokerReponse();