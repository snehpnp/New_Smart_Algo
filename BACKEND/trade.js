for(let i=0;i<1;i++){
    const axios = require('axios');
let data = 'DTime:1718789102|Symbol:NIFTY|TType:LX|Tr_Price:0.00000000|Price:395.60|Sq_Value:0.00000000|Sl_Value:0.00|TSL:0.00|Segment:O|Strike:22000|OType:CALL|Expiry:04072024|Strategy:Test1|Quntity:100|Key:SNE132023|TradeType:MT_4|Demo:demo\\u0000';

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'http://localhost:8000/broker-signals',
  headers: { 
    'Content-Type': 'text/plain'
  },
  data : data
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});

}