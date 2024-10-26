import React, { useEffect, useState, useRef } from "react";
import Content from "../../../../Components/Dashboard/Content/Content";
import FullDataTable from "../../../../Components/ExtraComponents/Datatable/FullDataTable2";
import { Get_Tradehisotry1 } from "../../../../ReduxStore/Slice/Admin/TradehistorySlice";
import { useDispatch, useSelector } from "react-redux";
import { fDateTimeSuffix } from "../../../../Utils/Date_formet";
import { Eye } from "lucide-react";
import { loginWithApi } from "../../../../Components/Dashboard/Header/log_with_api";
import DetailsView from "./DetailsView";
import { TRADING_OFF_USER } from "../../../../ReduxStore/Slice/Users/DashboardSlice";
import { Get_All_Service_for_Client } from "../../../../ReduxStore/Slice/Common/commoSlice";
import {
  CreateSocketSession,
  ConnctSocket,
  GetAccessToken,
} from "../../../../Service/Alice_Socket";
import { ShowColor1 } from "../../../../Utils/ShowTradeColor";
import { Get_All_Service } from "../../../../ReduxStore/Slice/Admin/AdminSlice";
import {
  GET_ADMIN_TRADE_STATUS,
  ADMINGETTRADINGSTATUS,
} from "../../../../ReduxStore/Slice/Admin/TradehistorySlice";
import { useLocation } from "react-router-dom";
import $ from "jquery";
import { Modal, Button, Table } from "react-bootstrap";

import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
  PaginationTotalStandalone,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";

const paginationOptions = {
  custom: true,
  totalSize: 0, // This will be updated dynamically
  sizePerPage: 10, // Default number of items per page
  page: 1, // Starting page
};


