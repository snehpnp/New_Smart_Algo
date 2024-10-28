
// /* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Content from "../../../Components/Dashboard/Content/Content";
import FullDataTable from "../../../Components/ExtraComponents/Datatable/FullDataTable";
import { useDispatch, } from "react-redux";
import { fDateTimeSuffix } from "../../../Utils/Date_formet";
import { Get_Panel_key } from '../../../ReduxStore/Slice/Common/Option_Chain_Slice';
import BasicDataTable from "../../../Components/ExtraComponents/Datatable/BasicDataTable";
import { CreateSocketSession, ConnctSocket, GetAccessToken } from "../../../Service/Alice_Socket";
import { ShowColor1 } from "../../../Utils/ShowTradeColor";
import { Get_Open_Position, Update_Signals } from '../../../ReduxStore/Slice/Common/Option_Chain_Slice'
import $ from "jquery";
import axios from "axios"
import Modal from "../../../Components/ExtraComponents/Modal";
import { convert_string_to_month, GetMarketOpenDays } from "../../../Utils/Date_formet";
import { No_Negetive_Input_regex } from "../../../Utils/Common_regex";
import toast from 'react-hot-toast';
import ToastButton from "../../../Components/ExtraComponents/Alert_Toast";

import { GET_COMPANY_INFOS } from '../../../ReduxStore/Slice/Admin/AdminSlice'





