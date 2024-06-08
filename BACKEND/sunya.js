const axios = require('axios');
var sha256 = require("crypto-js/sha256");


const otplib = require('otplib');

const totp = otplib.authenticator.generate("2556TMC52Y667O27SB7A4LDN2326HZLE");

var params = {
    'userid'   : 'FA108922',
    'password' : 'Mithu@99',
    'twoFA'    :totp,
    'vendor_code' : 'FA108922_U',
    'api_secret' : '99313d0d32798a1af4e35fe50e807cf8',
    'imei'       : 'abc1234'
    }
   
    let pwd       = sha256(params.password).toString(); 
    let u_app_key =  `${params.userid}|${params.api_secret}`
    let app_key   = sha256(u_app_key).toString();

    let authparams = {
        "source": "API" , 
        "apkversion": "js:1.0.0",
        "uid": params.userid,
        "pwd": pwd,
        "factor2": params.twoFA,
        "vc": params.vendor_code,
        "appkey": app_key,
        "imei": params.imei            
    };


    let payload = 'jData=' + JSON.stringify(authparams);


axios.post('https://api.shoonya.com/NorenWClientTP/QuickAuth', payload, {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})
.then(response => {
  console.log(response.data);
})
.catch(error => {
  console.error("error", error.response.data);
});
