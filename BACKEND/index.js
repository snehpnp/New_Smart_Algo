const axios = require('axios');

// const run = ()=>{

// const apiUrl = 'https://gw-napi.kotaksecurities.com/Files/1.0/masterscrip/v1/file-paths';

// const headers = {
//   'accept': '*',
//   'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6WyJUcmFkZSJdLCJleHAiOjE3MDE0NTU0MDAsImp0aSI6ImE0NjY0ZjAzLTQwYTktNDBkYS05ZTg2LTFjYmQyNTRlZmQ2ZSIsImlhdCI6MTcwMTQzMDY2NiwiaXNzIjoibG9naW4tc2VydmljZSIsInN1YiI6ImMzM2I3YjM0LTc4M2MtNDczOS05N2UwLTA0NDAzYzNmYzNiMiIsInVjYyI6IllNSjlDIiwibmFwIjoiQUFUUFc2MzM3SyIsImZldGNoY2FjaGluZ3J1bGUiOjAsImNhdGVnb3Jpc2F0aW9uIjoiIn0.F9A9X5AquUlBZT3MYKgrAhG6aANAigmBKbdUkLln0Ejfawtb-da184P0HXT6-2dNgbvF5FvOY9ZOmdA7yia74gEN88ERXNOdyeY6T1TOiSPkt2sO92Mcpf4BzMgt_DOBeKpVnmCiZ5cuEWL_V6F4NC2dnT6qgk3WaExX8dpQoQ_uniHJ8q6qu4dRvMVNY7fTJqM2FtxrcX79MiFUw1rW0pZtprh5EX5w6h0Vs7W9pmKDafGEUY52aWK0RqoYBF5hlg0e6vlem5nX-T4PwHffLfz3A8PQMUqPlFnHkt_w5gARfBx698YyMyTnA4gqK0ZpRvyY5xpcw2FNpz_QIVkaZg'
// }

// axios.get(apiUrl, { headers })
//   .then(response => {
//     console.log('Response:', response.data);
//   })
//   .catch(error => {
//     console.error('Error:', error.message);
//   });

// }

// run()




let url1 = `https://gw-napi.kotaksecurities.com/Orders/2.0/quick/order/history?sId=${item.hserverid}`

let config1 = {
    method: 'post',
    maxBodyLength: Infinity,
    url: url1,
    headers: {
        'accept': 'application/json',
        'Sid': item.kotakneo_sid,
        'Auth': item.access_token,
        'neo-fin-key': 'neotradeapi',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + item.oneTimeToken
    },
    data: data_orderHistory
};

axios(config1)
    .then(function (response1) {

        if (response1.data.stat == "Ok") { }
    })