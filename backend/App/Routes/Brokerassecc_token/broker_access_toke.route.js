
"use strict"

const router = require("express").Router()
const { verifyToken } = require('../../Middleware/authjwt')
const db = require('../../Models');
const User = db.user;
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


// ALICE BLUE CONTROLLER FILE
const { CancelorderByAdmin } = require('../../Controllers/Brokerassecc_token/CancelOrder')

// ALICE BLUE CONTROLLER FILE
const { GetAccessToken, GetLivePrice, Cancel_order, GetOrderFullInformationAll, backendRunSocket } = require('../../Controllers/Brokerassecc_token/Alice')

// ANGEL CONTROLLER FILE
const { GetAccessTokenAngel, GetOrderFullInformationAngel,SingleOrderFullInformationAngel } = require('../../Controllers/Brokerassecc_token/Angel')

// 5 PAISA CONTROLLER FILE
const { GetAccessTokenFivepaisa, GetOrderFullInformationFivepaisa } = require('../../Controllers/Brokerassecc_token/Fivepaisa')


//  FYERS CONTROLLER FILE
const { GetAccessTokenFyers, GetOrderFullInformationFyers } = require('../../Controllers/Brokerassecc_token/Fyers')


// ZERODHA CONTROLLER FILE
const { GetAccessTokenZerodha, GetOrderFullInformationZerodha } = require('../../Controllers/Brokerassecc_token/Zerodha')


// UPSTOX CONTROLLER FILE
const { GetAccessTokenUpstox, GetOrderFullInformationUpstox } = require('../../Controllers/Brokerassecc_token/Upstox')

// Dhan CONTROLLER FILE
const { GetAccessTokenDhan, GetOrderFullInformationDhan } = require('../../Controllers/Brokerassecc_token/Dhan')

// Markethub CONTROLLER FILE
const { GetAccessTokenMarkethub, GetOrderFullInformationMarkethub } = require('../../Controllers/Brokerassecc_token/Mhub')


// Swastika CONTROLLER FILE
const { GetAccessTokenSwastika, GetOrderFullInformationSwastika } = require('../../Controllers/Brokerassecc_token/Swastika')

// Kotak Neo CONTROLLER FILE
const { GetkotakGetToken, GetkotakGetSession, GetOrderFullInformationKotakNeo } = require('../../Controllers/Brokerassecc_token/KotakNeo')


// MASTER TRUST CONTROLLER FILE
const { GetAccessTokenMastertrust, GetOrderFullInformationMastertrust } = require('../../Controllers/Brokerassecc_token/Mastertrust')



// Kotak Neo CONTROLLER FILE
const { GetAccessTokenZebull, GetOrderFullInformationZebull } = require('../../Controllers/Brokerassecc_token/Zebull')


const { GetAccessTokenMotilaloswal, GetOrderFullInformationMotilaloswal } = require('../../Controllers/Brokerassecc_token/Motilaloswal')

const { GetAccessTokenIifl, GetOrderFullInformationIifl } = require('../../Controllers/Brokerassecc_token/Iifl')

const { GetAccessTokenIcicidirect, GetOrderFullInformationIcicidirect } = require('../../Controllers/Brokerassecc_token/Icicidirect')

const { GetAccessTokenmandotsecurities, GetOrderFullInformationmandotsecurities } = require('../../Controllers/Brokerassecc_token/Mandotsecurities')


// BROKER REDIRECT
const GetOrderFullInformationAll_broker = async (req, res) => {

  let user_id = req.body.user_id;
  const objectId = new ObjectId(user_id);

  const pipeline = [
    {
      $match: {
        _id: objectId
      }
    },
    {
      $limit: 1
    }
  ]
  const result = await User.aggregate(pipeline)






  if (result.length > 0) {


    const broker = result[0].broker;
   

    // Market Hub   -  1
    if (broker == 1) {
      GetOrderFullInformationMarkethub(req, res, result);
    }
    // ALICE BLUE   -  2
    else if (broker == 2) {
      GetOrderFullInformationAll(req, res);
    }

    // MASTER TRUST   -  3
    else if (broker == 3) {
      GetOrderFullInformationMastertrust(req, res, result);
    }

    // KotakNeo  - 7
    else if (broker == 7) {
      GetOrderFullInformationKotakNeo(req, res, result);
    }
    // ANGEL   -  12
    else if (broker == 12) {
      let broker_response_id = req.body.broker_response_id;
      let order_id = req.body.order_id;
   
      if(order_id != "" && order_id != undefined){
      SingleOrderFullInformationAngel(req, res, result,broker_response_id , order_id);
      }else{
        return res.send({ status: false, msg: 'Please Fill All Feild', data: [] });
      }
    }

    // 5 PAISA   -  13
    else if (broker == 13) {
      GetOrderFullInformationFyers(req, res, result);
    }

    // 5 PAISA   -  14
    else if (broker == 14) {
      GetOrderFullInformationFivepaisa(req, res, result);
    }

    // ZERODHA   -  15
    else if (broker == 15) {
      GetOrderFullInformationZerodha(req, res, result);
    }

    // UPSTOX   -  19
    else if (broker == 19) {
      GetOrderFullInformationUpstox(req, res, result);
    }
    // DHAN   -  20
    else if (broker == 20) {
      GetOrderFullInformationDhan(req, res, result);
    }
    // Swastika   -  21
    else if (broker == 21) {
      GetOrderFullInformationSwastika(req, res, result);
    }
    else if (broker == 5) {
      GetOrderFullInformationZebull(req, res, result);
    }
    else if (broker == 4) {
      GetOrderFullInformationMotilaloswal(req, res, result);
    }
    else if (broker == 25) {
      GetOrderFullInformationIcicidirect(req, res, result);
    }
    else if (broker == 26) {
      GetOrderFullInformationIifl(req, res, result);
    }
    // Mandot Securities   -  8
    else if (broker == 8) {
      GetOrderFullInformationmandotsecurities(req, res, result);
    }
    
    else {
      return res.send({ status: false, msg: "broker not found" });
    }



  } else {
    //console.log("User Not found")
    return res.send({ status: false, msg: "User Not found" });
  }


}



//Cancel Order By Admin Route
router.post('/cancelorderByAdmin', CancelorderByAdmin);




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

// Fyers
router.get('/fyers', GetAccessTokenFyers);

// 5 PPAISA
router.get('/fivepaisa', GetAccessTokenFivepaisa);


// ZERODHA
router.get('/zerodha', GetAccessTokenZerodha);

// Upstox
router.get('/upstox', GetAccessTokenUpstox);

// Dhan
router.post('/dhan', GetAccessTokenDhan);

// Market Hub
router.post('/markethub', GetAccessTokenMarkethub);

// Swastika
router.post('/swastika', GetAccessTokenSwastika);

// Kotak Neo
router.post('/kotakGetToken', GetkotakGetToken);
router.post('/kotakGetSession', GetkotakGetSession);


// Master Trust
router.get('/mastertrust', GetAccessTokenMastertrust);

// Zebull
router.post('/zebu', GetAccessTokenZebull);

router.post('/icicidirect', GetAccessTokenIcicidirect);

// Motilal oswal
router.get('/motilaloswal/access_token', GetAccessTokenMotilaloswal);

// IIFL
router.post('/iiflsecurities', GetAccessTokenIifl);


router.post('/mandotsecurities', GetAccessTokenmandotsecurities);





module.exports = router;


