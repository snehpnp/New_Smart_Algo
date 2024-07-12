const axios = require('axios');
var data_possition = {
    "clientcode": "VNYS1547"
}

var config = {
    method: 'post',
    url: 'https://openapi.motilaloswal.com/rest/book/v1/getposition',
    headers: {
        'Accept': 'application/json',
        'ApiKey': "81aVeIuyYesSJ5pD",
        'User-Agent': 'MOSL/V.1.1.0',
        'vendorinfo': "VNYS1547",
        'SourceId': 'WEB',
        'MacAddress': 'B8-CA-3A-95-66-72',
        'ClientLocalIp': '192.168.0.47',
        'ClientPublicIp': '255.255.255.0',
        'osname': 'Windows 10',
        'osversion': '10.0.19041',
        'devicemodel': 'AHV',
        'manufacturer': 'DELL',
        'productname': 'Smart Algo',
        'productversion': '1.1',
        'browsername': 'Chrome',
        'browserversion': '109.0.5414.120',
        'Authorization': "b0cad2644ea84560b1466f80808cca45_M",
        'Content-Type': 'application/json'
    },
    data: JSON.stringify(data_possition)
};
axios(config)
    .then(async (response) => {
        console.log(JSON.stringify(response.data));
    })
    .catch(function(error) {
        console.log(error);
    });
