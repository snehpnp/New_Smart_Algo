// /* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Content from "../../../Components/Dashboard/Content/Content";
import FullDataTable from "../../../Components/ExtraComponents/Datatable/FullDataTable";
import { useDispatch, useSelector } from "react-redux";
import { fa_time, fDateTimeSuffix } from "../../../Utils/Date_formet";
import { Get_Panel_key } from '../../../ReduxStore/Slice/Common/Option_Chain_Slice';
import BasicDataTable from "../../../Components/ExtraComponents/Datatable/BasicDataTable";
import { check_Device } from "../../../Utils/find_device";
import { CreateSocketSession, ConnctSocket, GetAccessToken } from "../../../Service/Alice_Socket";
import { ShowColor, ShowColor1, ShowColor_Compare_two, } from "../../../Utils/ShowTradeColor";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Get_Open_Position } from '../../../ReduxStore/Slice/Common/Option_Chain_Slice'
import $ from "jquery";
import BootstrapTable from 'react-bootstrap-table-next';
import * as Config from "../../../Utils/Config";
import axios from "axios"
import Modal from "../../../Components/ExtraComponents/Modal";
import { convert_string_to_month } from "../../../Utils/Date_formet";
import { No_Negetive_Input_regex } from "../../../Utils/Common_regex";
import toast, { Toaster } from 'react-hot-toast';

import ToastButton from "../../../Components/ExtraComponents/Alert_Toast";




