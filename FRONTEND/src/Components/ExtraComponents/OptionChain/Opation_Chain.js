/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-pascal-case */
import React, { useEffect, useState, useRef } from "react";
import Theme_Content from "../../../Components/Dashboard/Content/Content";
import Loader from "../../../Utils/Loader";
import FullDataTable from "../../../Components/ExtraComponents/Datatable/FullDataTable";
import { useDispatch } from "react-redux";
import BasicDataTable from "../../../Components/ExtraComponents/Datatable/BasicDataTable";
import Modal from "../../../Components/ExtraComponents/Modal";
import { Trash2, X } from "lucide-react";
import Holidays from "date-holidays";
import {
  Get_Option_Symbols_Expiry,
  Get_Option_Symbols,
  Get_Panel_key,
  Get_Option_All_Round_token,
  Option_Symbols_Update_status,
  Update_Subscribe_token,
} from "../../../ReduxStore/Slice/Common/Option_Chain_Slice";
import {
  get_thre_digit_month,
  convert_string_to_month,
} from "../../../Utils/Date_formet";
import { Get_All_Service_for_Client } from "../../../ReduxStore/Slice/Common/commoSlice";
import {
  CreateSocketSession,
  ConnctSocket,
  GetAccessToken,
} from "../../../Service/Alice_Socket";
import $ from "jquery";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

import ToastButton from "../../../Components/ExtraComponents/Alert_Toast";
import { GET_COMPANY_INFOS } from "../../../ReduxStore/Slice/Admin/AdminSlice";
import { useNavigate } from "react-router-dom";

