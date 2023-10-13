/* eslint-disable use-isnan */
// import React from 'react'
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Content from "../../../../Components/Dashboard/Content/Content";
import FullDataTable from "../../../../Components/ExtraComponents/Datatable/FullDataTable";
import { Get_Tradehisotry } from "../../../../ReduxStore/Slice/Admin/TradehistorySlice";
import { useDispatch, useSelector } from "react-redux";
import { fa_time, fDateTimeSuffix } from "../../../../Utils/Date_formet";
import { Eye, CandlestickChart, Pencil } from "lucide-react";
import { loginWithApi } from "../../../../Components/Dashboard/Header/log_with_api";
import DetailsView from "./DetailsView";
import { User_Profile } from "../../../../ReduxStore/Slice/Common/commoSlice.js";
import { TRADING_OFF_USER } from "../../../../ReduxStore/Slice/Users/DashboardSlice";
import { Get_All_Service_for_Client } from "../../../../ReduxStore/Slice/Common/commoSlice";
import { check_Device } from "../../../../Utils/find_device";
import { CreateSocketSession, ConnctSocket, } from "../../../../Service/Alice_Socket";
import { ShowColor, ShowColor_Compare_two, } from "../../../../Utils/ShowTradeColor";

import $ from "jquery";

const TradeHistory = () => {
  const dispatch = useDispatch();

  const token = JSON.parse(localStorage.getItem("user_details")).token;
  const user_id = JSON.parse(localStorage.getItem("user_details")).user_id;



  const [showModal, setshowModal] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [CheckUser, setCheckUser] = useState(check_Device());
  const [refresh, setrefresh] = useState(false);



  const handleFromDateChange = (e) => {
    setFromDate(e.target.value);
  };

  const handleToDateChange = (e) => {
    setToDate(e.target.value);
  };

  const [rowData, setRowData] = useState({ loading: true, data: [], });
  const [getAllStrategyName, setAllStrategyName] = useState({ loading: true, data: [], });
  const [tradeHistoryData, setTradeHistoryData] = useState({ loading: true, data: [] });
  const [tradeHistoryData1, setTradeHistoryData1] = useState({ loading: true, data: [] });


  const [UserDetails, setUserDetails] = useState([]);
  const [StrategyClientStatus, setStrategyClientStatus] = useState("null");
  const [SocketState, setSocketState] = useState("null");



  const GetTradhistory = async (e) => {
    let startDate = getActualDateFormate(fromDate);
    let endDate = getActualDateFormate(toDate);

    // let endDate = "2023/9/27"
    // let startDate = "2023/9/1"

    e.preventDefault();

    await dispatch(
      Get_Tradehisotry({ startDate: startDate, endDate: endDate, token: token })
    )
      .unwrap()
      // await dispatch(Get_Tradehisotry({ startDate: "2023/9/1", endDate: "2023/9/28", token: token })).unwrap()
      .then((response) => {
        if (response.status) {
          setTradeHistoryData({
            loading: false,
            data: response.data,
          });
        }
      });
    // }
  };

  const getsignals11 = async (e) => {
    let abc = new Date();
    let month = abc.getMonth() + 1;
    let date = abc.getDate();
    let year = abc.getFullYear();
    let full = `${year}/${month}/${date}`;
    await dispatch(
      Get_Tradehisotry({ startDate: full, endDate: full, token: token })
    ).unwrap()
      .then((response) => {
        if (response.status) {
          setTradeHistoryData({
            loading: false,
            data: response.data,
          });
          setTradeHistoryData1({
            loading: false,
            data: response.data,
          });
        }
      });
  };

  useEffect(() => {
    getsignals11();
  }, [refresh, SocketState]);

  const getActualDateFormate = (date) => {
    const dateParts = date.split("-");
    const formattedDate = `${dateParts[0]}/${parseInt(
      dateParts[1],
      10
    )}/${parseInt(dateParts[2], 10)}`;
    return formattedDate;
  };

  const ResetDate = (e) => {
    e.preventDefault();
    setFromDate("");
    setToDate("");
    setTradeHistoryData({
      loading: false,
      data: tradeHistoryData1.data,
    });
  };



  const columns = [
    {
      dataField: "index",
      text: "S.No.",
      formatter: (cell, row, rowIndex) => rowIndex + 1,
    },
    {
      dataField: "live",
      text: "Live Price",
      formatter: (cell, row, rowIndex) => (
        <div>
          <span className={`LivePrice_${row.token}`}></span>
        </div>
      ),
    },
    {
      dataField: "closeprice",
      text: "Close Price",
      formatter: (cell, row, rowIndex) => (
        <div>
          <span className={`ClosePrice_${row.token}`}></span>
        </div>
      ),
    },
    {
      dataField: "createdAt",
      text: "Signals time",
      formatter: (cell, row, rowIndex) => <div>{fDateTimeSuffix(cell)}</div>,
    },
    {
      dataField: "trade_symbol",
      text: "Symbol",
    },
    {
      dataField: "entry_qty_percent",
      text: "Entry Qty",
      formatter: (cell, row, rowIndex) => (
        <span className="text">{cell !== "" ? parseInt(cell) : "-"}</span>
      ),
    },
    {
      dataField: "exit_qty_percent",
      text: "Exit Qty",
      formatter: (cell, row, rowIndex) => (
        <span className="text">{cell !== "" ? parseInt(cell) : "-"}</span>
      ),
    },
    {
      dataField: "entry_price",
      text: "Entry Price",
      formatter: (cell, row, rowIndex) => (
        <div>{cell !== "" ? parseFloat(cell).toFixed(2) : "-"}</div>
      ),
    },
    {
      dataField: "exit_price",
      text: "Exit Price",
      formatter: (cell, row, rowIndex) => (
        <div>{cell !== "" ? parseFloat(cell).toFixed(2) : "-"}</div>
      ),
    },
    {
      dataField: "Action",
      text: "R/P&L",
      formatter: (cell, row, rowIndex) => {

        // if (SocketState !== 'null' && SocketState === "Unauthorized") {
        // return (
        //   <div>
        //     {
        //       <span className={`fw-bold `}>
        //         {/* test */}
        //       </span>
        //     }

        //   </div>
        // )
        // }
        // else {



        return (
          <div>
            {/* {calcultateRPL(row, parseFloat($(".LivePrice_" + row.token).html()))} */}

            <span className={`fw-bold show_rpl_${row.token}`}></span>
            {/* <span className={`fw-bold show_rpl_${row.token}`}>{showRPL}</span> */}
            <span className={`d-none entry_qty${row.token}`}>
              {row.entry_qty_percent}
            </span>
            <span className={`d-none exit_qty${row.token}`}>
              {row.exit_qty_percent}
            </span>
            <span className={`d-none exit_price${row.token}`}>
              {row.exit_price}
            </span>
            <span className={`d-none entry_price${row.token}`}>
              {row.entry_price}
            </span>
            <span className={`d-none entry_type${row.token}`}>
              {row.entry_type}
            </span>
            <span className={`d-none exit_type${row.token}`}>
              {row.exit_type}
            </span>
          </div>
        );
        // }

        //   let showRPL = row[`show_rpl_${row.token}`];

        //   if (!showRPL || showRPL === "-") {
        //     // Call the test function when show_rpl_${row.token} is empty or "-"
        //     showRPL = test(row);
        //   }


      },
    },


    {
      dataField: "UPL",
      text: "U/P&l",
      formatter: (cell, row, rowIndex) => (
        <div>
          {
            // SocketState && SocketState === "Unauthorized" ?
            //   <span className={`fw-bold show_rpl_${row.token}`}>
            //     {/* {calcultateRPL(row, parseFloat($(".LivePrice_" + row.token).html()))} */}
            //   </span>
            // :
            <span className={`fw-bold UPL_${row.token}`}></span>
          }


        </div>
      ),
    },

    {
      dataField: "TPL",
      text: "T/P&L",
      formatter: (cell, row, rowIndex) => (
        <div>
          {
            // SocketState && SocketState === "Unauthorized" ? <span className={`fw-bold show_rpl_${row.token}`}>
            //   {/* {calcultateRPL(row, parseFloat($(".LivePrice_" + row.token).html()))} */}
            // </span> : 
            <span className={`fw-bold  TPL_${row.token}`}></span>
          }

        </div>
      ),
    },
    {
      dataField: "strategy",
      text: "Strategy",
    },

    {
      dataField: "",
      text: "Details View",
      formatter: (cell, row, rowIndex) => (
        <div>
          <Eye
            className="mx-2"
            onClick={() => {
              setRowData(row);
              setshowModal(true);
            }}
          />
        </div>
      ),
    },
  ];

  var CreatechannelList = "";
  tradeHistoryData.data &&
    tradeHistoryData.data?.map((item) => {
      CreatechannelList += `${item.exchange}|${item.token}#`;
    });



  //  SHOW lIVE PRICE

  const ShowLivePrice = async () => {
    let type = { loginType: "API" };
    let channelList = CreatechannelList;

    // const res = await CreateSocketSession(type);

    if (UserDetails.demat_userid !== undefined && UserDetails.access_token !== undefined) {


      const res = await CreateSocketSession(type, UserDetails.demat_userid, UserDetails.access_token);

      console.log("res", res.status)
      if (res.status === 200) {
        setSocketState("Ok");
      }
      if (res.status === 401) {
        setSocketState("Unauthorized");

        tradeHistoryData.data.forEach((row) => {
          calcultateRPL(row, null);
        });
      }
      else {
        if (res.data.stat) {
          const handleResponse = (response) => {

            // UPL_
            $(".LivePrice_" + response.tk).html(response.lp);
            $(".ClosePrice_" + response.tk).html(response.c);


            var live_price = response.lp === undefined ? "" : response.lp;

            // if (response.lp !== undefined) {
            // $(".LivePrice_" + response.tk).html(response.lp === undefined ? response.c : response.lp);
            const get_Live_price = $(".ShowLTP_" + response.tk).html();
            const get_entry_qty = $(".entry_qty" + response.tk).html();
            const get_exit_qty = $(".exit_qty" + response.tk).html();
            const get_exit_price = $(".exit_price" + response.tk).html();
            const get_entry_price = $(".entry_price" + response.tk).html();
            const get_entry_type = $(".entry_type" + response.tk).html();
            const get_exit_type = $(".exit_type" + response.tk).html();
            const get_UPL_ = $(".UPL_" + response.tk).html();

            //  if entry qty and exist qty both exist
            if ((get_entry_type === "LE" && get_exit_type === "LX") || (get_entry_type === "SE" && get_exit_type === "SX")) {
              if (get_entry_qty !== "" && get_exit_qty !== "") {
                if (parseInt(get_entry_qty) >= parseInt(get_exit_qty)) {
                  let rpl =
                    (parseInt(get_exit_price) - parseInt(get_entry_price)) *
                    parseInt(get_exit_qty);
                  let upl = parseInt(get_exit_qty) - parseInt(get_entry_qty);

                  let finalyupl = (parseFloat(get_entry_price) - parseFloat(live_price)) * upl;

                  if ((isNaN(finalyupl) || isNaN(rpl))) {
                    return "-";
                  } else {
                    $(".show_rpl_" + response.tk).html(rpl.toFixed(2));
                    $(".UPL_" + response.tk).html(finalyupl.toFixed(2));
                    $(".TPL_" + response.tk).html((finalyupl + rpl).toFixed(2));

                    ShowColor("UPL_", finalyupl.toFixed(2), response.tk);
                    ShowColor("show_rpl_", rpl.toFixed(2), response.tk);
                    ShowColor("TPL_", (finalyupl + rpl).toFixed(2), response.tk);
                  }
                }
              }
            }
            //  if Only entry qty Exist
            else if ((get_entry_type === "LE" && get_exit_type === "") || (get_entry_type === "SE" && get_exit_type === "")) {
              let abc = ((parseFloat(live_price) - parseFloat(get_entry_price)) * parseInt(get_entry_qty)).toFixed();
              if (isNaN(abc)) {
                return "-";
              } else {
                $(".UPL_" + response.tk).html(abc);
                $(".show_rpl_" + response.tk).html("-");
                $(".TPL_" + response.tk).html(abc);

                ShowColor("UPL_", abc, response.tk);
                ShowColor("show_rpl_", "-", response.tk);
                ShowColor("TPL_", abc, response.tk);
              }
            }

            //  if Only Exist qty Exist
            else if (
              (get_entry_type === "" && get_exit_type === "LX") ||
              (get_entry_type === "" && get_exit_type === "SX")
            ) {


              // let abc = ((parseFloat(live_price) - parseFloat(get_exit_price)) * parseInt(get_exit_qty)).toFixed();
              // if (abc === "NaN") {
              //   return "-";
              // } else {
              //   $(".UPL_" + response.tk).html(abc);
              //   $(".show_rpl_" + response.tk).html("-");
              //   $(".TPL_" + response.tk).html("-");

              //   ShowColor("UPL_", abc, response.tk);
              //   ShowColor("show_rpl_", "-", response.tk);
              //   ShowColor("TPL_", "-", response.tk);
              // }



            } else {


            }
            // }
          };
          await ConnctSocket(handleResponse, channelList, UserDetails.demat_userid, UserDetails.access_token).then((res) => { });
        } else {
          $(".UPL_").html("-");
          $(".show_rpl_").html("-");
          $(".TPL_").html("-");
        }
      }
    }





  };


  const calcultateRPL = (row, livePrice) => {

    if (row.entry_type !== '' && row.exit_type !== '') {
      if (row.entry_type === "LE" || row.entry_type === "SE") {
        const entryQty = parseInt(row.entry_qty_percent);
        const exitQty = parseInt(row.exit_qty_percent);
        const entryPrice = parseFloat(row.entry_price);
        const exitPrice = parseFloat(row.exit_price);

        const rpl = (exitPrice - entryPrice) * Math.min(entryQty, exitQty);

        $(".show_rpl_" + row.token).html(rpl.toFixed(2));
        $(".TPL_" + row.token).html(rpl.toFixed(2));
        $(".UPL_" + row.token).html("-");

        // return rpl.toFixed(2);
        // }
        // else if (entryQty > exitQty) {
        //   let rpl = (parseInt(entryPrice) - parseInt(entryPrice)) * parseInt(exitQty);

        //   $(".show_rpl_" + row.token).html(rpl.toFixed(2));
        //   $(".TPL_" + row.token).html(rpl.toFixed(2));
        // }
        // else {

        //   $(".TPL_" + row.token).html('-');
        //   $(".UPL_" + row.token).html('-');
        // }
      }

    }
    else if (row.entry_type && row.exit_type === "") {
      $(".show_rpl_" + row.token).html('-');
      $(".TPL_" + row.token).html('-');
      $(".UPL_" + row.token).html("-");


    }
    if (row.entry_type === "" && row.exit_type !== '') {

      $(".show_rpl_" + row.token).html('-');
      $(".TPL_" + row.token).html('-');
      $(".UPL_" + row.token).html("-");
    }



    // if (row.entry_type === "LE" || row.entry_type === "SE") {
    //   if (row.exit_price && row.entry_price !== "") {

    //   } else if (row.entry_price && !row.exit_price && livePrice) {
    //     const entryQty = parseInt(row.entry_qty_percent);
    //     const entryPrice = parseFloat(row.entry_price);

    //     const upl = (livePrice - entryPrice) * entryQty;

    //     return upl.toFixed(2);
    //   }
    // }
    // if ((row.entry_type === "LE" || row.entry_type === "SE") && (row.exit_type === "LE" || row.exit_type === "SE")) {

    //   const entryQty = parseInt(row.entry_qty_percent);
    //   const exitQty = parseInt(row.exit_qty_percent);
    //   const entryPrice = parseFloat(row.entry_price);
    //   const exitPrice = parseFloat(row.exit_price);

    //   const rpl = (exitPrice - entryPrice) * Math.min(entryQty, exitQty);

    //   $(".show_rpl_" + row.token).html(rpl.toFixed(2));
    //   $(".TPL_" + row.token).html(rpl.toFixed(2));

    //   // console.log("rpl", rpl)
    //   return rpl.toFixed(2);
    // }


    // return "-";
  };










  useEffect(() => {
    ShowLivePrice();
  }, [tradeHistoryData.data, SocketState, UserDetails]);

  //  GET ALL SERVICE NAME

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

  useEffect(() => {
    GetAllStrategyName();
  }, []);







  //  GET_USER_DETAILS
  const data = async () => {
    await dispatch(User_Profile({ id: user_id }))
      .unwrap()
      .then((response) => {
        if (response.status) {
          setUserDetails(response.data);
        }
      });
  };
  useEffect(() => {
    data();
  }, []);



  //  LOG IN FOR GET LIVE PRICE 

  const LogIn_WIth_Api = (check, brokerid, tradingstatus, UserDetails) => {
    if (check) {
      loginWithApi(brokerid, UserDetails);
    } else {
      dispatch(TRADING_OFF_USER({ user_id: user_id, device: CheckUser, token: token }))
        .unwrap()
        .then((response) => {
          if (response.status) {
            // setUserDetails(response.data);
            setrefresh(!refresh)
          }
        });

    }
  };




  return (
    <>
      <Content Page_title="Trade History" button_status={false}
        show_csv_button={true} csv_data={[]} csv_title="TradeHistory"

      >
        <div className="row d-flex  align-items-center justify-content-start">

          <div className="col-lg-2">
            <div className="headaer-title">
              <h3 className="font-w400 mb-0">Live Price</h3>
            </div> <div className="Api Login m-2">
              <label class="switch">
                <input
                  type="checkbox"
                  className="bg-primary"
                  checked={
                    UserDetails.TradingStatus === "on" ? true : false
                  }
                  onClick={(e) =>
                    LogIn_WIth_Api(
                      e.target.checked,
                      UserDetails.broker,
                      UserDetails.TradingStatus,
                      UserDetails
                    )
                  }
                />
                <span class="slider round"></span>
              </label>
            </div></div>
          <div className="col-lg-2">
            <div className="form-check custom-checkbox mb-3 ps-0">
              <label className="col-lg-12" htmlFor="fromdate">
                From Date
              </label>
              <input
                type="date"
                name="fromdate"
                className="form-control"
                id="fromdate"
                value={fromDate}
                onChange={handleFromDateChange}
              // min={new Date().toISOString().split('T')[0]} // Disable past dates
              // disabled={disableFromDate}
              />
            </div>
          </div>
          <div className="col-lg-2">
            <div className="form-check custom-checkbox mb-3 ps-0">
              <label className="col-lg-12" htmlFor="endDate">
                To Date
              </label>
              <input
                type="date"
                name="endDate"
                className="form-control"
                id="endDate"
                value={toDate}
                onChange={handleToDateChange}
                min={
                  fromDate
                }
              />
            </div>
          </div>
          <div className="col-lg-2 ">
            <div class="mb-3">
              <label for="select" class="form-label">
                Strategy Clients
              </label>
              <select
                class="default-select wide form-control"
                aria-label="Default select example"
                id="select"
                onChange={(e) => setStrategyClientStatus(e.target.value)}
                value={StrategyClientStatus}
              >
                <option value="null">All</option>
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
          </div>
          <div className="col-lg-4">
            <button
              className="btn btn-primary me-2"
              onClick={(e) => GetTradhistory(e)}
            >
              Search
            </button>
            <button className="btn btn-primary" onClick={(e) => ResetDate(e)}>
              Reset
            </button>
          </div>
        </div>

        {tradeHistoryData.data && tradeHistoryData.data.length === 0 ? (
          <FullDataTable
            TableColumns={columns}
            tableData={tradeHistoryData.data}
          />
        ) : (
          <>
            <FullDataTable
              TableColumns={columns}
              tableData={tradeHistoryData.data}
            />
          </>
        )}

        {/*  For Detailed View  */}
        <DetailsView
          showModal={showModal}
          setshowModal={() => setshowModal(false)}
          tradeHistoryData={rowData}
        />
      </Content>
    </>
  );
};

export default TradeHistory;
