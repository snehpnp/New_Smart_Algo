
"use strict"

const router = require("express").Router()
const { verifyToken } = require('../../Middleware/authjwt')
const db = require('../../Models');
const User = db.user;
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

//const { GetAccessToken ,GetOrderFullInformation,GetLivePrice,Cancel_order,GetOrderFullInformationAll} = require('../../Controllers/Brokerassecc_token/Alice')

// ALICE BLUE CONTROLLER FILE
const { GetAccessToken ,GetLivePrice,Cancel_order,GetOrderFullInformationAll,backendRunSocket} = require('../../Controllers/Brokerassecc_token/Alice')

// ANGEL CONTROLLER FILE
const { GetAccessTokenAngel,GetOrderFullInformationAngel} = require('../../Controllers/Brokerassecc_token/Angel')

// 5 PAISA CONTROLLER FILE
const { GetAccessTokenFivepaisa,GetOrderFullInformationFivepaisa} = require('../../Controllers/Brokerassecc_token/Fivepaisa')


// ZERODHA CONTROLLER FILE
const { GetAccessTokenZerodha,GetOrderFullInformationZerodha} = require('../../Controllers/Brokerassecc_token/Zerodha')


// BROKER REDIRECT
const GetOrderFullInformationAll_broker = async (req,res)=>{
    
    let user_id =  req.body.user_id;
    const objectId = new ObjectId(user_id);

    const pipeline =[
       {
         $match : {
            _id : objectId
         }
       }, 
       {
        $limit: 1 
       }
    ]
   const result = await User.aggregate(pipeline)
   const broker = result[0].broker;
   

   // ALICE BLUE   -  2
   if(broker == 2){
     GetOrderFullInformationAll(req,res);
   }
   
   // ANGEL   -  12
   else if(broker == 12){
    GetOrderFullInformationAngel(req,res,result);
   }

   // 5 PAISA   -  14
   else if(broker == 14){
    GetOrderFullInformationFivepaisa(req,res,result);
   }

   // ZERODHA   -  15
   else if(broker == 15){
    GetOrderFullInformationZerodha(req,res,result);
   }

   else{
    res.send({status:false,msg:"broker not found"});
   }
   
      
  }


// AliCE BLUE
router.get('/AliceBlue', GetAccessToken);


//router.post('/aliceblue/get/orderinfo', GetOrderFullInformation);
router.post('/get/token', GetLivePrice);


router.get('/backendRunSocket', backendRunSocket);



 router.post('/order/cancel', Cancel_order);

 
 //router.post('/getall/order/info', GetOrderFullInformationAll);
router.post('/getall/order/info', GetOrderFullInformationAll_broker);



// ANGEL
router.get('/angel', GetAccessTokenAngel);


// 5 PPAISA
router.get('/fivepaisa', GetAccessTokenFivepaisa);

// ZERODHA
router.get('/zerodha', GetAccessTokenZerodha);


module.exports = router;


