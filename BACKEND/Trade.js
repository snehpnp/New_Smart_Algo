// =================== 5 APISA

// const axios = require('axios');

// const data = {
//   head: { key: 'zOyakHF6hEfnIAlXBfN5J3Boiv8ykQOw' },
//   body: { ClientCode: 'your_client_code_here' }
// };

// const config = {
//   method: 'post',
//    url: 'https://Openapi.5paisa.com/VendorsAPI/Service1.svc/V4/NetPosition',
//    url:"https://Openapi.5paisa.com/VendorsAPI/Service1.svc/V3/OrderBook",
//   headers: { 
//     'Accept': 'application/json, text/plain, */*',
//     'Content-Type': 'application/json',
//     'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjU3MzEzNjU1Iiwicm9sZSI6IjIzMzUxIiwiU3RhdGUiOiIiLCJSZWRpcmVjdFNlcnZlciI6IkEiLCJuYmYiOjE3MTg2ODQ5NjYsImV4cCI6MTcxODczNTM5OSwiaWF0IjoxNzE4Njg0OTY2fQ.eS-R9gOL5S_qDw0e755OuI-mO4k4XPnEf56IHojm0MQ',
//     'User-Agent': 'axios/1.5.0'
//   },
//   data: data
// };

// axios(config)
// .then(response => {
//   console.log('Response data:', response.data);
// })
// .catch(error => {
//   if (error.response) {
//     console.error('Error response data:', error.response.data);
//     console.error('Error response status:', error.response.status);
//     console.error('Error response headers:', error.response.headers);
//   } else {
//     console.error('Error message:', error.message);
//   }
// });

// =================== DHAN


// const axios = require('axios');

// // Request data
// const requestData = {
//   dhanClientId: "1000000003",
//   correlationId: "123abc678",
//   transactionType: "BUY",
//   exchangeSegment: "NSE_EQ",
//   productType: "INTRADAY",
//   orderType: "MARKET",
//   validity: "DAY",
//   tradingSymbol: "",
//   securityId: "11536",
//   quantity: "5",
//   disclosedQuantity: "",
//   price: "",
//   triggerPrice: "",
//   afterMarketOrder: false,
//   amoTime: "",
//   boProfitValue: "",
//   boStopLossValue: "",
//   drvExpiryDate: "string",
//   drvOptionType: "CALL",
//   drvStrikePrice: -3.402823669209385e+38
// };

// // Axios POST request
// axios.post('https://api.dhan.co/orders', requestData, {
//   headers: {
//     'Content-Type': 'application/json',
//     'access-token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJkaGFuIiwicGFydG5lcklkIjoiIiwiZXhwIjoxNzIxMjc0MTA1LCJ0b2tlbkNvbnN1bWVyVHlwZSI6IlNFTEYiLCJ3ZWJob29rVXJsIjoiaHR0cHM6Ly9kaGFuLmNvLyIsImRoYW5DbGllbnRJZCI6IjExMDM1MDQyODMifQ.1hNAHbZ6sKiKC_RdetRpzKEcSM3HBG8J9dLWLZKTg4A9HZ9LmUgF22vGV1PrakfFOieOvb7zwpt0--shQIVAiQ'  
//   }
// })
// .then(response => {
//   console.log('Response:', response.data);
// })
// .catch(error => {
//   console.error('Error:', error);
// });



const axios = require('axios');

// Request data
const requestData = {
    dhanClientId: "1103504283",
    transactionType: "BUY",
    exchangeSegment: "NSE_FNO",
    productType: "INTRADAY",
    orderType: "MARKET",
    validity: "DAY",
    securityId: "41167",
    quantity: 60,
    price: 0,
    triggerPrice: 0,
    afterMarketOrder: false,
    amoTime: "OPEN",
    boProfitValue: 0,
    boStopLossValue: 0
};



// Axios request configuration
const axiosConfig = {
    method: 'post',
    url: 'https://api.dhan.co/orders',
    headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'access-token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJkaGFuIiwicGFydG5lcklkIjoiIiwiZXhwIjoxNzIxMjc0MTA1LCJ0b2tlbkNvbnN1bWVyVHlwZSI6IlNFTEYiLCJ3ZWJob29rVXJsIjoiaHR0cHM6Ly9kaGFuLmNvLyIsImRoYW5DbGllbnRJZCI6IjExMDM1MDQyODMifQ.1hNAHbZ6sKiKC_RdetRpzKEcSM3HBG8J9dLWLZKTg4A9HZ9LmUgF22vGV1PrakfFOieOvb7zwpt0--shQIVAiQ',
        'User-Agent': 'axios/1.5.0'
    },
    data: JSON.stringify(requestData)
};

// Axios request
axios(axiosConfig)
    .then(response => {
        console.log('Response:', response.data);
        // Handle response here
    })
    .catch(error => {
        console.error('Error:', error.response.data);
        // Handle error here
    });
