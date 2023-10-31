/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Content from "../../../Components/Dashboard/Content/Content";
import FullDataTable from "../../../Components/ExtraComponents/Datatable/FullDataTable";
import { Get_Tradehisotry } from "../../../ReduxStore/Slice/Admin/TradehistorySlice";
import { useDispatch, useSelector } from "react-redux";
import { fa_time, fDateTimeSuffix } from "../../../Utils/Date_formet";
import { loginWithApi } from "../../../Components/Dashboard/Header/log_with_api";
import { User_Profile } from "../../../ReduxStore/Slice/Common/commoSlice.js";
import { TRADING_OFF_USER } from "../../../ReduxStore/Slice/Users/DashboardSlice";
import { Get_All_Service_for_Client } from "../../../ReduxStore/Slice/Common/commoSlice";

import { check_Device } from "../../../Utils/find_device";
import { CreateSocketSession, ConnctSocket, GetAccessToken } from "../../../Service/Alice_Socket";
import { ShowColor, ShowColor1, ShowColor_Compare_two, } from "../../../Utils/ShowTradeColor";
import { Get_All_Catagory, Service_By_Catagory } from '../../../ReduxStore/Slice/Admin/AdminSlice'
import { Get_All_Service } from "../../../ReduxStore/Slice/Admin/AdminSlice";
import { today } from "../../../Utils/Date_formet";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Get_Open_Position } from '../../../ReduxStore/Slice/Common/Option_Chain_Slice'
import $ from "jquery";
import BootstrapTable from 'react-bootstrap-table-next';