const TradeHistory = () => {
    const dispatch = useDispatch();
    const token = JSON.parse(localStorage.getItem("user_details")).token;
    const user_id = JSON.parse(localStorage.getItem("user_details")).user_id;
    const [showModal, setshowModal] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [refresh, setrefresh] = useState(false);
    const [ButtonDisabled, setButtonDisabled] = useState(false);
    const [tradeHistoryData, setTradeHistoryData] = useState({ loading: true, data: [] });
    const [tradeHistoryAllData, setTradeHistoryAllData] = useState({ loading: true, data: [] });
    const [UserDetails, setUserDetails] = useState([]);
    const [inputValue, setInputValue] = useState('')
    const [PanelKey, setPanelKey] = useState('');
    const [SocketState, setSocketState] = useState("null");
    const [getBrokerUrl, setBrokerUrl] = useState('')
    const [selected, setSelected] = useState([]);
    const [selected1, setSelected1] = useState([]);
    const [disabled, setDisabled] = useState(false);
    const [CreateSignalRequest, setCreateSignalRequest] = useState([]);

    const handleClickDisabled = () => {
        setDisabled(true);
    }

    // --------------- FOR GET PANEL KEY-----------------------
    const getPanelDetails = async () => {
        await dispatch(GET_COMPANY_INFOS())

            .unwrap()
            .then((response) => {
                let res = response.data[0]
                //  setSocketUrl(res.version)
                setBrokerUrl(res.broker_url)
            });
    };

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
        getPanelDetails()
        getPanelKey();
    }, [refresh]);
    // --------------- FOR GET PANEL KEY-----------------------

    const Get_Position = async (e) => {
        await dispatch(
            Get_Open_Position({ token: token })
        ).unwrap()
            .then((response) => {

                if (response.status) {
                    const filterData = response && response.data.filter((item) => {
                        const searchedMatch =
                            searchInput == '' ||
                            item.TradeType.toLowerCase().includes(searchInput.toLowerCase()) ||
                            item.trade_symbol.toLowerCase().includes(searchInput.toLowerCase()) ||
                            item.entry_type.toLowerCase().includes(searchInput.toLowerCase()) ||
                            item.strategy.toLowerCase().includes(searchInput.toLowerCase());

                        return searchedMatch;
                    });
                    setTradeHistoryData({
                        loading: false,
                        data: searchInput ? filterData : response.data,
                    });

                    setTradeHistoryAllData({
                        loading: false,
                        data: response.data,
                    });


                } else {
                    setTradeHistoryData({
                        loading: false,
                        data: response.data,
                    });

                    setTradeHistoryAllData({
                        loading: false,
                        data: response.data,
                    });
                }
            });
    };

    useEffect(() => {
        Get_Position();
    }, [refresh, searchInput]);

    const columns = [
        {
            dataField: "TradeType",
            text: "Trade Type",
        },

        {
            dataField: "createdAt",
            text: "Signals time",
            formatter: (cell) => <>{fDateTimeSuffix(cell)}</>,
        },

        // {
        //     dataField: "closeprice",
        //     text: "Close Price sp",
        //     formatter: (cell, row, rowIndex) => (
        //         <div>
        //             <span className={`ClosePrice_${row.token}`}></span>
        //             <span className={`BP1_Put_Price_${row.token}  d-none`}></span>
        //             {/* <span className={`BP1_Put_Price_${row.token}`}></span> */}

        //         </div>
        //     ),
        // },
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
            dataField: "strategy",
            text: "Strategy",
            formatter: (cell, row, rowIndex) => (
                <div>
                    <span>{row.strategy}</span>
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
            dataField: "live",
            text: "Live Price",
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
            dataField: "exit_time",
            text: "Exit Time",
            formatter: (cell, row, rowIndex) => (
                <div className="col-12"><input type="time"
                    // placeholder="Enter Price"
                    name="exit_time"
                    defaultValue={row.exit_time.substring(0, 2) + ":" + row.exit_time.substring(2)}
                    onChange={(e) => SetStopLostPrice(e, e.target.name, row, row.new_qty_persent, row.trade_symbol)}
                    className="w-100" /></div>
            ),
        },
        {
            dataField: "stop_loss",
            text: "Stop Loss Price ",
            formatter: (cell, row, rowIndex) => (
                <div className="col-12"><input type="number"
                    // placeholder="Enter Price"
                    min="0"
                    name="stop_loss"
                    defaultValue={cell}
                    onChange={(e) => SetStopLostPrice(e, e.target.name, row, row.new_qty_persent, row.trade_symbol)}
                    className="w-75" /></div>
            ),
        }, {
            dataField: "target",
            text: "Target Price ",
            formatter: (cell, row, rowIndex) => (
                <div><input type="number" className="w-75"
                    // placeholder="Enter Price"
                    name="target"
                    min="0"
                    defaultValue={cell}
                    onChange={(e) => SetStopLostPrice(e, e.target.name, row, row.new_qty_persent, row.trade_symbol)}
                /></div>
            ),
        },
        // {
        //     dataField: "Action",
        //     text: "Realised",
        //     formatter: (cell, row, rowIndex) => {
        //         return (
        //             <div>
        //                 <span className={`fw-bold show_rpl_${row.token}_${row._id}`}></span>
        //                 <span className={`d-none entry_qty_${row.token}_${row._id}`}>
        //                     {row.entry_qty_percent}
        //                 </span>
        //                 <span className={`d-none exit_qty_${row.token}_${row._id}`}>
        //                     {row.exit_qty_percent}
        //                 </span>
        //                 <span className={`d-none exit_price_${row.token}_${row._id}`}>
        //                     {row.exit_price}
        //                 </span>
        //                 <span className={`d-none entry_price_${row.token}_${row._id}`}>
        //                     {row.entry_price}
        //                 </span>
        //                 <span className={`d-none entry_type_${row.token}_${row._id}`}>
        //                     {row.entry_type}
        //                 </span>
        //                 <span className={`d-none exit_type_${row.token}_${row._id}`}>
        //                     {row.exit_type}
        //                 </span>
        //                 <span className={`d-none strategy_${row.token}_${row._id}`}>
        //                     {row.strategy}
        //                 </span>
        //                 <span className={`d-none _id_${row.token}_${row._id}`}>
        //                     {row._id}
        //                 </span>
        //             </div>
        //         );
        //     },
        // },


        // {
        //     dataField: "UPL",
        //     text: "Un-Realised",
        //     formatter: (cell, row, rowIndex) => (
        //         <div>
        //             <span className={`fw-bold UPL_${row.token}_${row._id}`}></span>


        //         </div>
        //     ),
        // },

        {
            dataField: "TPL",
            text: "Total",
            formatter: (cell, row, rowIndex) => (
                <div>
                    <span className={`fw-bold  TPL_${row.token}_${row._id}`}></span>
                </div>
            ),
        },




    ];


    const SetStopLostPrice = async (event, name, row, qty_persent, symbol) => {

        let value = event.target.value
        if (name == "exit_time") {
            value = (event.target.value).replace(":", "")
        }

        setTradeHistoryAllData((prev) => {
            return {
                ...prev,
                data: prev.data.map((item) => {
                    if (item._id === row._id) {

                        return {
                            ...item,
                            sl_status: "1",
                            [name]: value ? value : "0",
                        };
                    }
                    return item;
                })
            };
        });


    }


    const UpdateStopLoss = async () => {

        const filteredArray2 = tradeHistoryAllData.data.filter(item => selected1.some(obj => obj._id === item._id));
        let MarketOpenToday = GetMarketOpenDays();

        if (MarketOpenToday) {
            if (UserDetails && UserDetails.trading_status == "off") {
                alert("Please Trading On First")
            }
            else {
                if (filteredArray2.length === 0) {
                    alert("Please Select Atleast One Symbol")
                }
                else {


                    await dispatch(
                        Update_Signals({
                            data: filteredArray2,
                            token: token,
                        })

                    ).unwrap()
                        .then((response) => {
                            if (response.status) {
                                setPanelKey(response.data)
                            }
                       
                            toast.success(response.msg);
                            setrefresh(!refresh)
                            setSelected1([])
                            setSelected([])
                            window.location.reload()
                        });
                }

            }

        } else {
            alert('Market Is Closed Today');
        }

    }



    const Set_Entry_Exit_Qty = (row, event, qty_persent, symbol) => {
        //alert(qty_persent)
        let a = No_Negetive_Input_regex(event)
        if (a) {

            if (parseInt(event) > parseInt(qty_persent)) {
                alert('Error: Value cannot be greater than ' + qty_persent);
                //setInputValue('');

                setInputValue(qty_persent);

                setCreateSignalRequest((prev) => {
                    return prev.map((item) => {

                        if (item.trade_symbol === symbol) { // Assuming 'symbol' is the unique identifier
                            return {
                                ...item,
                                new_qty_persent: qty_persent ? event : item.old_qty_persent
                            };
                        }
                        return item;

                        // return { ...item, new_qty_persent: event ? event : item.old_qty_persent };
                    });
                });




            } else {
                setInputValue(event);

                setCreateSignalRequest((prev) => {
                    return prev.map((item) => {


                        if (item.trade_symbol === symbol) { // Assuming 'symbol' is the unique identifier
                            return {
                                ...item,
                                new_qty_persent: event ? event : item.old_qty_persent
                            };
                        }
                        return item;

                        // return { ...item, new_qty_persent: event ? event : item.old_qty_persent };
                    });
                });
            }
        } else {
            alert('text not allow');

        }
    }


    const Done_For_Trade = () => {
        handleClickDisabled();

        const currentTimestamp = Math.floor(Date.now() / 1000);
        let count = 0

        let abc = CreateSignalRequest && CreateSignalRequest.map((pre_tag) => {

            count++

            if (pre_tag.new_qty_persent > pre_tag.old_qty_persent) {
                alert('Error: Value cannot be greater than ' + pre_tag.old_qty_persent);
                return
            }
            //  let price = pre_tag.price
            const price = $('.LivePrice_' + pre_tag.token).html();


            let req = `DTime:${currentTimestamp}|Symbol:${pre_tag.symbol}|TType:${pre_tag.type}|Tr_Price:131|Price:${price}|Sq_Value:0.00|Sl_Value:0.00|TSL:0.00|Segment:${pre_tag.segment}|Strike:${pre_tag.strike}|OType:${pre_tag.option_type}|Expiry:${pre_tag.expiry}|Strategy:${pre_tag.strategy}|Quntity:${pre_tag.new_qty_persent}|Key:${pre_tag.client_persnal_key}|TradeType:${pre_tag.TradeType}|ExitStatus:SQUAREOFF|Demo:demo`




            let config = {
                method: 'post',
                maxBodyLength: Infinity,

                url: `${getBrokerUrl && getBrokerUrl}`,
                headers: {
                    'Content-Type': 'text/plain'
                },
                data: req
            };

            axios.request(config)
                .then((response) => {
                    setButtonDisabled(!ButtonDisabled)
                    toast.success("Order Place Sucessfully");
                    setshowModal(false)

                    if (CreateSignalRequest.length == count) {
                        window.location.reload()
                    }
                })
                .catch((error) => {
                    console.log("Error in Open Position ", error);
                });
        })


    }


    const Cancel_Request = () => {
        setshowModal(false)
        setCreateSignalRequest([])
    }


    // ----------------------------- SQUARE OFF ----------------------------
    const SquareOfAll = () => {

        let MarketOpenToday = GetMarketOpenDays();

        if (MarketOpenToday) {
            if (UserDetails && UserDetails.trading_status == "off") {
                alert("Please Trading On First")
            } else {
                if (selected1.length > 0) {
                    setshowModal(true)

                    selected1.map((rowdata) => {

                        const buy = $('.LivePrice_' + rowdata.token).html();
                        const sell = $('.LivePrice_' + rowdata.token).html();

                        const show_expiry = convert_string_to_month(rowdata.expiry)
                        var pre_tag = {
                            client_persnal_key: rowdata.client_persnal_key ? rowdata.client_persnal_key : PanelKey && PanelKey.client_key,
                            TradeType: rowdata.TradeType,
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
                            // new_qty_persent: rowdata.entry_qty_percent ? rowdata.entry_qty_percent : rowdata.exit_qty_percent
                            new_qty_persent: rowdata.entry_qty_percent && rowdata.exit_qty_percent ? (parseInt(rowdata.entry_qty_percent) - parseInt(rowdata.exit_qty_percent)) : rowdata.entry_qty_percent ? rowdata.entry_qty_percent : rowdata.exit_qty_percent,
                        };
                        if (rowdata.entry_type === "") {
                            setCreateSignalRequest(oldValues => {
                                return oldValues.filter(item => item._id !== rowdata._id)
                            })
                        }
                        else {
                            setCreateSignalRequest(oldValues => {
                                return oldValues.filter(item => item.indexcallput !== (rowdata.option_type === "CALL" ? `${rowdata.option_type}_${rowdata._id}` : `${rowdata.option_type}_${rowdata._id}`))
                            })
                            setCreateSignalRequest((oldArray) => [pre_tag, ...oldArray]);
                        }
                    })
                } else {
                    alert("Emplty Data")
                }
            }
        }
        else {
            alert('Market Is Closed Today');
        }
    }



    var CreatechannelList = "";
    tradeHistoryData.data &&
        tradeHistoryData.data?.map((item) => {
            CreatechannelList += `${item.exchange}|${item.token}#`;
        });


    //  SHOW lIVE PRICE
    const ShowLivePrice = async () => {
        let type = { loginType: "API" };
        let channelList = CreatechannelList;

        if (UserDetails.user_id !== undefined && UserDetails.access_token !== undefined) {
            if (UserDetails.trading_status == "on") {

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

                            $('.SP1_Call_Price_' + response.tk).html(response.sp1 ? response.sp1 : response.lp);
                            $('.BP1_Put_Price_' + response.tk).html(response.bp1 ? response.bp1 : response.lp);

                            // UPL_
                            $(".LivePrice_" + response.tk).html(response.lp);
                            $(".ClosePrice_" + response.tk).html(response.c);


                            var live_price = response.lp === undefined ? "" : response.lp;

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

                    }
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




    //  GET_USER_DETAILS
    const data = async () => {

        const response = await GetAccessToken({ broker_name: "aliceblue" });

        if (response.status) {
            setUserDetails(response.data && response.data[0]);
        }

    };
    useEffect(() => {
        data();
    }, [refresh]);



    const handleOnSelect = (row, isSelect) => {
        if (isSelect) {
            setSelected([...selected, row._id]);
            setSelected1([...selected1, row]);
        } else {
            setSelected(selected.filter(x => x !== row._id));
            setSelected1(selected1.filter(x => x._id !== row._id));
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

    const forMCXandCurrencyMarketTrade = () => {

        let MarketOpenToday = GetMarketOpenDays();

        if (MarketOpenToday) {
            const currentDateIST = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });

            const EQcutoffTimeIST = new Date();

            EQcutoffTimeIST.setHours(15, 30, 0, 0);
            const forEquity = new Date(currentDateIST).getTime() > EQcutoffTimeIST.getTime();

            const CUcutoffTimeIST = new Date();
            CUcutoffTimeIST.setHours(17, 0, 0, 0);
            const forCurrency = new Date(currentDateIST).getTime() > CUcutoffTimeIST.getTime();

            const MCXcutoffTimeIST = new Date();
            MCXcutoffTimeIST.setHours(23, 30, 0, 0);
            const forMCX = new Date(currentDateIST).getTime() > MCXcutoffTimeIST.getTime();

            if (forEquity) {
                // alert("EQUTY Market Is Off ")
                return tradeHistoryData.data
                    .filter(row => ((row.segment === "C") || (row.segment === "O") || (row.segment === "FO") || (row.segment === "F")))
                    .map(row => row._id)

            }
            else if (forCurrency) {
                //  alert("CURRENCY Market Is Off ")
                return tradeHistoryData.data
                    .filter(row => ((row.segment === "CF") || (row.segment === "CO")))
                    .map(row => row._id)
            }
            else if (forMCX) {
                //  alert("MCX Market Is Off ")
                tradeHistoryData.data
                    .filter(row => ((row.segment === "MO") || (row.segment === "MF")))
                    .map(row => row._id)
            }
        }
    }


    const selectRow = {
        mode: 'checkbox',
        clickToSelect: true,
        // selected: selected,
        nonSelectable: forMCXandCurrencyMarketTrade(),
        nonSelectableStyle: { backgroundColor: 'aliceblue' },
        onSelect: handleOnSelect,
        onSelectAll: handleOnSelectAll

    };




    return (
        <>
            <Content Page_title="Open Position" button_status={false}
            >
                <div className="row d-flex align-items-center text-secondary mt-4">
                    <div className="col-lg-3">
                        <div className="mb-3 ">
                            <label for="exampleFormControlInput1" className="form-label">
                                Search Something Here
                            </label>
                            <input
                                type="text"
                                placeholder="Search..."

                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className=" p-2 rounded"
                                id="exampleFormControlInput1"
                            />
                        </div>
                    </div>

                    <button className="col-lg-2  btn btn-primary me-3 mt-1 " onClick={(e) => UpdateStopLoss()} >Update Price</button>
                    <button className=" col-lg-2   btn btn-primary mt-1" onClick={(e) => SquareOfAll()}>Square Off</button>

                </div>


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
                            // disabled_submit={disabled}
                            // disabled_submit={ButtonDisabled} 
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
                                                    <span className={`BP1_Put_Price_${row.token}`}></span>
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
                                        text: "Remaining Qty Persent",
                                    },
                                    {
                                        dataField: "qty_persent",
                                        text: "Exit Qty (%)",
                                        formatter: (cell, row, rowIndex) => (
                                            <div>
                                                <input
                                                    // key={index}
                                                    type="number"
                                                    name="quantity"
                                                    className=""
                                                    id="quantity"
                                                    placeholder="Enter Qty (%)"

                                                    onChange={
                                                        (e) =>
                                                            Set_Entry_Exit_Qty(
                                                                row,
                                                                e.target.value,
                                                                row.old_qty_persent,
                                                                row.trade_symbol
                                                            )
                                                    }


                                                    defaultValue={inputValue ? inputValue : row.old_qty_persent}
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
