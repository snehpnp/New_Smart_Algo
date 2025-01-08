const WebSocket = require('ws');

// Replace these values with your actual UserID and Token
const userID = 'PNP0010';
const token = '';

// Establish WebSocket connection
const ws = new WebSocket('wss://bcastws.jmfonline.in:9192/HandleRequest', {
  headers: {
    'UserID': userID,
    'Token': token
  }
});

// Handle WebSocket events
ws.on('open', () => {
  console.log('WebSocket connection established');

  // Send login packet
  const loginPacket = {
    action: 'login',
   "data" : "[[\"D\",\"N\",\"C\",22,1], [\"D\",\"N\",\"C\",25,1], [\"D\",\"N\",\"C\",1333,1]]"
  };
  ws.send(JSON.stringify(loginPacket));
});

ws.on('message', (data) => {
  console.log('Message received:', data);
  const str = data.toString('hex');  // This will give you the hexadecimal string
  console.log(str);
  // Check for successful login and subscribe to scrip data
//   const response = JSON.parse(data);
//   if (response && response.action === 'login' && response.status === 'success') {
//     console.log('Login successful. Subscribing to scrip data...');

//     // Send subscription packet for scrip data
//     const scripDataPacket = {
//       action: 'scripData',
//       data: '[["D","N","C",22,1], ["D","N","C",25,1], ["D","N","C",1333,1]]' // Subscription data
//     };
//     ws.send(JSON.stringify(scripDataPacket));

//     // Subscribe for Top 5 Bids/Offers for a scrip
//     const boSubscriptionPacket = {
//       action: 'bidofferdata',
//       data: '[["O","N",22,1]]' // BO subscription data for scrip 22
//     };
//     ws.send(JSON.stringify(boSubscriptionPacket));
//   }


});

ws.on('error', (error) => {
  console.error('WebSocket error:', error);
});

ws.on('close', () => {
  console.log('WebSocket connection closed');
});
