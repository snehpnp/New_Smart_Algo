const axios = require('axios');
const crypto = require('crypto');

const uid = "FA108922";
const pwd = "Mithu@99";
const vendor_code = "FA108922_U";  // Vendor code provided by the Noren team
const appkey = crypto.createHash('sha256').update(`${uid}|${vendor_code}`).digest('hex');
const hashedPwd = crypto.createHash('sha256').update(pwd).digest('hex');

const data = {
  jData: JSON.stringify({
    apkversion: "1.0.0",
    uid: uid,
    pwd: hashedPwd,
    factor2: "31-08-2017",
    vc: vendor_code,
    appkey: appkey,
    imei: "abc1234",
    source: "API"
  })
};

axios.post('https://api.shoonya.com/NorenWClientTP/QuickAuth', data)
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.log("error", error.response.data);
  });
