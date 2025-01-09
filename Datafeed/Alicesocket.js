const server = http.createServer(app);
const io = socketIo(server);

const ConnectSocket = async (EXCHANGE, instrument_token) => {
  const channel_List = `${EXCHANGE}|${instrument_token}`;

  const broker_infor = await live_price.findOne({
    broker_name: "ALICE_BLUE",
    trading_status: "on",
  });

  if (broker_infor) {
    const aliceBaseUrl =
      "https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/";
    const userid = broker_infor.user_id;
    const userSession1 = broker_infor.access_token;
    const type = { loginType: "API" };
    const url = "wss://ws1.aliceblueonline.com/NorenWS/";

    try {
      const token_chain_list = db1.collection("token_chain");
      await token_chain_list.updateOne(
        { _id: instrument_token },
        {
          $set: {
            _id: instrument_token,
            exch: EXCHANGE,
          },
        },
        { upsert: true }
      );

      const res = await axios.post(`${aliceBaseUrl}ws/createSocketSess`, type, {
        headers: {
          Authorization: `Bearer ${userid} ${userSession1}`,
          "Content-Type": "application/json",
        },
      });

      if (res.data.stat === "Ok") {
        return new Promise((resolve, reject) => {
          const socket = new WebSocket(url);

          socket.onopen = function () {
            const encrcptToken = CryptoJS.SHA256(
              CryptoJS.SHA256(userSession1).toString()
            ).toString();

            const initCon = {
              susertoken: encrcptToken,
              t: "c",
              actid: userid + "_" + "API",
              uid: userid + "_" + "API",
              source: "API",
            };

            socket.send(JSON.stringify(initCon));
          };

          socket.onmessage = async function (msg) {
            try {
              const response = JSON.parse(msg.data);

              if (response.tk) {
                const currentDate = new Date();
                const hours = currentDate
                  .getHours()
                  .toString()
                  .padStart(2, "0");
                const minutes = currentDate
                  .getMinutes()
                  .toString()
                  .padStart(2, "0");

                const stock_live_price = db1.collection("stock_live_price");
                const filter = { _id: response.tk };

                if (response.lp !== undefined) {
                  let bp1 = response.bp1 || response.lp;
                  let sp1 = response.sp1 || response.lp;

                  const update = {
                    $set: {
                      lp: response.lp,
                      exc: response.e,
                      sp1: sp1,
                      bp1: bp1,
                      curtime: `${hours}${minutes}`,
                    },
                  };

                  await stock_live_price.updateOne(filter, update, {
                    upsert: true,
                  });
                }

                socket.close();
                resolve(response); // Send the price data back to the function caller
              }

              if (response.s === "OK") {
                const json = {
                  k: channel_List,
                  t: "t",
                };
                socket.send(JSON.stringify(json));
              }
            } catch (error) {
              console.error("Error in onmessage:", error);
              reject(error);
            }
          };

          socket.onerror = (error) => {
            console.error("WebSocket Error:", error);
            reject(error);
          };

          socket.onclose = () => {
            console.log("Socket closed");
          };
        });
      }
    } catch (error) {
      console.error("Error in Socket Session:", error);
      throw error;
    }
  } else {
    throw new Error("Trading is turned off by admin.");
  }
};

ConnectSocket()