const TradeHistory = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    var dashboard_filter = location.search.split("=")[1];

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

    const Get_TradHistory = async (e) => {
        await dispatch(
            Get_Open_Position({ token: token })
        ).unwrap()
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
    };

    useEffect(() => {
        Get_TradHistory();
    }, [refresh, SocketState, fromDate, toDate, SelectService, StrategyClientStatus]);

    const columns = [
        {
            dataField: "index",
            text: "S.No.",
            // hidden: true,
            formatter: (cell, row, rowIndex) => rowIndex + 1,
        },

        {
            dataField: "squreoff",
            text: "Square OFF",
            formatter: (cell, row, rowIndex) => {
                if (
                    row.exit_qty_percent &&
                    row.entry_qty_percent &&
                    parseInt(row.entry_qty_percent) > parseInt(row.exit_qty_percent)
                ) {
                    return (

                        <button className="btn-primary"
                            onClick={() => SquareOff(row, rowIndex, `.SP1_Call_Price_${row.token}`)}

                        >
                            Square Off
                        </button>
                    );
                } else if (!row.exit_qty_percent &&
                    row.entry_qty_percent) {
                    return (
                        <button className="btn-primary"
                            onClick={() => SquareOff(row, rowIndex, `.SP1_Call_Price_${row.token}`)}
                        >
                            Square Off
                        </button>
                    );
                } else {
                    return null
                }
            },
        },
        {
            dataField: "TradeType",
            text: "Trade Type",
        },
        {
            dataField: "live",
            text: "Live Price bp",
            formatter: (cell, row, rowIndex) => (
                <div>
                    {/* <span className={`LivePrice_${row.token}`}></span> */}
                    <span className={`SP1_Call_Price_${row.token}`}></span>
                    {/* <span className={`BP1_Put_Price_${row.token}_${row._id} d-none`}></span> */}

                </div>
            ),
        },
        {
            dataField: "closeprice",
            text: "Close Price sp",
            formatter: (cell, row, rowIndex) => (
                <div>
                    {/* <span className={`ClosePrice_${row.token}`}></span> */}
                    <span className={`BP1_Put_Price_${row.token}`}></span>

                </div>
            ),
        },
        {
            dataField: "trade_symbol",
            text: "Type",
            formatter: (cell, row, rowIndex) => (
                <span className={``}>{row.entry_type ? row.entry_type : row.exit_type}</span>
            )
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
            dataField: "createdAt",
            text: "Signals time",
            formatter: (cell) => <>{fDateTimeSuffix(cell)}</>,
        },
        {
            dataField: "strategy",
            text: "Strategy",
        },


    ];


    const [CreateSignalRequest, setCreateSignalRequest] = useState([]);

    // ----------------------------- SQUARE OFF ----------------------------

    // const buy = $('.BP1_Put_Price_' + item.token).html();
    // const sell = $('.SP1_Call_Price_' + item.token).html();

    // const Symbol = `${symbol && symbol}${expiry_i}${item.strike}${item.option_type === "CALL" ? "CE" : item.option_type === "PUT" ? "PE" : ""}`

    // Arr.push({
    //     "price": buy ? buy : sell,
    //     "Symbol": Symbol,
    //     'option_type': `${item.option_type === "CALL" ? "CE" : item.option_type === "PUT" ? "PE" : ""}`,
    //     "type": item.type === "SE" ? "SELL" : item.type === "LE" ? "BUY" : "",
    //     "token": item.token,
    //     "strategy": strategy && strategy,
    //     "call_type": item.option_type,
    //     "trading_type": item.type,
    //     "segment": item.segment,
    //     "strike": item.strike,
    //     // "expiry": expiry_i,
    // })


    const SquareOff = (rowdata, rowIndex, tt) => {
        // $('.BP1_Put_Price_' + item.token).html();
        // $('.SP1_Call_Price_' + item.token).html(); 

        const buy = $('.BP1_Put_Price_' + rowdata.token).html();
        const sell = $('.SP1_Call_Price_' + rowdata.token).html();


        const currentTimestamp = Math.floor(Date.now() / 1000);

        console.log("rowdata", rowdata)


        var pre_tag = {
            option_type: rowdata.option_type,
            type: rowdata.entry_type === "LE" ? "LX" : rowdata.entry_type === "SE" ? 'SX' : "",
            token: rowdata.token,
            indexcallput: rowdata.option_type === "CALL" ? `${rowdata.option_type}_${rowdata.token}` : `${rowdata.option_type}_${rowdata.token}`,
            indexing: rowIndex,
            segment: rowdata.segment,
            strike: rowdata.strike,
            price: rowdata.entry_type === "LE" ? buy : rowdata.entry_type === "SE" ? sell : "",
            symbol: rowdata.symbol,
            expiry: rowdata.expiry,


        };
        console.log("pre_tag", pre_tag)

        if (rowdata.entry_type === "") {
            setCreateSignalRequest(oldValues => {
                return oldValues.filter(item => item.token !== rowdata.token)
            })
        }
        else {
            setCreateSignalRequest(oldValues => {
                return oldValues.filter(item => item.indexcallput !== (rowdata.option_type === "CALL" ? `${rowdata.option_type}_${rowdata.token}` : `${rowdata.option_type}_${rowdata.token}`))
            })

            setCreateSignalRequest((oldArray) => [pre_tag, ...oldArray]);
        }




        //     let req = `DTime:${currentTimestamp}|Symbol:${symbol && symbol}|TType:${item.trading_type}|Tr_Price:131|Price:${item.price}|Sq_Value:0.00|Sl_Value:0.00|TSL:0.00|Segment:${item.segment}|Strike:${item.strike}|OType:${item.call_type}|Expiry:${expiry && expiry}|Strategy:${strategy && strategy}|Quntity:100|Key:${PanelKey && PanelKey.client_key}|TradeType:OPTION_CHAIN|Demo:demo`


    }



    // ----------------------------- SQUARE OFF ----------------------------





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



                        $('.SP1_Call_Price_' + response.tk).html(response.sp1);
                        $('.BP1_Put_Price_' + response.tk).html(response.bp1);

                        // UPL_
                        $(".LivePrice_" + response.tk).html(response.lp);
                        $(".ClosePrice_" + response.tk).html(response.c);


                        var live_price = response.lp === undefined ? "" : response.lp;

                        //  if entry qty and exist qty both exist
                        tradeHistoryData.data && tradeHistoryData.data.forEach((row, i) => {
                            // $('.SP1_Call_Price_' + row.token + "_" + row._id).html(response.sp1);
                            // $('.BP1_Put_Price_' + row.token + "_" + row._id).html(response.bp1);

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
    }, [tradeHistoryData.data, SocketState, UserDetails, SquareOff]);

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







    var a = 2
    //  GET_USER_DETAILS
    const data = async () => {
        if (a < 2) {
        }
        const response = await GetAccessToken({ broker_name: "aliceblue" });
        if (response.status) {
            setUserDetails(response.data && response.data[0]);
        }

    };
    useEffect(() => {
        data();
    }, [a]);



    // const [selectedRows, setSelectedRows] = useState([]); // State to track selected rows

    // const handleSelect = (row, isSelected) => {
    //     // Update the selectedRows state based on the row selection

    //     console.log("row", row)
    //     console.log("isSelected", isSelected)
    //     if (isSelected) {
    //         setSelectedRows([...selectedRows, row]);
    //     } else {
    //         setSelectedRows(selectedRows.filter(selectedRow => selectedRow['_id'] !== row['_id']));
    //     }
    // };

    const [selectedRows, setSelectedRows] = useState([]);

    let selectRow = {
        // mode: 'checkbox',
        // clickToSelect: true,
        // selected: selectedRows,
        // onSelect: (row, isSelect, rowIndex, e) => {
        //     console.log("row", row);
        //     console.log("isSelect", isSelect);
        //     console.log("rowIndex", rowIndex);
        //     console.log("e", e);

        //     // Handle row selection here
        //     if (isSelect) {
        //         setSelectedRows([...selectedRows, { index: rowIndex, row: row }]);
        //     } else {
        //         setSelectedRows(selectedRows.filter(selectedRow => selectedRow.index !== rowIndex));
        //     }
        // },
        // onSelectAll: (isSelect, rows) => {
        //     if (isSelect) {
        //         setSelectedRows(rows);
        //     } else {
        //         setSelectedRows([]);
        //     }
        // }
    }



    return (
        <>
            <Content Page_title="Open Position" button_status={false}
            >

                <FullDataTable
                    keyField='_id'
                    TableColumns={columns}
                    tableData={tradeHistoryData.data}
                    pagination1={true}
                // selectRow={selectRow}

                />

            </Content>
        </>
    );
};

export default TradeHistory;
