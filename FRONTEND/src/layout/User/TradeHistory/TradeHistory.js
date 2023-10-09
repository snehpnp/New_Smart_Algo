// import React from 'react'
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Content from "../../../Components/Dashboard/Content/Content";
import FullDataTable from "../../../Components/ExtraComponents/Datatable/FullDataTable";
import { Get_Tradehisotry } from "../../../ReduxStore/Slice/Users/TradehistorySlice";
import { useDispatch, useSelector } from "react-redux";
import { fa_time, fDateTimeSuffix } from "../../../Utils/Date_formet";
import { Eye, CandlestickChart, Pencil } from "lucide-react";
import DetailsView from "./DetailsView";
import {
  GetAliceTokenAndID,
  CreateSocketSession,
  ConnctSocket,
} from "../../../Service/Alice_Socket";
import {
  ShowColor,
  ShowColor_Compare_two,
} from "../../../Utils/ShowTradeColor";
import $ from "jquery";


const TradeHistory = () => {
  const dispatch = useDispatch();

  const token = JSON.parse(localStorage.getItem("user_details")).token;
  const user_id = JSON.parse(localStorage.getItem("user_details")).user_id;
  const gotodashboard = JSON.parse(localStorage.getItem("gotodashboard"));
  const gotodashboard_Details = JSON.parse(localStorage.getItem('user_details_goTo'))

  const [showModal, setshowModal] = useState(false);
  const [SocketState, setSocketState] = useState("null");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [disableFromDate, setDisableFromDate] = useState(false);


  const [rowData, setRowData] = useState({
    loading: true,
    data: [],
  });

  const handleFromDateChange = (e) => {
    setFromDate(e.target.value);
  };

  const handleToDateChange = (e) => {
    setToDate(e.target.value);

    setDisableFromDate(true);
  };

  const [tradeHistoryData, setTradeHistoryData] = useState({
    loading: true,
    data: [],
  });

  const [tradeHistoryData1, setTradeHistoryData1] = useState({
    loading: true,
    data: [],
  });

  const getsignals = async (e) => {
    let startDate = getActualDateFormate(fromDate);
    let endDate = getActualDateFormate(toDate);
    e.preventDefault();

    await dispatch(
      Get_Tradehisotry({
        user_id: gotodashboard ? gotodashboard_Details.user_id : user_id,
        startDate: startDate,
        endDate: endDate,
        token: token,
      })
    )
      .unwrap()
      .then((response) => {
        if (response.status) {
          setTradeHistoryData({
            loading: false,
            data: response.data,
          });
        } else {
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
      Get_Tradehisotry({
        user_id: gotodashboard ? gotodashboard_Details.user_id : user_id,
        startDate: full,
        endDate: full,
        token: token,
      })
    )
      .unwrap()
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
  }, []);

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

  const calcultateRPL = (row, livePrice) => {
    let profitLoss = null;

    if (row.entry_type === "LE" || row.entry_type === "SE") {
      if (row.exit_price && row.entry_price !== "") {
        const entryQty = parseInt(row.entry_qty_percent);
        const exitQty = parseInt(row.exit_qty_percent);
        const entryPrice = parseFloat(row.entry_price);
        const exitPrice = parseFloat(row.exit_price);

        const rpl = (exitPrice - entryPrice) * Math.min(entryQty, exitQty);
        return rpl.toFixed(2);
      } else if (row.entry_price && !row.exit_price && livePrice) {
        const entryQty = parseInt(row.entry_qty_percent);
        const entryPrice = parseFloat(row.entry_price);

        const upl = (livePrice - entryPrice) * entryQty;

        return upl.toFixed(2);
      }
    }

    return "-";
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
      dataField: "",
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
        if (SocketState === "null") {
          let showRPL = row[`show_rpl_${row.token}`];
          if (!showRPL || showRPL === "-") {
            showRPL = calcultateRPL(row, parseFloat($(".LivePrice_" + row.token).html()),
            );
          }

          return (
            <div>
              <span className={`fw-bold show_rpl_${row.token}`}>{showRPL}</span>

            </div>
          );
        } else {
          if (
            parseInt(row.entry_qty_percent) === parseInt(row.exit_qty_percent)
          ) {
            let showRPL = row[`show_rpl_${row.token}`];

            if (!showRPL || showRPL === "-") {
              showRPL = calcultateRPL(row, parseFloat($(".LivePrice_" + row.token).html()));
            }

            return (
              <div>
                <span className={`fw-bold show_rpl_${row.token}`}>
                  {showRPL}
                </span>
              </div>
            );
          } else {
            return (
              <div>
                <span className={`fw-bold show_rpl_${row.token}`}></span>
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
          }
        }
      },
    },

    {
      dataField: "Action",
      text: "U/P&l",
      formatter: (cell, row, rowIndex) =>
        // SocketState === 'null' ?
        parseInt(row.entry_qty_percent) === parseInt(row.exit_qty_percent) ? (
          "-"
        ) : (
          <div>
            <span className={`fw-bold UPL_${row.token}`}></span>
          </div>
        ),
      //  : (

      //   "-"
      // ),
    },

    {
      dataField: "Action",
      text: "T/P&L",
      formatter: (cell, row, rowIndex) =>
        // SocketState === null ?
        parseInt(row.entry_qty_percent) === parseInt(row.exit_qty_percent) ? (
          "-"
        ) : (
          <div>
            <span className={`fw-bold  TPL_${row.token}`}></span>
          </div>
        ),
      //  : (
      //   "-"
      // ),
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
    const res = await CreateSocketSession(type);

    // console.log("resresresres", res);
    if (res.status === 200) {
      setSocketState("Ok");
    }

    if (res.data.stat) {
      const handleResponse = (response) => {
        // console.log("response", response);

        // UPL_
        if (response.lp !== undefined) {
          $(".LivePrice_" + response.tk).html(response.lp);
          const get_Live_price = $(".ShowLTP_" + response.tk).html();
          const get_entry_qty = $(".entry_qty" + response.tk).html();
          const get_exit_qty = $(".exit_qty" + response.tk).html();
          const get_exit_price = $(".exit_price" + response.tk).html();
          const get_entry_price = $(".entry_price" + response.tk).html();
          const get_entry_type = $(".entry_type" + response.tk).html();
          const get_exit_type = $(".exit_type" + response.tk).html();
          const get_UPL_ = $(".UPL_" + response.tk).html();

          //  if entry qty and exist qty both exist
          if (
            (get_entry_type === "LE" && get_exit_type === "LX") ||
            (get_entry_type === "SE" && get_exit_type === "SX")
          ) {
            if (get_entry_qty !== "" && get_exit_qty !== "") {
              if (parseInt(get_entry_qty) >= parseInt(get_exit_qty)) {
                let rpl =
                  (parseInt(get_exit_price) - parseInt(get_entry_price)) *
                  parseInt(get_exit_qty);
                let upl = parseInt(get_exit_qty) - parseInt(get_entry_qty);

                let finalyupl =
                  (parseFloat(get_entry_price) - parseFloat(response.lp)) * upl;
                if (finalyupl === "NaN" || rpl === "NaN") {
                  return "-";
                } else {
                  $(".UPL_" + response.tk).html(finalyupl.toFixed(2));
                  $(".show_rpl_" + response.tk).html(rpl.toFixed(2));
                  ShowColor("UPL_", finalyupl.toFixed(2), response.tk);
                  ShowColor("show_rpl_", finalyupl.toFixed(2), response.tk);
                  $(".TPL_" + response.tk).html((finalyupl + rpl).toFixed(2));
                  ShowColor("TPL_", (finalyupl + rpl).toFixed(2), response.tk);
                }
              }
            }
          }
          //  if Only entry qty Exist
          else if (
            (get_entry_type === "LE" && get_exit_type === "") ||
            (get_entry_type === "SE" && get_exit_type === "")
          ) {
            let abc = (
              (parseFloat(response.lp) - parseFloat(get_entry_price)) *
              parseInt(get_entry_qty)
            ).toFixed();
            if (abc === "NaN") {
              return "-";
            } else {
              $(".UPL_" + response.tk).html(abc);
              $(".show_rpl_" + response.tk).html("-");
              $(".TPL_" + response.tk).html("-");

              ShowColor("UPL_", abc, response.tk);
              ShowColor("show_rpl_", "-", response.tk);
              ShowColor("TPL_", "-", response.tk);
            }
          }

          //  if Only Exist qty Exist
          else if (
            (get_entry_type === "" && get_exit_type === "LX") ||
            (get_entry_type === "" && get_exit_type === "SX")
          ) {
          } else {
          }
        }
      };
      await ConnctSocket(handleResponse, channelList).then((res) => { });
    } else {
      $(".UPL_").html("-");
      $(".show_rpl_").html("-");
      $(".TPL_").html("-");
    }
  };

  useEffect(() => {
    ShowLivePrice();
  }, [tradeHistoryData.data]);



  return (
    <>
      <Content Page_title="Trade History" button_status={false} button_status1={true}>
        {gotodashboard === "true" || gotodashboard === true ? (
          <>
            <div className="row d-flex  align-items-center justify-content-start">
              <div className="col-lg-3">
                <div className="form-check custom-checkbox mb-3">
                  <label className="col-lg-6" htmlFor="fromdate">
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
              <div className="col-lg-3">
                <div className="form-check custom-checkbox mb-3">
                  <label className="col-lg-6" htmlFor="endDate">
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
                      // new Date().toISOString().split('T')[0] &&
                      fromDate
                    } // Disable past dates
                  />
                </div>
              </div>
              <div className="col-lg-3 d-flex">
                <button
                  className="btn btn-primary mx-2"
                  onClick={(e) => getsignals(e)}
                >
                  Search
                </button>
                <button
                  className="btn btn-primary"
                  onClick={(e) => ResetDate(e)}
                >
                  Reset
                </button>
              </div>
            </div>
          </>
        ) : (
          ""
        )}

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
          tradeHistoryData={tradeHistoryData}
        />
      </Content>
    </>
  );
};

export default TradeHistory;