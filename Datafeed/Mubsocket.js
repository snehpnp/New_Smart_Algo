const WebSocket = require("ws");
const struct = require("python-struct");
const { DateTime } = require("luxon");

const config = {
  userID: "PNP0010",
  token: "",
  websocketUrl: "wss://fund.markethubonline.com:9198/HandleRequest",
};

const createSocket = () => {
  const ws = new WebSocket(config.websocketUrl, {
    headers: {
      UserID: config.userID,
      Token: config.token,
    },
  });

  ws.on("open", () => handleOpen(ws));
  ws.on("message", (message) => handleMessage(ws, message));
  ws.on("error", (error) => handleError(ws, error));
  ws.on("close", (code, reason) => handleClose(ws, code, reason));
};

const handleOpen = (ws) => {
  console.log("Connected to WebSocket server.");
  const loginPacket = {
    action: "login",
    data: '["Q","PNP0010",1,1,1,1,1,1,1,1,1]',
  };
  ws.send(JSON.stringify(loginPacket));
  console.log("Login request sent.");
};

const handleMessage = (ws, message) => {
  const buffer = Buffer.from(message);
  decodeMessage(ws, buffer);
};

// WebSocket "error" event handler
const handleError = (ws, error) => {
  console.log("WebSocket error occurred:", error);
  if (error.code) {
    console.log(`Error code: ${error.code}`);
  }
};

// WebSocket "close" event handler
const handleClose = (ws, code, reason) => {
  console.log(`WebSocket connection closed. Code: ${code}, Reason: ${reason}`);
  createSocket();
};

// Decode Message Function
const decodeMessage = (ws, message) => {
  if (message.length < 30) {
    console.log(
      `Invalid packet size (${message.length} bytes). Discarding message.`
    );
    return;
  }

  try {
    const body = message.slice(10);
    const token = struct.unpack("I", message.slice(1, 5))[0];
    const Cur_Time = struct.unpack("I", message.slice(5, 9))[0];
    let recType = struct.unpack("B", message.slice(9, 10))[0];

    if (String.fromCharCode(recType) == "A") {
      //   CheckNewScript(ws);

      const [lp, prevClose, openInterest] = struct.unpack(
        "fff",
        body.slice(0, 12)
      );

      console.log(
        "Time:",
        DateTime.now().toISO(),
        "Token:",
        token,
        "LP:",
        lp,
        "Prev Close:",
        prevClose,
        "OI:",
        openInterest
      );
    }
    CheckNewScript(ws);
  } catch (error) {
    console.log(`Error decoding message: ${error}`);
  }
};

const CheckNewScript = (ws) => {
  const loginPacket = {
    action: "scripData",
    data: '[["D", "N", "D", 48119, 1], ["D", "N", "D", 35025, 1], ["D", "N", "D", 48117, 1]]',
  };
  ws.send(JSON.stringify(loginPacket));
};

// Start the WebSocket connection
createSocket();
