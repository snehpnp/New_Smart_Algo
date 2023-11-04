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
import { CreateSocketSession, ConnctSocket, GetAccessToken } from "../../../../Service/Alice_Socket";
import { ShowColor, ShowColor1, ShowColor_Compare_two, } from "../../../../Utils/ShowTradeColor";
import { Get_All_Catagory, Service_By_Catagory } from '../../../../ReduxStore/Slice/Admin/AdminSlice'
import { Get_All_Service } from "../../../../ReduxStore/Slice/Admin/AdminSlice";
import { today } from "../../../../Utils/Date_formet";

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

  const [originalData, setOriginalData] = useState([]);



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
  const [ServiceData, setServiceData] = useState({ loading: true, data: [] });



  const [CatagoryData, setCatagoryData] = useState({
    loading: true,
    data: []
  });



  const [UserDetails, setUserDetails] = useState([]);
  const [StrategyClientStatus, setStrategyClientStatus] = useState("null");
  const [SelectSegment, setSelectSegment] = useState("null");
  const [SelectService, setSelectService] = useState("null");


  const [SocketState, setSocketState] = useState("null");

  const [ForGetCSV, setForGetCSV] = useState([])


  // const GetTradhistory = async (e) => {
  //   let startDate = getActualDateFormate(fromDate);
  //   let endDate = getActualDateFormate(toDate);


  //   let current_day = today();


  //   e.preventDefault();

  //   await dispatch(
  //     Get_Tradehisotry({ startDate: startDate, endDate: endDate, service: SelectService, strategy: StrategyClientStatus, token: token })
  //   )
  //     .unwrap()
  //     // await dispatch(Get_Tradehisotry({ startDate: "2023/9/1", endDate: "2023/9/28", token: token })).unwrap()
  //     .then((response) => {
  //       if (response.status) {
  //         setTradeHistoryData({
  //           loading: false,
  //           data: response.data,
  //         });
  //         setOriginalData(response.data);

  //       }
  //     });
  //   // }
  // };



  const getsignals11 = async (e) => {
    let abc = new Date();
    let month = abc.getMonth() + 1;
    let date = abc.getDate();
    let year = abc.getFullYear();
    let full = `${year}/${month}/${date}`;


    let startDate = getActualDateFormate(fromDate);
    let endDate = getActualDateFormate(toDate);


    await dispatch(
      // Get_Tradehisotry({ startDate: "2023/10/01", endDate: "2023/10/25", service: "null", strategy: 'null', token: token })
      Get_Tradehisotry({ startDate: !fromDate ? full : startDate, endDate: !toDate ? fromDate ? "" : full : endDate, service: SelectService, strategy: StrategyClientStatus, token: token })
      // Get_Tradehisotry({ startDate: full, endDate: full, token: token })
    ).unwrap()
      .then((response) => {
        if (response.status) {
          setTradeHistoryData({
            loading: false,
            data: response.data,
          });
          setOriginalData(response.data);
          setTradeHistoryData1({
            loading: false,
            data: response.data,
          });
        }
      });
  };

  useEffect(() => {
    getsignals11();
  }, [refresh, SocketState, fromDate, toDate, SelectService, StrategyClientStatus]);

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
    setStrategyClientStatus("");
    setSelectService("");
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
      formatter: (cell) => <>{fDateTimeSuffix(cell)}</>,
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
        return (
          <div>
            <span className={`fw-bold show_rpl_${row.token}_${row._id}`}></span>
            <span className={`d-none entry_qty_${row.token}_${row._id}`}>
              {row.entry_qty_percent}
            </span>
            <span className={`d-none exit_qty_${row.token}_${row._id}`}>
              {row.exit_qty_percent}
            </span>
            <span className={`d-none exit_price_${row.token}_${row._id}`}>
              {row.exit_price}
            </span>
            <span className={`d-none entry_price_${row.token}_${row._id}`}>
              {row.entry_price}
            </span>
            <span className={`d-none entry_type_${row.token}_${row._id}`}>
              {row.entry_type}
            </span>
            <span className={`d-none exit_type_${row.token}_${row._id}`}>
              {row.exit_type}
            </span>
            <span className={`d-none strategy_${row.token}_${row._id}`}>
              {row.strategy}
            </span>
            <span className={`d-none _id_${row.token}_${row._id}`}>
              {row._id}
            </span>
          </div>
        );
      },
    },


    {
      dataField: "UPL",
      text: "U/P&l",
      formatter: (cell, row, rowIndex) => (
        <div>
          <span className={`fw-bold UPL_${row.token}_${row._id}`}></span>


        </div>
      ),
    },

    {
      dataField: "TPL",
      text: "T/P&L",
      formatter: (cell, row, rowIndex) => (
        <div>
          <span className={`fw-bold  TPL_${row.token}_${row._id}`}></span>
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

    if (UserDetails.user_id !== undefined && UserDetails.access_token !== undefined) {


      const res = await CreateSocketSession(type, UserDetails.user_id, UserDetails.access_token);

      if (res.status === 200) {
        setSocketState("Ok");
      }
      if (res.status === 401 || res.status === '401') {
        setSocketState("Unauthorized");

        tradeHistoryData.data && tradeHistoryData.data.forEach((row, i) => {
          const previousRow = i > 0 ? tradeHistoryData.data[i - 1] : null;
          calcultateRPL(row, null, previousRow);
        });
      }
      else {
        if (res.data.stat) {
          const handleResponse = async (response) => {

            // UPL_
            $(".LivePrice_" + response.tk).html(response.lp);
            $(".ClosePrice_" + response.tk).html(response.c);


            var live_price = response.lp === undefined ? "" : response.lp;

            //  if entry qty and exist qty both exist
            tradeHistoryData.data && tradeHistoryData.data.forEach((row, i) => {
              let get_ids = '_id_' + response.tk + '_' + row._id
              let get_id_token = $('.' + get_ids).html();

              const get_entry_qty = $(".entry_qty_" + response.tk + '_' + row._id).html();
              const get_exit_qty = $(".exit_qty_" + response.tk + '_' + row._id).html();
              const get_exit_price = $(".exit_price_" + response.tk + '_' + row._id).html();
              const get_entry_price = $(".entry_price_" + response.tk + '_' + row._id).html();
              const get_entry_type = $(".entry_type_" + response.tk + '_' + row._id).html();
              const get_exit_type = $(".exit_type_" + response.tk + '_' + row._id).html();
              const get_Strategy = $(".strategy_" + response.tk + '_' + row._id).html();

              if ((get_entry_type === "LE" && get_exit_type === "LX") || (get_entry_type === "SE" && get_exit_type === "SX")) {
                if (get_entry_qty !== "" && get_exit_qty !== "") {

                  if (parseInt(get_entry_qty) >= parseInt(get_exit_qty)) {
                    let rpl = (parseInt(get_exit_price) - parseInt(get_entry_price)) * parseInt(get_exit_qty);
                    let upl = parseInt(get_exit_qty) - parseInt(get_entry_qty);
                    let finalyupl = (parseFloat(get_entry_price) - parseFloat(live_price)) * upl;

                    if ((isNaN(finalyupl) || isNaN(rpl))) {
                      return "-";
                    } else {
                      $(".show_rpl_" + response.tk + "_" + get_id_token).html(rpl.toFixed(2));
                      $(".UPL_" + response.tk + "_" + get_id_token).html(finalyupl.toFixed(2));
                      $(".TPL_" + response.tk + "_" + get_id_token).html((finalyupl + rpl).toFixed(2));

                      ShowColor1(".show_rpl_" + response.tk + "_" + get_id_token, rpl.toFixed(2), response.tk, get_id_token);
                      ShowColor1(".UPL_" + response.tk + "_" + get_id_token, finalyupl.toFixed(2), response.tk, get_id_token);
                      ShowColor1(".TPL_" + response.tk + "_" + get_id_token, (finalyupl + rpl).toFixed(2), response.tk, get_id_token);
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
                  $(".show_rpl_" + response.tk + "_" + get_id_token).html(abc);
                  $(".UPL_" + response.tk + "_" + get_id_token).html("-");
                  $(".TPL_" + response.tk + "_" + get_id_token).html(abc);
                  ShowColor1(".show_rpl_" + response.tk + "_" + get_id_token, abc, response.tk, get_id_token);
                  ShowColor1(".UPL_" + response.tk + "_" + get_id_token, "-", response.tk, get_id_token);
                  ShowColor1(".TPL_" + response.tk + "_" + get_id_token, abc, response.tk, get_id_token);
                }

              }

              //  if Only Exist qty Exist
              else if (
                (get_entry_type === "" && get_exit_type === "LX") ||
                (get_entry_type === "" && get_exit_type === "SX")
              ) {
              } else {
              }


            });





            // }
          };
          await ConnctSocket(handleResponse, channelList, UserDetails.user_id, UserDetails.access_token).then((res) => { });
        } else {
          // $(".UPL_").html("-");
          // $(".show_rpl_").html("-");
          // $(".TPL_").html("-");
        }
      }
    }





  };


  const calcultateRPL = (row, livePrice, pre_row) => {

    let get_ids = '_id_' + row.token + '_' + row._id
    let get_id_token = $('.' + get_ids).html();


    if (row.entry_type !== '' && row.exit_type !== '') {
      if ((row.entry_type === "LE" || row.entry_type === "SE")) {

        const entryQty = parseInt(row.entry_qty_percent);
        const exitQty = parseInt(row.exit_qty_percent);
        const entryPrice = parseFloat(row.entry_price);
        const exitPrice = parseFloat(row.exit_price);
        const rpl = (exitPrice - entryPrice) * Math.min(entryQty, exitQty);


        $(".show_rpl_" + row.token + "_" + get_id_token).html(rpl.toFixed(2));
        $(".UPL_" + row.token + "_" + get_id_token).html("-");
        $(".TPL_" + row.token + "_" + get_id_token).html(rpl.toFixed(2));

        ShowColor1(".show_rpl_" + row.token + "_" + get_id_token, rpl.toFixed(2), row.token, get_id_token);
        ShowColor1(".UPL_" + row.token + "_" + get_id_token, "-", row.token, get_id_token);

        ShowColor1(".TPL_" + row.token + "_" + get_id_token, rpl.toFixed(2), row.token, get_id_token);


      }

    }
    else if (row.entry_type && row.exit_type === "") {

      $(".show_rpl_" + row.token + "_" + row._id).html("-");
      $(".UPL_" + row.token + "_" + row._id).html("-");
      $(".TPL_" + row.token + "_" + row._id).html("-");
    }
    if (row.entry_type === "" && row.exit_type !== '') {
      $(".show_rpl_" + row.token + "_" + row._id).html("-");
      $(".UPL_" + row.token + "_" + row._id).html("-");
      $(".TPL_" + row.token + "_" + row._id).html("-");
    }
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
    const response = await GetAccessToken({ broker_name: "aliceblue" });

    if (response.status) {
      setUserDetails(response.data[0]);
    }

  };
  useEffect(() => {
    data();
  }, []);



  //  LOG IN FOR GET LIVE PRICE 
  const LogIn_WIth_Api = async (check, brokerid, tradingstatus, UserDetails) => {
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


  const forCSVdata = () => {

    let csvArr = []
    if (tradeHistoryData.data.length > 0) {
      tradeHistoryData.data.map((item) => {
        return csvArr.push({
          "symbol": item.trade_symbol,
          "EntryType": item.entry_type ? item.entry_type : "-",
          "ExitType": item.exit_type ? item.exit_type : "-",
          "Entry Price": item.entry_price,
          "Entry Qty": item.entry_qty_percent,
          "Exit Price": item.exit_price,
          "Exit Qty": item.exit_qty_percent,
          "Entry Time": item.entry_dt_date,
          "Exit Time": item.exit_dt_date,
          "Exchange": item.exchange,
          "Strategy": item.strategy,
          "Released-P/L": $(".show_rpl_" + item.token).html(),
          "Unreleased-P/L": $(".UPL_" + item.token),
          "Total-PL": $(".TPL_" + item.token),
        })
      })

      setForGetCSV(csvArr)
    }

  }

  useEffect(() => {
    forCSVdata()
  }, [tradeHistoryData.data])



  const getSymbols = async (e) => {
    await dispatch(Get_All_Service({})).unwrap()
      .then((response) => {
        if (response.status) {
          // console.log("response", response)
          setServiceData({
            loading: false,
            data: response.data,
          });
          setServiceData({
            loading: false,
            data: response.data,
          });
        }
      });
  };

  useEffect(() => {
    getSymbols();
  }, []);




  const getservice = async () => {
    await dispatch(Get_All_Catagory()).unwrap()
      .then((response) => {
        if (response.status) {
          setCatagoryData({
            loading: false,
            data: response.data
          });
        }
      })
  }
  useEffect(() => {
    getservice()
  }, [])


  // console.log("originalData", originalData)

  //  MANAGE MULTIFILTER

  // Existing code...
  useEffect(() => {
    // Multi-filtering logic
    if (SelectService !== "null" || StrategyClientStatus !== "null") {
      const filteredData = originalData.filter((item) => {
        const itemStrategy = item.strategy.toString().toLowerCase();
        const itemService = item.trade_symbol.toString().toLowerCase();
        const itemService1 = item.symbol.toString().toLowerCase();
        const isServiceMatch = SelectService === "null" || itemService.includes(SelectService.toLowerCase()) || itemService1.includes(SelectService.toLowerCase());

        const isStrategyMatch = StrategyClientStatus === "null" || itemStrategy === StrategyClientStatus.toLowerCase();
        return isStrategyMatch && isServiceMatch
      });
      console.log("filteredData", filteredData);
    }

  }, [SelectService, StrategyClientStatus, originalData]);



  return (
    <>
      <Content Page_title="Trade History" button_status={false}
        show_csv_button={true} csv_data={ForGetCSV} csv_title="TradeHistory"
      >
        <div className="row d-flex  align-items-center justify-content-start">
          <div className="col-lg-12 flex-column">
            <div className="headaer-title">
              <h5 className="font-w400 mb-0">Live Price</h5>
            </div> <div className="Api Login m-2">
              <label class="switch">
                <input
                  type="checkbox"
                  className="bg-primary"
                  defaultChecked={
                    UserDetails.trading_status === "on" ? true : false
                  }
                  onChange={(e) =>
                    LogIn_WIth_Api(
                      e.target.checked,
                      UserDetails.broker_id,
                      UserDetails.trading_status,
                      UserDetails
                    )
                  }
                />
                <span class="slider round"></span>
              </label>
            </div></div>
          <div className="col-lg-2 px-1">
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
          <div className="col-lg-2  px-1">
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
                min={fromDate}
              />
            </div>
          </div>
          <div className="col-lg-2 px-1">
            <div class="mb-3">
              <label for="select" class="form-label">
                Service
              </label>
              <select
                class="default-select wide form-control"
                aria-label="Default select example"
                id="select"
                onChange={(e) => setSelectService(e.target.value)}
                value={SelectService}
              >
                <option value="null" selected>All</option>
                {ServiceData.data &&
                  ServiceData.data.map((item) => {
                    return (
                      <option className="mt-1" value={item.fullname}>
                        {item.fullname}
                      </option>
                    );
                  })}
              </select>
            </div>
          </div>
          <div className="col-lg-2  px-1">
            <div class="mb-3">
              <label for="select" class="form-label">
                Strategy
              </label>
              <select
                class="default-select wide form-control"
                aria-label="Default select example"
                id="select"
                onChange={(e) => setStrategyClientStatus(e.target.value)}
                value={StrategyClientStatus}
              >
                <option value="null" selected >All</option>
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

          {/* <div className="col-lg-2 px-1">
            <div class="mb-3">
              <label for="select" class="form-label">
                Segment
              </label>
              <select
                class="default-select wide form-control"
                aria-label="Default select example"
                id="select"
                onChange={(e) => setSelectSegment(e.target.value)}
                value={SelectSegment}
              >
                <option value="null" disabled>All</option>
                {CatagoryData.data && CatagoryData.data.map((item) => {
                  return <>
                    <option value={item.segment}>{item.name}</option>
                  </>
                })}
              </select>
            </div>
          </div> */}

          <div className="col-lg-2 px-1 mt-2">
            {/* <button
              className="btn btn-primary me-2"
              onClick={(e) => GetTradhistory(e)}
            >
              Search
            </button> */}
            <button className="btn btn-primary" onClick={(e) => ResetDate(e)}>
              Reset
            </button>
          </div>
        </div>

        {tradeHistoryData.data && tradeHistoryData.data.length === 0 ? (
          <div className="table-responsive">
            <FullDataTable
              TableColumns={columns}
              tableData={tradeHistoryData.data}
              pagination1={true}
            />
          </div>
        ) : (
          <>
            <FullDataTable
              TableColumns={columns}
              tableData={tradeHistoryData.data}
              pagination1={true}

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
