const axios = require('axios');
const sha256 = require('crypto-js/sha256');
const otplib = require('otplib');

// Generate the TOTP
const totp = otplib.authenticator.generate('2556TMC52Y667O27SB7A4LDN2326HZLE');

// Authentication parameters
const authParams = {
  userid: 'FA108922',
  password: 'Mithu@99',
  twoFA: totp,
  vendor_code: 'FA108922_U',
  api_secret: '99313d0d32798a1af4e35fe50e807cf8',
  imei: 'abc1234'
};

// Hash the password and generate app key
const pwd = sha256(authParams.password).toString();
const uAppKey = `${authParams.userid}|${authParams.api_secret}`;
const appKey = sha256(uAppKey).toString();

// Auth parameters for QuickAuth request
const authPayload = {
  source: 'API',
  apkversion: 'js:1.0.0',
  uid: authParams.userid,
  pwd: pwd,
  factor2: authParams.twoFA,
  vc: authParams.vendor_code,
  appkey: appKey,
  imei: authParams.imei
};

const authData = 'jData=' + JSON.stringify(authPayload);



// Step 1: Perform the authentication
axios.post('https://api.shoonya.com/NorenWClientTP/QuickAuth', authData, {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})
.then(authResponse => {
//   console.log('Authentication Successful:', authResponse.data);
  
  // Extract jKey from the authentication response
  const jKey = authResponse.data.susertoken;

  // Step 2: Place an order
  const orderParams = {
    uid: 'FA108922',
    actid: 'FA108922',
    exch: 'NSE',
    tsym: 'ACC-EQ',
    qty: '50',
    prc: '1400',
    prd: 'M',
    trantype: 'B',
    prctyp: 'LMT',
    ret: 'DAY'
  };

  let orderData = 'jData=' + JSON.stringify(orderParams);
  
  orderData = orderData + `&jKey=${jKey}`;
console.log("orderData",orderData)

  axios.post('https://api.shoonya.com/NorenWClientTP/PlaceOrder', orderData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  
  .then(orderResponse => {
    console.log('Order placed successfully:', orderResponse.data);
  })
  .catch(orderError => {
    console.error('Error placing order:', orderError.response ? orderError.response.data : orderError.message);
  });

})
.catch(authError => {
  console.error('Error in authentication:', authError.response ? authError.response.data : authError.message);
});
