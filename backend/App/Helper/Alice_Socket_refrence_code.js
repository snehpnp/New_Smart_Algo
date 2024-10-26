const WebSocket = require('ws');
const CryptoJS = require('crypto-js');

let ws;
let channelList = "NFO|67861#NFO|42195#NFO|67862";  // Initial channelList
const url = "wss://example.com/socket";  // Replace with your WebSocket URL
const userSession1 = "some_session_value";  // Replace with actual session
const userid = "user123";  // Replace with actual user ID

// Function to open WebSocket connection
function openSocketConnection() {
    ws = new WebSocket(url);

    ws.on('open', function open() {
        var encrcptToken = CryptoJS.SHA256(CryptoJS.SHA256(userSession1).toString()).toString();
        var initCon = {
            susertoken: encrcptToken,
            t: "c",
            actid: userid + "_" + "API",
            uid: userid + "_" + "API",
            source: "API"
        };
        ws.send(JSON.stringify(initCon));
        console.log("Connection opened and initCon sent");

        // Send initial channel list
        sendChannelList();
    });

    ws.on('message', async function incoming(msg) {
        const response = JSON.parse(msg);
        console.log("Message received from server:", response);

        if (response.s === 'OK') {
            console.log("Connection acknowledged by server");
        }
    });

    ws.on('close', function close() {
        console.log("WebSocket closed");
        // Handle reconnection logic if needed
    });

    ws.on('error', function error(error) {
        console.error("WebSocket error:", error);
    });
}

// Function to send the current channel list
function sendChannelList() {
    if (ws && ws.readyState === WebSocket.OPEN) {
        const json = {
            k: channelList,
            t: 't'
        };
        ws.send(JSON.stringify(json));  // Send channel list to server
        // console.log("Channel list sent:", channelList);
    } else {
        console.log("WebSocket is not open. Cannot send channel list.");
    }
}

// Function to dynamically update the channelList and send it
function updateChannelAndSend(newChannel) {
    channelList += newChannel;  // Add the new channel to the existing list
    console.log("Updated channelList:", channelList);
    sendChannelList();  // Send updated channel list
}

// Open the WebSocket connection
openSocketConnection();

// Dynamically update and send channel list after 5 seconds
// setTimeout(() => {
//     updateChannelAndSend("#NFO|67863");  // Example: Adding a new channel dynamically
// }, 5000);