const TradeHistory = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  var dashboard_filter = location.search.split("=")[1];
  const token = JSON.parse(localStorage.getItem("user_details")).token;
  const user_id = JSON.parse(localStorage.getItem("user_details")).user_id;
  const [UserDetails, setUserDetails] = useState([]);
  const [StrategyClientStatus, setStrategyClientStatus] = useState("null");
  const [SelectService, setSelectService] = useState("null");
  const [SelectServiceIndex, setSelectServiceIndex] = useState("null");
  const [SocketState, setSocketState] = useState("null");
  const [ForGetCSV, setForGetCSV] = useState([]);
  const [adminTradingStatus, setAdminTradingStatus] = useState(false);
  const checkStatusReff = useRef(false);
  const [showModal, setshowModal] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [refresh, setrefresh] = useState(false);
  const [rowData, setRowData] = useState({ loading: true, data: [] });
  const [getAllStrategyName, setAllStrategyName] = useState({
    loading: true,
    data: [],
  });
  const [tradeHistoryData, setTradeHistoryData] = useState({
    loading: true,
    data: [],
  });
  const [ServiceData, setServiceData] = useState({ loading: true, data: [] });
  const [lotMultypaly, SetlotMultypaly] = useState(1);
  const selector = useSelector((state) => state.DashboardSlice);
  const [showModal6, setShowModal6] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [getPage, setPage] = useState(1);
  const [getSizePerPage, setSizePerPage] = useState(10);
  const [total1, setTotal] = useState(0);


  const handleShow = () => setShowModal6(true);
  const handleClose = () => setShowModal6(false);

  const handleFromDateChange = (e) => {
    setFromDate(e.target.value);
  };
  const handleToDateChange = (e) => {
    setToDate(e.target.value);
  };

  useEffect(() => {
    forCSVdata();
  }, [tradeHistoryData.data]);

  useEffect(() => {
    data();
  }, [a]);

  useEffect(() => {
    ShowLivePrice();
  }, [tradeHistoryData.data, SocketState, UserDetails]);

  useEffect(() => {
    GetAdminTradingStatus();
  }, []);

  useEffect(() => {
    Get_TradHistory();
  }, [
    refresh,
    SocketState,
    fromDate,
    toDate,
    SelectService,
    StrategyClientStatus,
    dashboard_filter,
    SelectServiceIndex,
    lotMultypaly,
    searchTerm,
    getPage, getSizePerPage
  ]);

  useEffect(() => {
    GetAllStrategyName();
    Admin_Trading_data();
  }, []);

  const Get_TradHistory = async (e) => {
    let abc = new Date();
    let month = abc.getMonth() + 1;
    let date = abc.getDate();
    let year = abc.getFullYear();
    let full = `${year}/${month}/${date}`;

    let startDate = getActualDateFormate(fromDate);
    let endDate = getActualDateFormate(toDate);

    await dispatch(
      Get_Tradehisotry1({
        startDate: !fromDate ? full : startDate,
        endDate: !toDate ? (fromDate ? "" : full) : endDate,
        service: SelectService,
        strategy: StrategyClientStatus,
        type: dashboard_filter,
        serviceIndex: SelectServiceIndex,
        lotMultypaly: lotMultypaly,
        token: token,
        page: getPage,
        limit: getSizePerPage,
      })
    )
      .unwrap()
      .then((response) => {
        if (response.status) {
          // let filterData = response.data.filter((item) => {
          //   if (searchTerm === "") return item;
          
          //   return (
          //     item.trade_symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
          //     item.strategy.toLowerCase().includes(searchTerm.toLowerCase()) ||
          //     item.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
          //     item.entry_price.toLowerCase().includes(searchTerm.toLowerCase()) 

          //   );
          // });
          


          setTradeHistoryData({
            loading: false,
            data: response.data,
            pagination: response.pagination,
            TotalCalculate:response.TotalCalculate


          });
          setTotal(response.pagination.totalItems);

          setServiceData({
            loading: false,
            data: response.trade_symbols_filter,
          });
        } else {
          setTradeHistoryData({
            loading: false,
            data: response.data,
          });
        }
      });
  };

  const getActualDateFormate = (date) => {
    const dateParts = date.split("-");
    const formattedDate = `${dateParts[0]}/${parseInt(
      dateParts[1],
      10
    )}/${parseInt(dateParts[2], 10)}`;
    return formattedDate;
  };

  const ResetAllData = (e) => {
    e.preventDefault();
    setFromDate("");
    setStrategyClientStatus("null");
    setSelectService("null");
    setSelectServiceIndex("null");
    setToDate("");
    SetlotMultypaly(1);
    setTradeHistoryData({
      loading: false,
      data: tradeHistoryData.data,
    });
  };

  let columns = [
    {
      dataField: "index",
      text: "S.No.",
      formatter: (cell, row, rowIndex) => rowIndex + 1,
    },

    {
      dataField: "createdAt",
      text: "Signal time",
      formatter: (cell,row) => 
        <span className="text">{ cell ?fDateTimeSuffix(cell) :"-"}</span>,
    
      width: "5rem"
    },

    // {
    //   dataField: "createdAt",
    //   text: "Signals Exit time",
    //   formatter: (cell,row) =>  <span className="text">{row.type == "LX" || row.type == "SX" ?  fDateTimeSuffix(cell) : "-"}</span>,
    // },
    {
      dataField: "trade_symbol",
      text: "Symbol",
    },
    {
      dataField: "strategy",
      text: "Strategy",
    },
    {
      dataField: "type",
      text: "Entry Type",
      formatter: (cell, row, rowIndex) => (
        <div>
          <span>{row.type}</span>
          <span className={`d-none entry_qty_${row.token}_${row._id}`}>
            {row.entry_qty}
          </span>
          <span className={`d-none exit_qty_${row.token}_${row._id}`}>
            {row.exit_qty}
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
      ),
    },
    {
      dataField: "lot_size",
      text: "Entry Qty",
      formatter: (cell, row, rowIndex) => (
        <span className="text">{row.type == "LE" || row.type == "SE" ? parseInt(cell) : "-"}</span>
      ),
    },
    {
      dataField: "lot_size",
      text: "Exit Qty",
      formatter: (cell, row, rowIndex) => (
        <span className="text">{row.type == "LX" || row.type == "SX" ? parseInt(cell) : "-"}</span>

      ),
    },
    // {
    //   dataField: "live",
    //   text: "Live Price",
    //   formatter: (cell, row, rowIndex) => (
    //     <div>
    //       <span className={`LivePrice_${row.token}`}></span>
    //     </div>
    //   ),
    // },
    {
      dataField: "price",
      text: "Entry Price",
      formatter: (cell, row, rowIndex) => (
        <span className="text">{row.type == "LE" || row.type == "SE" ? cell : "-"}</span>

      ),
    },
    {
      dataField: "price",
      text: "Exit Price",
      formatter: (cell, row, rowIndex) => (
        <span className="text">{row.type == "LX" || row.type == "SX" ? cell: "-"}</span>

      ),
    },
    {
      dataField: "cal",
      text: "Total",
      formatter: (cell, row, rowIndex) => (
        <div>
          <span className="text">
            {row.type === "LX" || row.type === "SX"
              ? parseFloat(cell).toFixed(3) 
              : "-"}
          </span>
        </div>
      ),
    }
    

   

  ];

  const StatusEntry = (row) => {
    const filteredData = row.result.find(
      (obj) => obj.type === "LE" || obj.type === "SE"
    );

    if (filteredData != undefined) {
      return filteredData.exit_status == "above"
        ? "ABOVE"
        : filteredData.exit_status == "below"
        ? "BELOW"
        : filteredData.exit_status == "range"
        ? "RANGE"
        : filteredData.exit_status;
    } else {
      return "-";
    }
  };

  var CreatechannelList = "";
  let total = 0;
  tradeHistoryData.data &&
    tradeHistoryData.data?.map((item) => {
      CreatechannelList += `${item.exchange}|${item.token}#`;
      if (
        parseInt(item.exit_qty) == parseInt(item.entry_qty) &&
        item.entry_price != "" &&
        item.exit_price
      ) {
        if (item.entry_type === "LE") {
          let total1 =
            (parseFloat(item.exit_price) - parseFloat(item.entry_price)) *
            parseInt(item.exit_qty);
          if (!isNaN(total1)) {
            total += total1;
          }
        } else {
          let total1 =
            (parseFloat(item.entry_price) - parseFloat(item.exit_price)) *
            parseInt(item.exit_qty);

          if (!isNaN(total1)) {
            total += total1;
          }
        }
      }
    });

  const ShowLivePrice = async () => {
    let type = { loginType: "API" };
    let channelList = CreatechannelList;

    if (
      UserDetails &&
      UserDetails.user_id !== undefined &&
      UserDetails.access_token !== undefined &&
      UserDetails.trading_status == "on"
    ) {
      const res = await CreateSocketSession(
        type,
        UserDetails.user_id,
        UserDetails.access_token
      );

      if (res.status === 200) {
        setSocketState("Ok");
      }
      if (res.status === 401 || res.status === "401") {
        setSocketState("Unauthorized");

        tradeHistoryData.data &&
          tradeHistoryData.data.forEach((row, i) => {
            const previousRow = i > 0 ? tradeHistoryData.data[i - 1] : null;
            calcultateRPL(row, null, previousRow);
          });
      } else {
        if (res.data.stat) {
          const handleResponse = async (response) => {
            $(".BP1_Put_Price_" + response.tk).html();
            $(".SP1_Call_Price_" + response.tk).html();
            $(".LivePrice_" + response.tk).html(response.lp);
            $(".ClosePrice_" + response.tk).html(response.c);

            var live_price = response.lp === undefined ? "" : response.lp;

            tradeHistoryData.data &&
              tradeHistoryData.data.forEach((row, i) => {
                let get_ids = "_id_" + response.tk + "_" + row._id;
                let get_id_token = $("." + get_ids).html();

                const get_entry_qty = $(
                  ".entry_qty_" + response.tk + "_" + row._id
                ).html();
                const get_exit_qty = $(
                  ".exit_qty_" + response.tk + "_" + row._id
                ).html();
                const get_exit_price = $(
                  ".exit_price_" + response.tk + "_" + row._id
                ).html();
                const get_entry_price = $(
                  ".entry_price_" + response.tk + "_" + row._id
                ).html();
                const get_entry_type = $(
                  ".entry_type_" + response.tk + "_" + row._id
                ).html();
                const get_exit_type = $(
                  ".exit_type_" + response.tk + "_" + row._id
                ).html();
                const get_Strategy = $(
                  ".strategy_" + response.tk + "_" + row._id
                ).html();

                if (
                  (get_entry_type === "LE" && get_exit_type === "LX") ||
                  (get_entry_type === "SE" && get_exit_type === "SX")
                ) {
                  if (get_entry_qty !== "" && get_exit_qty !== "") {
                    if (parseInt(get_entry_qty) >= parseInt(get_exit_qty)) {
                      let rpl =
                        (parseFloat(get_exit_price) -
                          parseFloat(get_entry_price)) *
                        parseInt(get_exit_qty);

                      if (get_entry_type === "SE") {
                        rpl =
                          (parseFloat(get_entry_price) -
                            parseFloat(get_exit_price)) *
                          parseInt(get_exit_qty);
                      }

                      if (
                        ["FO", "MFO", "CFO", "BFO"].includes(
                          row.segment.toUpperCase()
                        ) &&
                        row.option_type.toUpperCase() == "PUT"
                      ) {
                        rpl =
                          (parseFloat(get_entry_price) -
                            parseFloat(get_exit_price)) *
                          parseInt(get_exit_qty);

                        if (get_entry_type === "SE") {
                          rpl =
                            (parseFloat(get_exit_price) -
                              parseFloat(get_entry_price)) *
                            parseInt(get_exit_qty);
                        }
                      }

                      let upl =
                        parseInt(get_exit_qty) - parseInt(get_entry_qty);
                      let finalyupl =
                        (parseFloat(get_entry_price) - parseFloat(live_price)) *
                        upl;

                      if (isNaN(finalyupl) || isNaN(rpl)) {
                        return "-";
                      } else {
                        $(".show_rpl_" + response.tk + "_" + get_id_token).html(
                          rpl.toFixed(2)
                        );
                        $(".UPL_" + response.tk + "_" + get_id_token).html(
                          finalyupl.toFixed(2)
                        );
                        $(".TPL_" + response.tk + "_" + get_id_token).html(
                          (finalyupl + rpl).toFixed(2)
                        );

                        ShowColor1(
                          ".show_rpl_" + response.tk + "_" + get_id_token,
                          rpl.toFixed(2),
                          response.tk,
                          get_id_token
                        );
                        ShowColor1(
                          ".UPL_" + response.tk + "_" + get_id_token,
                          finalyupl.toFixed(2),
                          response.tk,
                          get_id_token
                        );
                        ShowColor1(
                          ".TPL_" + response.tk + "_" + get_id_token,
                          (finalyupl + rpl).toFixed(2),
                          response.tk,
                          get_id_token
                        );
                      }
                    }
                  }
                } else if (
                  (get_entry_type === "LE" && get_exit_type === "") ||
                  (get_entry_type === "SE" && get_exit_type === "")
                ) {
                  let abc = (
                    (parseFloat(live_price) - parseFloat(get_entry_price)) *
                    parseInt(get_entry_qty)
                  ).toFixed();

                  if (get_entry_type === "SE") {
                    abc = (
                      (parseFloat(get_entry_price) - parseFloat(live_price)) *
                      parseInt(get_entry_qty)
                    ).toFixed();
                  }

                  if (
                    ["FO", "MFO", "CFO", "BFO"].includes(
                      row.segment.toUpperCase()
                    ) &&
                    row.option_type.toUpperCase() == "PUT"
                  ) {
                    abc =
                      (parseFloat(get_entry_price) - parseFloat(live_price)) *
                      parseInt(get_exit_qty);

                    if (get_entry_type === "SE") {
                      abc =
                        (parseFloat(live_price) - parseFloat(get_entry_price)) *
                        parseInt(get_exit_qty);
                    }
                  }

                  if (isNaN(abc)) {
                    return "-";
                  } else {
                    $(".show_rpl_" + response.tk + "_" + get_id_token).html(
                      "-"
                    );
                    $(".UPL_" + response.tk + "_" + get_id_token).html(abc);
                    $(".TPL_" + response.tk + "_" + get_id_token).html(abc);
                    ShowColor1(
                      ".show_rpl_" + response.tk + "_" + get_id_token,
                      "-",
                      response.tk,
                      get_id_token
                    );
                    ShowColor1(
                      ".UPL_" + response.tk + "_" + get_id_token,
                      abc,
                      response.tk,
                      get_id_token
                    );
                    ShowColor1(
                      ".TPL_" + response.tk + "_" + get_id_token,
                      abc,
                      response.tk,
                      get_id_token
                    );
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
          await ConnctSocket(
            handleResponse,
            channelList,
            UserDetails.user_id,
            UserDetails.access_token
          ).then((res) => {});
        } else {
          // $(".UPL_").html("-");
          // $(".show_rpl_").html("-");
          // $(".TPL_").html("-");
        }
      }
    } else {
      tradeHistoryData.data &&
        tradeHistoryData.data.forEach((row, i) => {
          let get_ids = "_id_" + row.token + "_" + row._id;
          let get_id_token = $("." + get_ids).html();

          const get_entry_qty = $(
            ".entry_qty_" + row.token + "_" + row._id
          ).html();
          const get_exit_qty = $(
            ".exit_qty_" + row.token + "_" + row._id
          ).html();
          const get_exit_price = $(
            ".exit_price_" + row.token + "_" + row._id
          ).html();
          const get_entry_price = $(
            ".entry_price_" + row.token + "_" + row._id
          ).html();
          const get_entry_type = $(
            ".entry_type_" + row.token + "_" + row._id
          ).html();
          const get_exit_type = $(
            ".exit_type_" + row.token + "_" + row._id
          ).html();
          const get_Strategy = $(
            ".strategy_" + row.token + "_" + row._id
          ).html();

          if (
            (get_entry_type === "LE" && get_exit_type === "LX") ||
            (get_entry_type === "SE" && get_exit_type === "SX")
          ) {
            if (get_entry_qty !== "" && get_exit_qty !== "") {
              if (parseInt(get_entry_qty) == parseInt(get_exit_qty)) {
                let rpl =
                  (parseFloat(get_exit_price) - parseFloat(get_entry_price)) *
                  parseInt(get_exit_qty);
                if (get_entry_type === "SE") {
                  rpl =
                    (parseFloat(get_entry_price) - parseFloat(get_exit_price)) *
                    parseInt(get_exit_qty);
                }

                if (
                  ["FO", "MFO", "CFO", "BFO"].includes(
                    row.segment.toUpperCase()
                  ) &&
                  row.option_type.toUpperCase() == "PUT"
                ) {
                  rpl =
                    (parseFloat(get_entry_price) - parseFloat(get_exit_price)) *
                    parseInt(get_exit_qty);

                  if (get_entry_type === "SE") {
                    rpl =
                      (parseFloat(get_exit_price) -
                        parseFloat(get_entry_price)) *
                      parseInt(get_exit_qty);
                  }
                }

                let upl = parseInt(get_exit_qty) - parseInt(get_entry_qty);
                let finalyupl =
                  (parseFloat(get_entry_price) - parseFloat(get_exit_price)) *
                  upl;

                if (isNaN(finalyupl) || isNaN(rpl)) {
                  return "-";
                } else {
                  $(".show_rpl_" + row.token + "_" + get_id_token).html(
                    rpl.toFixed(2)
                  );
                  $(".UPL_" + row.token + "_" + get_id_token).html(
                    finalyupl.toFixed(2)
                  );
                  $(".TPL_" + row.token + "_" + get_id_token).html(
                    (finalyupl + rpl).toFixed(2)
                  );

                  ShowColor1(
                    ".show_rpl_" + row.token + "_" + get_id_token,
                    rpl.toFixed(2),
                    row.token,
                    get_id_token
                  );
                  ShowColor1(
                    ".UPL_" + row.token + "_" + get_id_token,
                    finalyupl.toFixed(2),
                    row.token,
                    get_id_token
                  );
                  ShowColor1(
                    ".TPL_" + row.token + "_" + get_id_token,
                    (finalyupl + rpl).toFixed(2),
                    row.token,
                    get_id_token
                  );
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
              (parseFloat(get_exit_price) - parseFloat(get_entry_price)) *
              parseInt(get_entry_qty)
            ).toFixed();

            if (get_entry_type === "SE") {
              abc = (
                (parseFloat(get_entry_price) - parseFloat(get_exit_price)) *
                parseInt(get_entry_qty)
              ).toFixed();
            }

            if (
              ["FO", "MFO", "CFO", "BFO"].includes(row.segment.toUpperCase()) &&
              row.option_type.toUpperCase() == "PUT"
            ) {
              abc =
                (parseFloat(get_entry_price) - parseFloat(get_exit_price)) *
                parseInt(get_exit_qty);

              if (get_entry_type === "SE") {
                abc =
                  (parseFloat(get_exit_price) - parseFloat(get_entry_price)) *
                  parseInt(get_exit_qty);
              }
            }

            if (isNaN(abc)) {
              return "-";
            } else {
              $(".show_rpl_" + row.token + "_" + get_id_token).html("-");
              $(".UPL_" + row.token + "_" + get_id_token).html(abc);
              $(".TPL_" + row.token + "_" + get_id_token).html(abc);
              ShowColor1(
                ".show_rpl_" + row.token + "_" + get_id_token,
                "-",
                row.token,
                get_id_token
              );
              ShowColor1(
                ".UPL_" + row.token + "_" + get_id_token,
                abc,
                row.token,
                get_id_token
              );
              ShowColor1(
                ".TPL_" + row.token + "_" + get_id_token,
                abc,
                row.token,
                get_id_token
              );
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
    }
  };

  const calcultateRPL = (row, livePrice, pre_row) => {
    let get_ids = "_id_" + row.token + "_" + row._id;
    let get_id_token = $("." + get_ids).html();

    if (row.entry_type !== "" && row.exit_type !== "") {
      if (row.entry_type === "LE" || row.entry_type === "SE") {
        const entryQty = parseInt(row.entry_qty_percent);
        const exitQty = parseInt(row.exit_qty_percent);
        const entryPrice = parseFloat(row.entry_price);
        const exitPrice = parseFloat(row.exit_price);
        const rpl = (exitPrice - entryPrice) * Math.min(entryQty, exitQty);

        $(".show_rpl_" + row.token + "_" + get_id_token).html(rpl.toFixed(2));
        $(".UPL_" + row.token + "_" + get_id_token).html("-");
        $(".TPL_" + row.token + "_" + get_id_token).html(rpl.toFixed(2));

        ShowColor1(
          ".show_rpl_" + row.token + "_" + get_id_token,
          rpl.toFixed(2),
          row.token,
          get_id_token
        );
        ShowColor1(
          ".UPL_" + row.token + "_" + get_id_token,
          "-",
          row.token,
          get_id_token
        );
        ShowColor1(
          ".TPL_" + row.token + "_" + get_id_token,
          rpl.toFixed(2),
          row.token,
          get_id_token
        );
      }
    } else if (row.entry_type && row.exit_type === "") {
      $(".show_rpl_" + row.token + "_" + row._id).html("-");
      $(".UPL_" + row.token + "_" + row._id).html("-");
      $(".TPL_" + row.token + "_" + row._id).html("-");
    }
    if (row.entry_type === "" && row.exit_type !== "") {
      $(".show_rpl_" + row.token + "_" + row._id).html("-");
      $(".UPL_" + row.token + "_" + row._id).html("-");
      $(".TPL_" + row.token + "_" + row._id).html("-");
    }
  };

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

  var a = 2;
  const data = async () => {
    if (a < 2) {
    }
    const response = await GetAccessToken({ broker_name: "aliceblue" });
    if (response.status) {
      setUserDetails(response.data && response.data[0]);
    }
  };

  const Admin_Trading_data = async () => {
    dispatch(ADMINGETTRADINGSTATUS({ id: user_id, token: token }))
      .unwrap()
      .then((response) => {
        if (response.status) {
          setAdminTradingStatus(response.data);
        }
      });
  };

  const LogIn_WIth_Api = async (
    check,
    brokerid,
    tradingstatus,
    UserDetails
  ) => {
    if (check) {
      loginWithApi(brokerid, UserDetails);
    } else {
      dispatch(
        TRADING_OFF_USER({ user_id: user_id, device: "web", token: token })
      )
        .unwrap()
        .then((response) => {
          if (response.status) {
            setrefresh(!refresh);
            window.location.reload();
          }
        });
    }
  };

  const forCSVdata = () => {
    let csvArr = [];
    if (tradeHistoryData.data.length > 0) {
      tradeHistoryData.data.map((item) => {
        return csvArr.push({
          symbol: item.trade_symbol,
          EntryType: item.entry_type ? item.entry_type : "-",
          ExitType: item.exit_type ? item.exit_type : "-",
          "Entry Price": item.entry_price,
          "Entry Qty": item.entry_qty_percent,
          "Exit Price": item.exit_price,
          "Exit Qty": item.exit_qty_percent,
          "Entry Time": item.entry_dt_date,
          "Exit Time": item.exit_dt_date,
          Exchange: item.exchange,
          Strategy: item.strategy,
          "Released-P/L": $(".show_rpl_" + item.token).html(),
          "Unreleased-P/L": $(".UPL_" + item.token),
          "Total-PL": $(".TPL_" + item.token),
        });
      });

      setForGetCSV(csvArr);
    }
  };


  const GetAdminTradingStatus = async (e) => {
    await dispatch(GET_ADMIN_TRADE_STATUS({ broker_name: "ALICE_BLUE" }))
      .unwrap()
      .then((response) => {
        if (response.status) {
          checkStatusReff.current = true;
        }
      });
  };

  if (selector && selector.permission) {
    if (
      selector.permission &&
      selector.permission.data &&
      selector.permission.data[0]
    ) {
      if (selector.permission.data[0].live_price == 0) {
        columns = columns.filter((data) => data.dataField !== "live");
      }
    }
  }

  const handleInputChange = (e) => {
    const value = e.target.value;
    const isValidNumber = /^\d+$/.test(value);

    if (isValidNumber) {
      SetlotMultypaly(value === "" || value == 0 ? 1 : Number(value));
    } else {
      SetlotMultypaly(1);
    }
  };

  const handleCheckboxChange = (event, option) => {
    let updatedOptions = [...selectedOptions];
    if (event.target.checked) {
      updatedOptions.push(option);
    } else {
      updatedOptions = updatedOptions.filter((item) => item !== option);
    }
    setSelectedOptions(updatedOptions);
    // Get_TradHistory(updatedOptions);
  };

  if (selectedOptions && selectedOptions.length > 0) {
    columns = columns.filter((data) => !selectedOptions.includes(data.text));
  }


   // Handle pagination changes
   const handleTableChange = (type, { page, sizePerPage }) => {
    setPage(page);
    setSizePerPage(sizePerPage);
  };

  // Handle size per page change
  const handleSizePerPageChange = (e) => {
    const value = parseInt(e.target.value);
    setSizePerPage(value);
    setPage(1); // Reset to first page
  };

  const NoDataIndication = () => (
    <>
        <img src='../../../../assets/images/norecordfound.png' alt="sss"
            className='mx-auto d-flex'
        />
    </>
);

  return (
    <>
      <Content
        Page_title={
          dashboard_filter === "client" ? "Trading View" : "Trade History"
        }
        button_status={false}
        show_csv_button={true}
        csv_data={ForGetCSV}
        csv_title="TradeHistory"
      >
        <div className="row d-flex  align-items-center justify-content-start">
       
  
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
          {/* <div className="col-lg-2 px-1">
            <div className="mb-3">
              <label for="select" className="form-label">
                Symbol
              </label>
              <select
                className="default-select wide form-control"
                aria-label="Default select example"
                id="select"
                onChange={(e) => setSelectService(e.target.value)}
                value={SelectService}
              >
                <option value="null" selected>
                  All
                </option>
                {ServiceData.data &&
                  ServiceData.data.map((item) => {
                    return (
                      <option className="mt-1" value={item}>
                        {item}
                      </option>
                    );
                  })}
              </select>
            </div>
          </div> */}
          <div className="col-lg-2 px-1">
            <div className="mb-3">
              <label for="select" className="form-label">
                Index Symbol
              </label>
              <select
                className="default-select wide form-control"
                aria-label="Default select example"
                id="select"
                onChange={(e) => setSelectServiceIndex(e.target.value)}
                value={SelectServiceIndex}
              >
                <option value="null" selected>
                  All
                </option>
                <option value="BANKNIFTY" selected>
                  BANKNIFTY
                </option>
                <option value="NIFTY" selected>
                  NIFTY
                </option>
                <option value="FINNIFTY" selected>
                  FINNIFTY
                </option>
              </select>
            </div>
          </div>
          <div className="col-lg-2  px-1">
            <div className="mb-3">
              <label for="select" className="form-label">
                Strategy
              </label>
              <select
                className="default-select wide form-control"
                aria-label="Default select example"
                id="select"
                onChange={(e) => setStrategyClientStatus(e.target.value)}
                value={StrategyClientStatus}
              >
                <option value="null" selected>
                  All
                </option>
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
          <div className="col-lg-2  px-1">
            <div className="form-check custom-checkbox mb-3 ps-0">
              <label className="col-lg-12">Lots</label>
              <input
                type="number"
                className="default-select wide form-control"
                defaultValue={lotMultypaly}
                onChange={(e) => handleInputChange(e)}
              />
            </div>
          </div>

        

        </div>

        <div className="table-responsive">
        {tradeHistoryData.data.length > 0 ? ( tradeHistoryData.TotalCalculate &&
            tradeHistoryData.TotalCalculate >= 0 ? (
              <h3>
               <b>Total Realised P/L</b>  :{" "}
               <b><span style={{ color: "green" }}> {tradeHistoryData.TotalCalculate ? tradeHistoryData.TotalCalculate.toFixed(2):"-" }</span>{" "}</b> 
              </h3>
            ) : (
              <h3>
                <b>Total Realised P/L</b> :{" "}
                <b><span style={{ color: "red" }}> {tradeHistoryData.TotalCalculate ? tradeHistoryData.TotalCalculate.toFixed(2) : "-"}</span>{" "}</b> 
              </h3>
            )
          ) : (
            ""
          )}

<PaginationProvider
        pagination={paginationFactory({
          ...paginationOptions,
          totalSize: total1,
          page: getPage,
          sizePerPage: getSizePerPage,
        })}
      >
        {({ paginationProps, paginationTableProps }) => (
          <div>
            <BootstrapTable
              keyField="_id" // Assuming "_id" is the unique key in your data
              data={tradeHistoryData.data} // Data from API
              columns={columns} // Table columns
              remote // Indicate that pagination and data are remotely controlled
              onTableChange={handleTableChange} // Handle pagination changes
              {...paginationTableProps} // Attach pagination props
              headerClasses="bg-primary text-primary text-center header-class"
              rowClasses={`text-center`}
              noDataIndication={() => <NoDataIndication />}

            />

<div className="mb-2 d-flex justify-content-between align-items-start mt-2">
<div className="d-flex align-items-center">
  <label htmlFor="sizePerPageSelect" className="mx-2" >
    Items per page:
  </label>
  <select
    id="sizePerPageSelect"
    value={getSizePerPage}
    onChange={handleSizePerPageChange}
  
  >
    <option value={10}>10</option>
    <option value={25}>25</option>
    <option value={50}>50</option>
    <option value={100}>100</option>
  </select>
</div>
  <div className="d-flex align-items-center">
    <PaginationTotalStandalone {...paginationProps} className="mr-3" /> {/* Add margin to the right for spacing */}
  </div>
  <div className="d-flex align-items-end">
  <PaginationListStandalone {...paginationProps} />
  </div>
  
</div>

            
          </div>
        )}
      </PaginationProvider>
        </div>

        <DetailsView
          showModal={showModal}
          setshowModal={() => setshowModal(false)}
          tradeHistoryData={rowData}
        />
        <br />
        <br />

        <h6>
          <b>
            THIS RESULTS IS VALID FOR TODAY ONLY, WE DO NOT DIRECTLY OR
            INDIRECTLY MAKE ANY REFERENCE TO THE PAST OR EXPECTED FUTURE
            RETURN/PERFORMANCE OF THE ALGORITHM.
          </b>
        </h6>
        <br />
        <h6>
          <b>
            सभी प्रतिभूतियां एल्गो ट्रेडिंग सिस्टम बाजार जोखिमों के अधीन हैं और
            इस बात का कोई आश्वासन नहीं दिया जा सकता है कि उपयोगकर्ता के
            उद्देश्यों को आज के प्रदर्शन के आधार पर प्राप्त किया जाएगा। यह
            परिणाम केवल आज के लिए मान्य है।
          </b>
        </h6>
      </Content>
    </>
  );
};

export default TradeHistory;