const HelpCenter = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const strategyRef = useRef("");

  const user_id = JSON.parse(localStorage.getItem("user_details"))?.user_id;
  const token = JSON.parse(localStorage.getItem("user_details"))?.token;

  const [All_Symbols, set_All_Symbols] = useState({
    loading: false,
    data: [],
  });

  const [All_Symbols_Expiry, set_All_Symbols_Expiry] = useState({
    loading: false,
    data: [],
  });

  const [getAllStrategyName, setAllStrategyName] = useState({
    loading: true,
    data: [],
  });

  const [OptionChainData, setOptionChainData] = useState({
    loading: true,
    data: [],
    midd: 0,
  });

  const [ExecuteTradeData, setExecuteTradeData] = useState({
    loading: true,
    data: [],
  });

  const [PanelKey, setPanelKey] = useState("");
  const [TokenSymbolChain, setTokenSymbolChain] = useState("");
  const [UserDetails, setUserDetails] = useState([]);
  const [showModal, setshowModal] = useState(false);
  const [showModalSelectOptionStock, setshowModalSelectOptionStock] =
    useState(false);
  const [getBrokerUrl, setBrokerUrl] = useState("");
  const [symbolStrike, setSymbolStrike] = useState("");
  const [symbol, setSymbol] = useState("");
  const [expiry, setExpiry] = useState("");
  const [strategy, setStrategy] = useState("");
  const [ButtonDisabled, setButtonDisabled] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [SerachService, setSerachService] = useState("");
  const [state, setstate] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [tags1, setTags] = useState([]);

  const handleClickDisabled = () => {
    setDisabled(true);
  };

  const getPanelDetails = async () => {
    await dispatch(GET_COMPANY_INFOS())
      .unwrap()
      .then((response) => {
        let res = response.data[0];
        setBrokerUrl(res.broker_url);
      });
  };

  const columns = [
    {
      dataField: "CALL",
      text: "BUY/SELL",
      style: (cell, row) =>
        parseInt(row.strike_price) <
        parseInt(
          OptionChainData.data[OptionChainData && OptionChainData.midd]
            .strike_price
        )
          ? { backgroundColor: "beige" }
          : parseInt(row.strike_price) ===
            parseInt(
              OptionChainData.data[OptionChainData && OptionChainData.midd]
                .strike_price
            )
          ? { backgroundColor: "#4c584c6b" }
          : { backgroundColor: "" },
      formatter: (cell, row, rowIndex) => (
        <div key={rowIndex}>
          <button
            value="LE"
            className={`button_BUY  button_call_buy_${row.call_token}`}
            onClick={(e) => {
              CreateRequest("CALL", row, "LE", rowIndex, e);
            }}
            onDoubleClick={(e) => {
              RemoveClases("CALL", row, "LE", rowIndex, e);
            }}
          >
            B
          </button>
          <button
            value="SE"
            className={`button_sell button_call_sell_${row.call_token}`}
            onClick={(e) => {
              CreateRequest("CALL", row, "SE", rowIndex, e);
            }}
            onDoubleClick={(e) => {
              RemoveClases("CALL", row, "SE", rowIndex, e);
            }}
          >
            S
          </button>
        </div>
      ),
    },
    {
      dataField: "CALL/LP",
      text: "CALL/LP",
      style: (cell, row) =>
        parseInt(row.strike_price) <
        parseInt(
          OptionChainData.data[OptionChainData && OptionChainData.midd]
            .strike_price
        )
          ? { backgroundColor: "beige" }
          : parseInt(row.strike_price) ===
            parseInt(
              OptionChainData.data[OptionChainData && OptionChainData.midd]
                .strike_price
            )
          ? { backgroundColor: "#4c584c6b" }
          : { backgroundColor: "" },
      formatter: (cell, row, rowIndex) => (
        <div>
          <span className={`Call_Price_${row.call_token} `}></span>
          <span className={`SP1_Call_Price_${row.call_token} d-none`}></span>
        </div>
      ),
    },
    {
      dataField: "strike_price",
      text: "STRIKE PRICE",
      style: (cell, row) =>
        parseInt(row.strike_price) ==
        parseInt(
          OptionChainData.data[OptionChainData && OptionChainData.midd]
            .strike_price
        )
          ? { backgroundColor: "#4c584c6b" }
          : { backgroundColor: "" },
      formatter: (cell, row, rowIndex) => (
        <div>
          <span className={`fw-bold`}>{cell}</span>
        </div>
      ),
    },
    {
      dataField: "PUT/LP",
      text: "PUT/LP",
      style: (cell, row) =>
        parseInt(row.strike_price) >
        parseInt(
          OptionChainData.data[OptionChainData && OptionChainData.midd]
            .strike_price
        )
          ? { backgroundColor: "beige" }
          : parseInt(row.strike_price) ===
            parseInt(
              OptionChainData.data[OptionChainData && OptionChainData.midd]
                .strike_price
            )
          ? { backgroundColor: "#4c584c6b" }
          : { backgroundColor: "" },

      formatter: (cell, row, rowIndex) => (
        <div>
          <span className={`Put_Price_${row.put_token} `}></span>
          <span className={`BP1_Put_Price_${row.put_token} d-none`}></span>
        </div>
      ),
    },
    {
      dataField: "PUT",
      text: "BUY/SELL",
      style: (cell, row) =>
        parseInt(row.strike_price) >
        parseInt(
          OptionChainData.data[OptionChainData && OptionChainData.midd]
            .strike_price
        )
          ? { backgroundColor: "beige" }
          : parseInt(row.strike_price) ===
            parseInt(
              OptionChainData.data[OptionChainData && OptionChainData.midd]
                .strike_price
            )
          ? { backgroundColor: "#4c584c6b" }
          : { backgroundColor: "" },
      formatter: (cell, row, rowIndex) => (
        <div key={rowIndex}>
          <button
            value="LE"
            className={`button_BUY  button_put_buy_${row.put_token}`}
            onClick={(e) => {
              CreateRequest("PUT", row, "LE", rowIndex, e);
            }}
            onDoubleClick={(e) => {
              RemoveClases("PUT", row, "LE", rowIndex, e);
            }}
          >
            B
          </button>
          <button
            value="SE"
            className={`button_sell button_put_sell_${row.put_token}`}
            onClick={(e) => {
              CreateRequest("PUT", row, "SE", rowIndex, e);
            }}
            onDoubleClick={(e) => {
              RemoveClases("PUT", row, "SE", rowIndex, e);
            }}
          >
            S
          </button>
        </div>
      ),
    },
  ];

  const [CreateSignalRequest, setCreateSignalRequest] = useState([]);

  const RemoveClases = (option_type, row_data, call_type, index) => {
    CreateSignalRequest &&
      CreateSignalRequest.filter((item) => {
        const element1 = $(".button_call_sell_" + item.call_token._id);
        element1.removeClass("active");
        const element2 = $(".button_call_buy_" + item.call_token);
        element2.removeClass("active");
        const element4 = $(".button_put_sell_" + item.put_token);
        element4.removeClass("active");
        const element3 = $(".button_put_buy_" + item.put_token);
        element3.removeClass("active");
      });
  };

  const CreateRequest = (option_type, row_data, call_type, index) => {
    if (strategyRef.current === "") {
      alert("Please Select Strategy First");
    } else {
      OptionChainData.data &&
        OptionChainData.data.filter((item) => {
          if (
            item.call_token === row_data.call_token &&
            call_type === "LE" &&
            option_type === "CALL"
          ) {
            const element = $(".button_call_buy_" + item.call_token);
            element.addClass("active");
            const element1 = $(".button_call_sell_" + item.call_token);
            element1.removeClass("active");
          } else if (
            item.call_token === row_data.call_token &&
            call_type === "SE" &&
            option_type === "CALL"
          ) {
            const element = $(".button_call_sell_" + item.call_token);
            element.addClass("active");
            const element1 = $(".button_call_buy_" + item.call_token);
            element1.removeClass("active");
          }
          if (
            item.put_token === row_data.put_token &&
            call_type === "LE" &&
            option_type === "PUT"
          ) {
            const element = $(".button_put_buy_" + item.put_token);
            element.addClass("active");
            const element1 = $(".button_put_sell_" + item.put_token);
            element1.removeClass("active");
          } else if (
            item.put_token === row_data.put_token &&
            call_type === "SE" &&
            option_type === "PUT"
          ) {
            const element = $(".button_put_sell_" + item.put_token);
            element.addClass("active");
            const element1 = $(".button_put_buy_" + item.put_token);
            element1.removeClass("active");
          }
        });

      var pre_tag = {
        entry_qty: "100",
        option_type: option_type,
        type: call_type,
        token:
          option_type === "CALL" ? row_data.call_token : row_data.put_token,
        indexcallput:
          option_type === "CALL"
            ? `${option_type}_${row_data.call_token}`
            : `${option_type}_${row_data.put_token}`,
        indexing: index,
        segment: row_data.segment,
        strike: row_data.strike_price,
      };

      if (call_type === "") {
        setCreateSignalRequest((oldValues) => {
          return oldValues.filter(
            (item) =>
              item.token !==
              (option_type === "CALL"
                ? row_data.call_token
                : row_data.put_token)
          );
        });
      } else {
        setCreateSignalRequest((oldValues) => {
          return oldValues.filter(
            (item) =>
              item.indexcallput !==
              (option_type === "CALL"
                ? `${option_type}_${row_data.call_token}`
                : `${option_type}_${row_data.put_token}`)
          );
        });

        setCreateSignalRequest((oldArray) => [pre_tag, ...oldArray]);
      }
    }
  };

  // ------------------------------------ CREATE-CHAIN-FOR-EXECUTE-TRADE ------------------------------------

  const ExcuteTradeButton = () => {
    const currentDate = new Date();
    const weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const weekday = weekdays[currentDate.getDay()];
    const holidays = new Holidays();
    const currentDateIST = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    });
    const cutoffTimeIST = new Date();
    cutoffTimeIST.setHours(15, 30, 0, 0);
    // Check if the current time is after 3:30 PM in IST timezone
    // const isAfterCutoffTime =
    //   new Date(currentDateIST).getTime() > cutoffTimeIST.getTime();

    // if (!holidays.isHoliday(currentDate) && weekday !== 'Sunday' && weekday !== 'Saturday' && isAfterCutoffTime) {
    //     alert("Market Time Is Off")
    // } else {
    if (UserDetails !== undefined && UserDetails.trading_status === "on") {
      let Arr = [];

      const expiry_i = convert_string_to_month(expiry && expiry);

      CreateSignalRequest &&
        CreateSignalRequest.map((item) => {
          // const expiry_i = get_thre_digit_month()
          const buy = $(".BP1_Put_Price_" + item.token).html();
          const sell = $(".SP1_Call_Price_" + item.token).html();

          const Symbol = `${symbol && symbol}${expiry_i}${item.strike}${
            item.option_type === "CALL"
              ? "CE"
              : item.option_type === "PUT"
              ? "PE"
              : ""
          }`;

          Arr.push({
            entry_qty: item.entry_qty,
            price: buy ? buy : sell,
            Symbol: Symbol,
            option_type: `${
              item.option_type === "CALL"
                ? "CE"
                : item.option_type === "PUT"
                ? "PE"
                : ""
            }`,
            type: item.type === "SE" ? "SELL" : item.type === "LE" ? "BUY" : "",
            token: item.token,
            strategy: strategy && strategy,
            call_type: item.option_type,
            trading_type: item.type,
            segment: item.segment,
            strike: item.strike,
          });
        });

      setExecuteTradeData({
        loading: false,
        data: Arr,
      });
      setshowModal(true);
    } else {
      alert("Please Login With Broker Account");
    }

    // }
  };

  // ------------------------------------ CREATE-CHAIN-FOR-EXECUTE-TRADE ------------------------------------

  // ------------------------------------ REMOVE SELECTED------------------------------------

  const remoeveService = (id) => {
    let test =
      ExecuteTradeData &&
      ExecuteTradeData.data.filter((item) => {
        const element1 = $(".button_call_sell_" + id);
        element1.removeClass("active");
        const element2 = $(".button_call_buy_" + id);
        element2.removeClass("active");
        const element4 = $(".button_put_sell_" + id);
        element4.removeClass("active");
        const element3 = $(".button_put_buy_" + id);
        element3.removeClass("active");

        return item.token !== id;
      });

    setExecuteTradeData({
      loading: false,
      data: test,
    });
  };

  const Cancel_Request = () => {
    setExecuteTradeData({
      loading: false,
      data: [],
    });

    setCreateSignalRequest([]);
    OptionChainData.data &&
      OptionChainData.data.filter((item) => {
        const element1 = $(".button_call_sell_" + item.call_token);
        element1.removeClass("active");
        const element2 = $(".button_call_buy_" + item.call_token);
        element2.removeClass("active");
        const element4 = $(".button_put_sell_" + item.put_token);
        element4.removeClass("active");
        const element3 = $(".button_put_buy_" + item.put_token);
        element3.removeClass("active");
      });

    setshowModal(false);
  };

  const Done_For_Trade = (id) => {
    handleClickDisabled();

    const currentTimestamp = Math.floor(Date.now() / 1000);

    ExecuteTradeData.data &&
      ExecuteTradeData.data.map((item) => {
        let price = $(".Call_Price_" + item.token).html();
        if (item.call_type.toUpperCase() == "PUT") {
          price = $(".Put_Price_" + item.token).html();
        }

        let req = `DTime:${currentTimestamp}|Symbol:${symbol && symbol}|TType:${
          item.trading_type
        }|Tr_Price:131|Price:${price}|Sq_Value:0.00|Sl_Value:0.00|TSL:0.00|Segment:${
          item.segment
        }|Strike:${item.strike}|OType:${item.call_type}|Expiry:${
          expiry && expiry
        }|Strategy:${strategy && strategy}|Quntity:${item.entry_qty}|Key:${
          PanelKey && PanelKey.client_key
        }|TradeType:OPTION_CHAIN|Demo:demo`;

        let config = {
          method: "post",
          maxBodyLength: Infinity,
          url: `${getBrokerUrl && getBrokerUrl}`,
          headers: {
            "Content-Type": "text/plain",
          },
          data: req,
        };

        axios
          .request(config)
          .then((response) => {
            if (response.data.status) {
              toast.success("Order Place Sucessfully");
              setRefresh(!refresh);
              setButtonDisabled(!ButtonDisabled);
              setshowModal(false);
              // setButtonDisabled(false)

              setCreateSignalRequest([]);

              OptionChainData.data &&
                OptionChainData.data.filter((item) => {
                  const element1 = $(".button_call_sell_" + item.call_token);
                  element1.removeClass("active");
                  const element2 = $(".button_call_buy_" + item.call_token);
                  element2.removeClass("active");
                  const element4 = $(".button_put_sell_" + item.put_token);
                  element4.removeClass("active");
                  const element3 = $(".button_put_buy_" + item.put_token);
                  element3.removeClass("active");
                });

              navigate("/admin/openposition");
            } else {
              toast.danger(response.data.msg);
            }
          })
          .catch((error) => {
            return;
          });
      });
  };

  // ------------------------------------ REMOVE SELECTED------------------------------------

  // --------------- FOR GET OPTIONS SYMBOLS -----------------------

  const symbols = async () => {
    await dispatch(Get_Option_Symbols({ req: "", token: token }))
      .unwrap()
      .then((response) => {
        if (response.status) {
          // SORT NIFTY BANKNIFTY FINNIFTY ON THE TOP
          let SortIndexWise = response.data.sort((a, b) => {
            return a.symbol === "NIFTY"
              ? -1
              : a.symbol === "BANKNIFTY"
              ? -1
              : a.symbol === "FINNIFTY"
              ? -1
              : a.symbol === "SENSEX"
              ? -1
              : 1;
          });

          set_All_Symbols({
            loading: false,
            data: SortIndexWise,
          });

          const filteredSelectedData = SortIndexWise.filter(
            (item) => item.token === "1"
          ).map((item) => item.symbol);

          setSelectedServices(filteredSelectedData);
          setTags(filteredSelectedData);
        }
      });
  };

  useEffect(() => {
    getPanelDetails();
    symbols();
    getPanelKey();
    GetAllStrategyName();

    const currentDateIST = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    });

    // Set the cutoff time to 3:30 PM in IST timezone
    const cutoffTimeIST = new Date();
    cutoffTimeIST.setHours(15, 30, 0, 0);

    // Check if the current time is after 3:30 PM in IST timezone
    const isAfterCutoffTime =
      new Date(currentDateIST).getTime() > cutoffTimeIST.getTime();
  }, []);

  useEffect(() => {
    GetExpiry();
  }, [symbol]);

  // --------------- FOR GET OPTIONS SYMBOLS -----------------------

  const GetExpiry = async (value) => {
    if (symbol) {
      await dispatch(Get_Option_Symbols_Expiry({ req: symbol, token: token }))
        .unwrap()
        .then((response) => {
          if (response.status) {
            set_All_Symbols_Expiry({
              loading: false,
              data: response.data,
            });
          }
        });
    }
  };

  // --------------- FOR GET OPTIONS SYMBOLS -----------------------

  const GetAllStrategyName = async (e) => {
    await dispatch(
      Get_All_Service_for_Client({
        req: {},
        token: token,
      })
    )
      .unwrap()
      .then((response) => {
        if (response.status) {
          setAllStrategyName({
            loading: false,
            data: response.data,
          });
        }
      });
  };

  // --------------- FOR GET PANEL KEY-----------------------

  const getPanelKey = async (e) => {
    await dispatch(
      Get_Panel_key({
        id: user_id,
        token: token,
      })
    )
      .unwrap()
      .then((response) => {
        if (response.status) {
          setPanelKey(response.data);
        }
      });
  };

  // --------------- FOR GET OPTIONS SYMBOLS -----------------------

  const getAllRoundToken = async () => {
    if (expiry) {
      const data = {
        expiry: expiry,
        symbol: symbol,
      };

      await dispatch(Get_Option_All_Round_token(data, token))
        .unwrap()
        .then((response) => {
          if (response.status) {
            var Middle =
              response.data.length > 0 && Math.floor(response.data.length / 2);

            setOptionChainData({
              loading: false,
              data: response.data,
              midd: Middle ? Middle : 0,
            });
            setTokenSymbolChain(response.channellist);
          }
        });
    }
  };

  useEffect(() => {
    getAllRoundToken();
  }, [expiry, refresh]);

  //  SHOW lIVE PRICE
  const ShowLivePrice = async () => {
    let type = { loginType: "API" };
    let channelList = TokenSymbolChain && TokenSymbolChain;

    if (
      UserDetails.user_id !== undefined &&
      UserDetails.access_token !== undefined &&
      UserDetails.trading_status == "on"
    ) {
      const res = await CreateSocketSession(
        type,
        UserDetails.user_id,
        UserDetails.access_token
      );

      if (res.data.stat) {
        const handleResponse = async (response) => {
   

          const old_val_call = $(".Call_Price_" + response.tk).html();
          const old_val_put = $(".Put_Price_" + response.tk).html();

          $(".SP1_Call_Price_" + response.tk).html(
            response.sp1 ? response.sp1 : response.lp
          );
          $(".BP1_Put_Price_" + response.tk).html(
            response.bp1 ? response.bp1 : response.lp
          );

          if (response.tk) {
            if (response.lp !== undefined) {
              $(".Call_Price_" + response.tk).html(response.lp);
              $(".Put_Price_" + response.tk).html(response.lp);

              const new_val_call = $(".Call_Price_" + response.tk).html();
              const new_val_put = $(".Put_Price_" + response.tk).html();

              if (new_val_call > old_val_call || new_val_put > old_val_put) {
                $(".Call_Price_" + response.tk).css({ color: "green" });
                $(".Put_Price_" + response.tk).css({ color: "green" });
                // $('.Call_Price_' + response.tk).append('&#8593;')
                // $('.Put_Price_' + response.tk).append('&#8593;')
                $(".Put_Price_" + response.tk).css({ "font-weight": "900" });
                $(".Call_Price_" + response.tk).css({ "font-weight": "900" });
              } else if (
                new_val_call < old_val_call ||
                new_val_put < old_val_put
              ) {
                $(".Call_Price_" + response.tk).css({ color: "red" });
                $(".Put_Price_" + response.tk).css({ color: "red" });
                // $('.Call_Price_' + response.tk).append('&#8595;')
                // $('.Put_Price_' + response.tk).append('&#8595;')
                $(".Put_Price_" + response.tk).css({ "font-weight": "900" });
                $(".Call_Price_" + response.tk).css({ "font-weight": "900" });
              } else if (
                new_val_call === old_val_call ||
                new_val_put === old_val_put
              ) {
                $(".Call_Price_" + response.tk).css({ color: "black" });
                $(".Put_Price_" + response.tk).css({ color: "black" });
              }
            }
          }
        };
        await ConnctSocket(
          handleResponse,
          channelList,
          UserDetails.user_id,
          UserDetails.access_token
        ).then((res) => {});
      }
    }
  };

  useEffect(() => {
    ShowLivePrice();
  }, [UserDetails, TokenSymbolChain, showModal]);

  //  GET_USER_DETAILS
  const UserBrokerDetails = async () => {
    const response = await GetAccessToken({ broker_name: "aliceblue" });

    if (response.status) {
      setUserDetails(response.data[0]);
    }
  };
  useEffect(() => {
    UserBrokerDetails();
  }, []);

  const test = (e) => {
    if (e.target.value !== "") {
      strategyRef.current = e.target.value;
    } else {
      strategyRef.current = "";
    }
  };

  //  For Manage Filter Symboll
  const filterFunction = async () => {
    // alert("okk")
    const filteredData = All_Symbols.data.filter((item) => {
      return item.symbol.toLowerCase().includes(SerachService.toLowerCase());
    });

    if (SerachService === "") {
      setstate([]);
    } else {
      setstate(filteredData);
    }
  };

  useEffect(() => {
    filterFunction();
  }, [SerachService]);

  function handleServiceChange(event, symbol, item) {
    const isChecked = event.target.checked;

    const symbolValue = symbol;
    setSelectedServices((prevInfo) => {
      if (isChecked) {
        if (selectedServices.length >= 5) {
          alert("You can only select up to 5 stocks.");
          event.target.checked = false;
          setTags(tags1.filter((symb) => symb !== symbolValue));
          return prevInfo.filter((item) => item !== symbolValue);
        } else {
          setTags((oldArray) => [...oldArray, symbolValue]);
          return [...prevInfo, symbolValue];
        }
      } else {
        setTags(tags1.filter((symb) => symb !== symbolValue));
        return prevInfo.filter((item) => item !== symbolValue);
      }
    });
  }

  const SelectOptionStock = () => {
    setshowModalSelectOptionStock(true);
  };

  const Cancel_Request1 = () => {
    setshowModalSelectOptionStock(false);
  };

  const DoneSelectOptionTrade = async (value) => {
    if (selectedServices) {
      await dispatch(
        Option_Symbols_Update_status({ req: selectedServices, token: token })
      )
        .unwrap()
        .then((response) => {
          if (response.status) {
            toast.success(response.msg);
            setSerachService("");
            setRefresh(!refresh);
            setshowModalSelectOptionStock(false);
          } else {
            toast.error(response.msg);
            setSerachService("");
            setRefresh(!refresh);
          }
        });
    }
  };

  const DoneOptionStock = () => {
    DoneSelectOptionTrade();

  };

  const handleSymbolClickDelete = (e, symbol) => {
    $(".delete_stoch_" + symbol).prop("checked", false);
    setRefresh(!refresh);
    setTags(tags1.filter((symb) => symb !== symbol));
    setSelectedServices(selectedServices.filter((symb) => symb !== symbol));
  };

  return (
    <>
      {All_Symbols.loading ? (
        <Loader />
      ) : (
        <>
          <Theme_Content Page_title="Option Chain" button_status={false}>
            <div className="row d-flex">
              <div className="col-md-2 text-secondary">
                <label
                  className="text-secondary"
                  style={{ fontWeight: "bold", color: "black" }}
                >
                  SYMBOLS
                </label>
                <select
                  name="symbols_filter"
                  className="default-select wide form-control spacing"
                  onChange={(e) => {
                    setSymbol(e.target.value);
                    setSymbolStrike(
                      e.target.options[e.target.selectedIndex].getAttribute(
                        "name"
                      )
                    );
                    setStrategy("");
                    setExpiry("");
                    setOptionChainData({
                      loading: false,
                      data: [],
                      midd: 0,
                    });
                  }}
                >
                  <option value="">Select Stock Name</option>
                  {All_Symbols.data &&
                    All_Symbols.data.map((item) => {
                      return (
                        <option value={item.symbol} name={item.price}>
                          {item.symbol}
                        </option>
                      );
                    })}
                </select>
              </div>
              <div className="col-md-2 text-secondary">
                <label
                  className="text-secondary"
                  style={{ fontWeight: "bold", color: "black" }}
                >
                  EXPIRY DATE
                </label>
                <select
                  className="default-select wide form-control"
                  name="expiry_date"
                  onChange={(e) => {
                    setExpiry(e.target.value);
                  }}
                  value={expiry}
                >
                  <option value="">Select Expiry</option>
                  {All_Symbols_Expiry.data &&
                    All_Symbols_Expiry.data.map((item) => {
                      return (
                        <option value={item.uniqueExpiryValues}>
                          {get_thre_digit_month(item.expiryDate)}
                        </option>
                      );
                    })}
                </select>
              </div>
              <div className="col-md-2 ">
                <label
                  className="text-secondary"
                  style={{ fontWeight: "bold", color: "black" }}
                >
                  STRATEGY
                </label>
                <select
                  className="default-select wide form-control"
                  name="strategyname"
                  onChange={(e) => {
                    setStrategy(e.target.value);
                    test(e);
                  }}
                  value={strategy}

                  // disabled={CreateSignalRequest.length === 0}
                >
                  <option value="">Select Strategy</option>
                  {getAllStrategyName.data &&
                    getAllStrategyName.data.map((item) => {
                      return (
                        <option value={item.strategy_name}>
                          {item.strategy_name}
                        </option>
                      );
                    })}
                </select>
              </div>
              <div className="col-md-2 text-secondary">
                <label
                  className="text-secondary"
                  style={{ fontWeight: "bold", color: "black" }}
                >
                  Option Stock
                </label>
                <input
                  type="text"
                  readOnly
                  className="new-input-control form-control"
                  placeholder="Click to select"
                  onClick={SelectOptionStock}
                  style={{ cursor: "pointer", backgroundColor: "#f9f9f9" }}
                />
              </div>

              <div className="col-md-4 d-flex justify-content-end align-items-center text-secondary mt-4">
                <button
                  className="btn btn-primary me-2"
                  onClick={(e) => ExcuteTradeButton()}
                  disabled={CreateSignalRequest.length === 0}
                >
                  Execute Trade
                </button>
              </div>
            </div>

            <div className="option-chain mt-2">
              <FullDataTable
                TableColumns={columns}
                tableData={OptionChainData.data}
                pagination1={true}
              ></FullDataTable>
            </div>

            {showModal ? (
              <>
                <Modal
                  isOpen={showModal}
                  size="xl"
                  title="Request Confirmation"
                  cancel_btn={true}
                  hideCloseButton={true}
                  btn_name="Confirm"
                  Submit_Function={Done_For_Trade}
                  Submit_Cancel_Function={Cancel_Request}
                  handleClose={() => setshowModal(false)}
                >
                  <BasicDataTable
                    TableColumns={[
                      {
                        dataField: "index",
                        text: "SR. No.",
                        formatter: (cell, row, rowIndex) => rowIndex + 1,
                      },
                      {
                        dataField: "Symbol",
                        text: "Symbol",
                        headerClasses: "table-column-name",
                        classes: "table-column-name",
                      },

                      {
                        dataField: "price",
                        text: "Price",
                        formatter: (cell, row, rowIndex) => (
                          <div>
                            {row.type === "BUY" ? (
                              <span
                                className={`BP1_Put_Price_${row.token} `}
                              ></span>
                            ) : (
                              <span
                                className={`SP1_Call_Price_${row.token}`}
                              ></span>
                            )}
                          </div>
                        ),
                      },
                      {
                        dataField: "type",
                        text: "Trade Type",
                      },
                      {
                        dataField: "call_type",
                        text: "Call Type",
                      },
                      {
                        dataField: "strategy",
                        text: "Strategy",
                      },
                      {
                        dataField: "Remove",
                        text: "Remove",
                        formatter: (cell, row, rowIndex) => (
                          <Trash2
                            className="text-danger"
                            onClick={() => {
                              remoeveService(row.token);
                            }}
                          />
                        ),
                      },
                    ]}
                    tableData={ExecuteTradeData.data && ExecuteTradeData.data}
                  />
                </Modal>
              </>
            ) : (
              ""
            )}

            {showModalSelectOptionStock ? (
              <>
                <Modal
                  isOpen={showModalSelectOptionStock}
                  size="xl"
                  title="Option Stock"
                  cancel_btn={true}
                  hideCloseButton={true}
                  btn_name="Confirm"
                  Submit_Function={DoneOptionStock}
                  Submit_Cancel_Function={Cancel_Request1}
                  handleClose={() => setshowModalSelectOptionStock(false)}
                >
                  <div className="card-body d-flex ">
                    {tags1.length == 0 ? (
                      ""
                    ) : (
                      <>
                        {tags1.map((symbol, i) => (
                          <React.Fragment key={i}>
                            <div className="mx-3 d-flex justify-content-center">
                              <h6>{symbol}</h6>
                              <span
                                onClick={(e) =>
                                  handleSymbolClickDelete(e, symbol)
                                }
                              >
                                <X />
                              </span>
                            </div>
                          </React.Fragment>
                        ))}
                      </>
                    )}
                  </div>
                  <div className="col-md-11 px-2 ms-2 ">
                    <input
                      type="test"
                      className="form-control"
                      placeholder="Search ..."
                      onChange={(e) => {
                        setSerachService(e.target.value);
                      }}
                      value={SerachService}
                    />
                  </div>
                  <div className="row ">
                    {state.length > 0
                      ? state.map((service) =>
                          service.symbol == "BANKNIFTY" ||
                          service.symbol == "NIFTY" ||
                          service.symbol == "FINNIFTY" ? (
                            ""
                          ) : (
                            <div
                              key={service.symbol}
                              className=" col-lg-3 mb-2"
                            >
                              <div className="col-lg-6">
                                <div className="form-check">
                                  <input
                                    type="checkbox"
                                    className={`form-check-input delete_stoch_${service.symbol}`}
                                    id={`service-${service.symbol}`}
                                    value={service.symbol}
                                    checked={selectedServices.includes(
                                      service.symbol
                                    )}
                                    onChange={(e) =>
                                      handleServiceChange(
                                        e,
                                        service.symbol,
                                        service
                                      )
                                    }
                                  />

                                  <label
                                    className="form-check-label"
                                    htmlFor={`service-${service.symbol}`}
                                  >
                                    {service.symbol}
                                  </label>
                                </div>
                              </div>
                            </div>
                          )
                        )
                      : All_Symbols.data.map((service) =>
                          service.symbol == "BANKNIFTY" ||
                          service.symbol == "NIFTY" ||
                          service.symbol == "FINNIFTY" ? (
                            ""
                          ) : (
                            <div
                              key={service.symbol}
                              className=" col-lg-3 mb-2"
                            >
                              <div className="col-lg-6">
                                <div className="form-check">
                                  <input
                                    type="checkbox"
                                    className={`form-check-input delete_stoch_${service.symbol}`}
                                    id={`service-${service.symbol}`}
                                    value={service.symbol}
                                    checked={selectedServices.includes(
                                      service.symbol
                                    )}
                                    onChange={(e) =>
                                      handleServiceChange(
                                        e,
                                        service.symbol,
                                        service
                                      )
                                    }
                                  />

                                  <label
                                    className="form-check-label"
                                    htmlFor={`service-${service.symbol}`}
                                  >
                                    {service.symbol}
                                  </label>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                  </div>
                </Modal>
              </>
            ) : (
              ""
            )}
          </Theme_Content>
        </>
      )}

      <ToastButton />
    </>
  );
};

export default HelpCenter;

export const sneh = (OptionChainData) => {
  OptionChainData &&
    OptionChainData.filter((item) => {
      const element1 = $(".button_call_sell_" + item.call_token);
      element1.removeClass("active");
      const element2 = $(".button_call_buy_" + item.call_token);
      element2.removeClass("active");
      const element4 = $(".button_put_sell_" + item.put_token);
      element4.removeClass("active");
      const element3 = $(".button_put_buy_" + item.put_token);
      element3.removeClass("active");
    });
};
