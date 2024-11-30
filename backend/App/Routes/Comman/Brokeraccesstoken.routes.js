
"use strict"

const router = require("express").Router()
const db = require('../../Models');
const User = db.user;
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;



// ALICE BLUE CONTROLLER FILE
const { GetAccessToken, GetOrderFullInformationAll } = require('../../Controllers/Brokeraccesstoken/Aliceblue')
const { GetAccessTokenAngel, GetOrderFullInformationAngel, UpdateTotp } = require('../../Controllers/Brokeraccesstoken/Angel')


// BROKER REDIRECT
const GetOrderFullInformationAll_broker = async (req, res) => {

    let user_id = req.body.user_id;
    const objectId = new ObjectId(user_id);

    const pipeline = [
        {
            $match: {
                _id: objectId,
                TradingStatus: "on"
            }
        },
        {
            $limit: 1
        }
    ]
    const result = await User.aggregate(pipeline)


    if (result.length == 0) {
        return res.send({ status: false, data: [], msg: "Your Trading Status Off" })
    }

    const broker = result[0].broker;


    // ALICE BLUE   -  2
    if (broker == 2) {
        GetOrderFullInformationAll(req, res);
    }

    // ANGEL   -  12
    else if (broker == 12) {
        // GetOrderFullInformationAngel(req, res, result);
    }

    //    // 5 PAISA   -  14
    //    else if(broker == 14){
    //     GetOrderFullInformationFivepaisa(req,res,result);
    //    }

    //    // ZERODHA   -  15
    //    else if(broker == 15){
    //     GetOrderFullInformationZerodha(req,res,result);
    //    }

    else {
        res.send({ status: false, msg: "broker not found" });
    }


}













router.post('/getall/order/info', GetOrderFullInformationAll_broker);



// AliCE BLUE
router.get('/AliceBlue', GetAccessToken);

router.post('/angel', GetAccessTokenAngel);
router.post('/update/angel/totp', UpdateTotp);



module.exports = router;