const TradeHistory = () => {
    const dispatch = useDispatch();

    const token = JSON.parse(localStorage.getItem("user_details")).token;
    const user_id = JSON.parse(localStorage.getItem("user_details")).user_id;



    const [showModal, setshowModal] = useState(false);
    const [refresh, setrefresh] = useState(false);
    const [ButtonDisabled, setButtonDisabled] = useState(false);
    const [tradeHistoryData, setTradeHistoryData] = useState({ loading: true, data: [] });
    const [UserDetails, setUserDetails] = useState([]);
    const [inputValue, setInputValue] = useState('')
    const [PanelKey, setPanelKey] = useState('');
    const [SocketState, setSocketState] = useState("null");

    // --------------- FOR GET OPTIONS SYMBOLS -----------------------


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
                    setPanelKey(response.data)
                }

            });
    };


    useEffect(() => {
        getPanelKey();
    }, []);
    // --------------- FOR GET PANEL KEY-----------------------

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
    }, [refresh, SocketState]);

    const columns = [
        // {
        //     dataField: "index",
        //     text: "S.No.",
        //     // hidden: true,
        //     isKey: true,
        //     formatter: (original) => {
        //         return <input type="checkbox"></input>;
        //     }
        // },
        // formatter: (cell, row, rowIndex) => rowIndex + 1,

        // {
        //     dataField: "squreoff",
        //     text: "Square OFF",
        //     formatter: (cell, row, rowIndex) => {
        //         if (
        //             row.exit_qty_percent &&
        //             row.entry_qty_percent &&
        //             parseInt(row.entry_qty_percent) > parseInt(row.exit_qty_percent)
        //         ) {
        //             return (

        //                 <button className="btn-primary"
        //                     onClick={() => SquareOff(row, rowIndex, `.SP1_Call_Price_${row.token}`)}

        //                 >
        //                     Square Off
        //                 </button>
        //             );
        //         } else if (!row.exit_qty_percent &&
        //             row.entry_qty_percent) {
        //             return (
        //                 <button className="btn-primary"
        //                     onClick={() => SquareOff(row, rowIndex, `.SP1_Call_Price_${row.token}`)}
        //                 >
        //                     Square Off
        //                 </button>
        //             );
        //         } else {
        //             return null
        //         }
        //     },
        // },
        {
            dataField: "TradeType",
            text: "Trade Type",
        },
        {
            dataField: "live",
            text: "Live Price bp",
            formatter: (cell, row, rowIndex) => (
                <div>
                    <span className={`LivePrice_${row.token}`}></span>
                    <span className={`SP1_Call_Price_${row.token} d-none`}></span>
                    {/* <span className={`SP1_Call_Price_${row.token}`}></span> */}
                    {/* <span className={`BP1_Put_Price_${row.token}_${row._id} d-none`}></span> */}

                </div>
            ),
        },
        {
            dataField: "closeprice",
            text: "Close Price sp",
            formatter: (cell, row, rowIndex) => (
                <div>
                    <span className={`ClosePrice_${row.token}`}></span>
                    <span className={`BP1_Put_Price_${row.token}  d-none`}></span>
                    {/* <span className={`BP1_Put_Price_${row.token}`}></span> */}

                </div>
            ),
        },
        {
            dataField: "type",
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
            text: "Realised",
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
            text: "Un-Realised",
            formatter: (cell, row, rowIndex) => (
                <div>
                    <span className={`fw-bold UPL_${row.token}_${row._id}`}></span>


                </div>
            ),
        },

        {
            dataField: "TPL",
            text: "Total",
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

    // console.log("CreateSignalRequest", CreateSignalRequest)
    // ----------------------------- SQUARE OFF ----------------------------


    // const SquareOff = (rowdata, rowIndex, tt) => {
    //     const buy = $('.BP1_Put_Price_' + rowdata.token).html();
    //     const sell = $('.SP1_Call_Price_' + rowdata.token).html();

    //     const show_expiry = convert_string_to_month(rowdata.expiry)
    //     var pre_tag = {
    //         option_type: rowdata.option_type,
    //         type: rowdata.entry_type === "LE" ? "LX" : rowdata.entry_type === "SE" ? 'SX' : "",
    //         trade_symbol: `${rowdata.symbol}${show_expiry}${rowdata.strike}${rowdata.option_type === "CALL" ? "CE" : rowdata.option_type === "PUT" ? "PE" : ""}`,
    //         showexpiry: rowdata.expiry,
    //         token: rowdata.token,
    //         indexcallput: rowdata.option_type === "CALL" ? `${rowdata.option_type}_${rowdata.token}` : `${rowdata.option_type}_${rowdata.token}`,
    //         indexing: rowIndex,
    //         segment: rowdata.segment,
    //         strike: rowdata.strike,
    //         price: rowdata.entry_type === "LE" ? buy : rowdata.entry_type === "SE" ? sell : "",
    //         symbol: rowdata.symbol,
    //         expiry: rowdata.expiry,
    //         strategy: rowdata.strategy,
    //         old_qty_persent: rowdata.entry_qty_percent && rowdata.exit_qty_percent ? (parseInt(rowdata.entry_qty_percent) - parseInt(rowdata.exit_qty_percent)) : rowdata.entry_qty_percent ? rowdata.entry_qty_percent : rowdata.exit_qty_percent,
    //         new_qty_persent: rowdata.entry_qty_percent ? rowdata.entry_qty_percent : rowdata.exit_qty_percent
    //     };
    //     if (rowdata.entry_type === "") {
    //         setCreateSignalRequest(oldValues => {
    //             return oldValues.filter(item => item.token !== rowdata.token)
    //         })
    //     }
    //     else {
    //         setCreateSignalRequest(oldValues => {
    //             return oldValues.filter(item => item.indexcallput !== (rowdata.option_type === "CALL" ? `${rowdata.option_type}_${rowdata.token}` : `${rowdata.option_type}_${rowdata.token}`))
    //         })

    //         setCreateSignalRequest((oldArray) => [pre_tag, ...oldArray]);
    //     }
    //     setshowModal(true)
    // }


    const Set_Entry_Exit_Qty = (row, event, qty_persent) => {
        let a = No_Negetive_Input_regex(event)

        if (a) {

            if (parseInt(event) > parseInt(qty_persent)) {
                alert('Error: Value cannot be greater than ' + qty_persent);
                setInputValue('');
            } else {
                setInputValue(event);

                setCreateSignalRequest((prev) => {
                    return prev.map((item) => {
                        return { ...item, new_qty_persent: event ? event : item.old_qty_persent };
                    });

                });

            }
        } else {
            alert('text not allow');

        }
    }


    const Done_For_Trade = () => {
        const currentTimestamp = Math.floor(Date.now() / 1000);

        let abc = CreateSignalRequest && CreateSignalRequest.map((pre_tag) => {
            let req = `DTime:${currentTimestamp}|Symbol:${pre_tag.symbol}|TType:${pre_tag.type}|Tr_Price:131|Price:${pre_tag.price}|Sq_Value:0.00|Sl_Value:0.00|TSL:0.00|Segment:${pre_tag.segment}|Strike:${pre_tag.strike}|OType:${pre_tag.option_type}|Expiry:${pre_tag.expiry}|Strategy:${pre_tag.strategy}|Quntity:${pre_tag.new_qty_persent}|Key:${PanelKey && PanelKey.client_key}|TradeType:OPTION_CHAIN|Demo:demo`

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                // url: 'https://trade.pandpinfotech.com/signal/broker-signals',
                url: `${Config.broker_url}broker-signals`,
                headers: {
                    'Content-Type': 'text/plain'
                },
                data: req
            };

            axios.request(config)
                .then((response) => {
                    setButtonDisabled(!ButtonDisabled)
                    setrefresh(!refresh)
                    toast.success("Order Place Sucessfully");
                    setshowModal(false)
                })
                .catch((error) => {
                    console.log(error);
                });
        })






    }


    const Cancel_Request = () => {
        setshowModal(false)
        setCreateSignalRequest([])
    }






    // ----------------------------- SQUARE OFF ----------------------------
    // ----------------------------- SQUARE OFF All  ----------------------------
    const SquareOfAll = () => {

        if (selected1.length > 0) {
            setshowModal(true)

            selected1.map((rowdata) => {


                const buy = $('.BP1_Put_Price_' + rowdata.token).html();
                const sell = $('.SP1_Call_Price_' + rowdata.token).html();

                const show_expiry = convert_string_to_month(rowdata.expiry)
                var pre_tag = {
                    option_type: rowdata.option_type,
                    type: rowdata.entry_type === "LE" ? "LX" : rowdata.entry_type === "SE" ? 'SX' : "",
                    trade_symbol: `${rowdata.symbol}${show_expiry}${rowdata.strike}${rowdata.option_type === "CALL" ? "CE" : rowdata.option_type === "PUT" ? "PE" : ""}`,
                    showexpiry: rowdata.expiry,
                    token: rowdata.token,
                    indexcallput: rowdata.option_type === "CALL" ? `${rowdata.option_type}_${rowdata.token}` : `${rowdata.option_type}_${rowdata.token}`,
                    segment: rowdata.segment,
                    strike: rowdata.strike,
                    price: rowdata.entry_type === "LE" ? buy : rowdata.entry_type === "SE" ? sell : "",
                    symbol: rowdata.symbol,
                    expiry: rowdata.expiry,
                    strategy: rowdata.strategy,
                    old_qty_persent: rowdata.entry_qty_percent && rowdata.exit_qty_percent ? (parseInt(rowdata.entry_qty_percent) - parseInt(rowdata.exit_qty_percent)) : rowdata.entry_qty_percent ? rowdata.entry_qty_percent : rowdata.exit_qty_percent,
                    new_qty_persent: rowdata.entry_qty_percent ? rowdata.entry_qty_percent : rowdata.exit_qty_percent
                };
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
            })


        } else {
            alert("Emplty Data")
        }


        console.log("selected1", selected1)

    }

    // ----------------------------- SQUARE OFF All ----------------------------





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
                                        let rpl = (parseFloat(get_exit_price) - parseFloat(get_entry_price)) * parseInt(get_exit_qty);
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


    const [selected, setSelected] = useState([]);
    const [selected1, setSelected1] = useState([]);

    const handleOnSelect = (row, isSelect) => {
        if (isSelect) {
            setSelected([...selected, row._id]);
            setSelected1([...selected1, row]);
        } else {
            setSelected(selected.filter(x => x !== row._id));
            setSelected1(selected1.filter(x => x.key !== row._id));
        }
    }

    const handleOnSelectAll = (isSelect, rows) => {
        const ids = rows.map(r => r._id);
        if (isSelect) {
            setSelected(ids);
            setSelected1(rows);
        } else {
            setSelected([]);
            setSelected1([]);
        }
    }

    const selectRow = {
        mode: 'checkbox',
        clickToSelect: true,
        selected: selected,
        onSelect: handleOnSelect,
        onSelectAll: handleOnSelectAll
    };



    return (
        <>
            <Content Page_title="Open Position" button_status={false}
            >
                <button className="btn btn-primary mb-4 ms-auto" onClick={(e) => SquareOfAll()}>Square Off All</button>

                <FullDataTable
                    keyField="_id"
                    TableColumns={columns}
                    tableData={tradeHistoryData.data}
                    pagination1={true}
                    selectRow={selectRow}
                />


                {showModal ? (
                    <>
                        <Modal
                            isOpen={showModal}
                            size="xl"
                            title="Request Confirmation"
                            cancel_btn={true}
                            // hideBtn={false}
                            btn_name="Confirm"
                            disabled_submit={ButtonDisabled}
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
                                        dataField: "trade_symbol",
                                        text: "Symbol",
                                    },
                                    {
                                        dataField: "price",
                                        text: "Price",
                                        formatter: (cell, row, rowIndex) => (
                                            <div>
                                                {row.type === "BUY" ?
                                                    <span className={`BP1_Put_Price_${row.token} `}></span>
                                                    : <span className={`SP1_Call_Price_${row.token}`}></span>
                                                }
                                            </div>
                                        ),

                                    },
                                    {
                                        dataField: "type",
                                        text: "Trade Type",
                                    },
                                    {
                                        dataField: "old_qty_persent",
                                        text: "Remaining Qty",
                                    },
                                    {
                                        dataField: "qty_persent",
                                        text: "Exit Qty",
                                        formatter: (cell, row, rowIndex) => (
                                            <div>
                                                <input
                                                    // key={index}
                                                    type="text"
                                                    name="quantity"
                                                    className=""
                                                    id="quantity"
                                                    placeholder="Enter Qty"

                                                    onChange={
                                                        (e) =>
                                                            Set_Entry_Exit_Qty(
                                                                row,
                                                                e.target.value,
                                                                row.old_qty_persent
                                                            )

                                                    }
                                                    value={inputValue ? inputValue : row.old_qty_persent}
                                                    max={row.old_qty_persent}
                                                // disabled={data.users.qty_type == "1" || data.users.qty_type == 1}

                                                />
                                            </div>
                                        ),
                                    },
                                    {
                                        dataField: "option_type",
                                        text: "Call Type",
                                    },
                                    {
                                        dataField: "strategy",
                                        text: "Strategy",
                                    },
                                ]}
                                tableData={CreateSignalRequest && CreateSignalRequest}
                            />
                        </Modal>
                    </>
                ) : (
                    ""
                )}

                <ToastButton />

            </Content>
        </>
    );
};

export default TradeHistory;
