import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import FullDataTable from "../../../Components/ExtraComponents/Tables/DataTable";

import { useDispatch } from "react-redux";
import Loader from "../../../Utils/Loader";
// import ExportToExcel from "../../../Utils/ExportCSV";
import { useNavigate } from "react-router-dom";
// import { Userinfo, GetBrokerDatas } from "../../../ReduxStore/Slice/Comman/Userinfo";
// import { Trade_Details, Update_Signals } from "../../../ReduxStore/Slice/Comman/Trades";
import { fDateTimeSuffix, GetMarketOpenDays, convert_string_to_month } from "../../../Utils/Date_formet";
import { CreateSocketSession, ConnctSocket } from "../../../Utils/Alice_Socket";
import { ShowColor1 } from "../../../Utils/ShowTradeColor";
import Swal from 'sweetalert2';
import $ from "jquery";
import Modal from "../../../Components/ExtraComponents/Modal";
import * as Config from "../../../Utils/Config";
import axios from "axios"

import io from 'socket.io-client';

import {
    getAllServices,
    getCatogries,
    getexpirymanualtrade,
    getAllStrikePriceApi,
    getStrategyData,
    gettokenbysocket,
    GetBrokerLiveDatas,
    GetDataAboveBelowRange,
    DeleteDataMakeCall,
    UpdateDataMakeCall

} from "../../../ReduxStore/Slice/Common/Makecall/make";

// import useGetCompany from "../../../Utils/ConnectSocket";

const MakeCallPendingPosition = () => {


    const [UserDetails, seUserDetails] = useState('')
    const [exitOpenPosition, setExitOpenPosition] = useState('')

    const currentClientKeyRef = useRef("")
    const currenPageStatusRef = useRef("openposition")
    const currentTypeABRRef = useRef("below")
    const [typeABROnclickFunc, setTypeABROnclickFunc] = useState("below");

    const [socketBackend, setSocketBackend] = useState(null);

    //   const getCompany = useGetCompany();

    //    const RunSocketUrl = async () => {
    //     const companyData = await getCompany();

    //         if(companyData[0].BackendSocketurl){

    //             const newSocket = io(companyData[0].BackendSocketurl);
    //             setSocketBackend(newSocket);
    //             return () => {
    //                 newSocket.disconnect();
    //             };

    //         }
    //    }

    // useEffect(() => {
    //     RunSocketUrl()
    // }, []); 


    // useEffect(() => {
    //     if (socketBackend) {
    //         const handleShkRec = (data) => {
    //             if (data.type == "MAKECALL" && currenPageStatusRef.current == "pendingposition") {

    //                 // TRADE MAKE CALL
    //                 if (data.type_makecall == "TRADE") {
    //                     if (data.data.Key == currentClientKeyRef.current) {




    //                         let tradeSymbol;
    //                         if (data.data.Segment.toLowerCase() == 'o' || data.data.Segment.toLowerCase() == 'co' || data.data.Segment.toLowerCase() == 'fo' || data.data.Segment.toLowerCase() == 'mo') {
    //                             tradeSymbol = data.data.Symbol + "  " + data.data.Expiry + "  " + data.data.Strike + "  " + data.data.OType + "  " + " [ " + data.data.Segment + " ] ";
    //                         }
    //                         else if (data.data.Segment.toLowerCase() == 'f' || data.data.Segment.toLowerCase() == 'cf' || data.data.Segment.toLowerCase() == 'mf') {
    //                             tradeSymbol = data.data.Symbol + "  " + data.data.Expiry + "  " + " [ " + data.data.Segment + " ] ";
    //                         }
    //                         else {
    //                             tradeSymbol = data.data.Symbol + "  " + " [ " + data.data.Segment + " ] ";
    //                         }


    //                         if (data.data.ABR_TYPE == currentTypeABRRef.current) {
    //                             Swal.fire({
    //                                 title: data.type,
    //                                 text: tradeSymbol,
    //                                 icon: "success",
    //                                 timer: 1500,
    //                                 timerProgressBar: true
    //                             });
    //                             handleClick_abr(currentTypeABRRef.current)
    //                         } else {
    //                             handleClick_abr("below")
    //                         }


    //                     }
    //                 }

    //                 //NO TRADE TIME TRADE 
    //                 else if (data.type_makecall == "NO_TRADE") {
    //                     const remainData = data.data.filter(item => item.Key == currentClientKeyRef.current);
    //                     if (remainData.length > 0) {

    //                         const formattedMessages = remainData.map(item => {
    //                             if (item.Segment.toUpperCase() === "O" || item.Segment.toUpperCase() === "FO" || item.Segment.toUpperCase() === "CO" || item.Segment.toUpperCase() === "MO") {
    //                                 return `Script : ${item.Symbol} ${item.Expiry} ${item.OType} ${item.Strike} [ ${item.Segment} ]`;
    //                             }
    //                             else if (item.Segment.toUpperCase() === "F" || item.Segment.toUpperCase() === "CF" || item.Segment.toUpperCase() === "MF") {
    //                                 return `Script : ${item.Symbol} ${item.Expiry} [ ${item.Segment} ]`;
    //                             } else {
    //                                 return `Script : ${item.Symbol} [ ${item.Segment} ]`;
    //                             }
    //                         });
    //                         const formattedString = formattedMessages.join('\n');

    //                         Swal.fire({
    //                             title: data.type + " CLOSE TRADE",
    //                             text: formattedString,
    //                             icon: "success",
    //                             timer: 1500,
    //                             timerProgressBar: true
    //                         });
    //                         handleClick_abr(currentTypeABRRef.current)

    //                     }


    //                 }

    //             }

    //             else if (data.type == "OPENPOSITION" && currenPageStatusRef.current == "openposition") {

    //                 if (data.data.client_persnal_key == currentClientKeyRef.current) {


    //                     let tradeSymbol;
    //                     if (data.data.segment.toLowerCase() == 'o' || data.data.segment.toLowerCase() == 'co' || data.data.segment.toLowerCase() == 'fo' || data.data.segment.toLowerCase() == 'mo') {
    //                         tradeSymbol = data.data.symbol + "  " + data.data.expiry + "  " + data.data.strike + "  " + data.data.option_type + "  " + " [ " + data.data.segment + " ] ";
    //                     }
    //                     else if (data.data.segment.toLowerCase() == 'f' || data.data.segment.toLowerCase() == 'cf' || data.data.segment.toLowerCase() == 'mf') {
    //                         tradeSymbol = data.data.symbol + "  " + data.data.expiry + "  " + " [ " + data.data.segment + " ] ";
    //                     }
    //                     else {
    //                         tradeSymbol = data.data.symbol + "  " + " [ " + data.data.segment + " ] ";
    //                     }


    //                     Swal.fire({
    //                         title: "Trade Executed Successfully  " + data.ExitStatus,
    //                         text: tradeSymbol,
    //                         icon: "success",
    //                         timer: 1500,
    //                         timerProgressBar: true
    //                     });

    //                     setExitOpenPosition(tradeSymbol)

    //                 }

    //             }


    //         };

    //         socketBackend.on("TRADE_NOTIFICATION", handleShkRec);

    //         return () => {
    //             socketBackend.off("TRADE_NOTIFICATION", handleShkRec);

    //         };
    //     }
    // }, [socketBackend]); 





    const user_id = JSON.parse(localStorage.getItem("user_details")).user_id
    const token = JSON.parse(localStorage.getItem('user_details')).token


    const [ButtonDisabled, setButtonDisabled] = useState(false);

    const UserLocalDetails = JSON.parse(localStorage.getItem("user_details"));

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [refresh, setrefresh] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [ForGetCSV, setForGetCSV] = useState([]);
    const [profileData, setProfileData] = useState([]);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [showModal, setshowModal] = useState(false);
    const [CreateSignalRequest, setCreateSignalRequest] = useState([]);
    const [SocketState, setSocketState] = useState("null");
    const [tradeHistoryData, setTradeHistoryData] = useState({ loading: true, data: [] });
    const [tradeHistoryAllData, setTradeHistoryAllData] = useState({ loading: true, data: [] });
    const [selected, setSelected] = useState([]);
    const [selected1, setSelected1] = useState([]);
    const [disabled, setDisabled] = useState(false);
    const [getLoginStatus, setLoginStatus] = useState({
        loading: false,
        data: [],
    })
    const [tableData, setTableData] = useState({
        loading: false,
        data: [],
    });



    const [livePriceDataDetails, setLivePriceDataDetails] = useState('');
    const [userIdSocketRun, setUserIdSocketRun] = useState("none");


    // const GetBrokerData = async () => {
    //     var data = { id: user_id }
    //     await dispatch(GetBrokerDatas(data))

    //         .unwrap()
    //         .then((response) => {

    //             if (response.status) {
    //                 currentClientKeyRef.current = response.data[0].client_key
    //                 seUserDetails(response.data)
    //             }
    //         });
    // };
    // useEffect(() => {
    //     GetBrokerData()
    // }, []);


    useEffect(() => {
        GetBrokerLiveData(userIdSocketRun)
    }, [userIdSocketRun]);



    const GetBrokerLiveData = async (userIdSocketRun) => {

        //alert(userIdSocketRun)
        await dispatch(GetBrokerLiveDatas(

            {
                req:
                {
                    id: user_id,
                    exist_user: userIdSocketRun,
                    exist_user_details: livePriceDataDetails
                },

                token: token
            }
        ))
            .unwrap()
            .then(async (response) => {
                if (response.status) {
                    setLivePriceDataDetails(response.data)
                }
            });
    };


    // MAKECALL  START///////
    const [aboveBelowRangData, setAboveBelowRangData] = useState({ loading: true, data: [] });

    const [iscolumntPrice, setiscolumntPrice] = useState(false);
    const [iscolumntPriceRange, setiscolumntPriceRange] = useState(true);
    const [selectedM, setSelectedM] = useState([]);
    const [selected1M, setSelected1M] = useState([]);
    const [refreshscreen, setRefreshscreen] = useState(false);

    const containerStyle = {
        width: '100px',
        height: '30px',
        // backgroundColor: 'lightgray', // Example background color
    };

    const containerStyle1 = {
        width: '100px',
        height: '35px',
        // backgroundColor: 'lightgray', // Example background color
    }

    const [updatedDataPriceTS, setUpdatedDataPriceTS] = useState({});


    const inputChangeTargetStoplos = (e, type, row) => {




        let name = e.target.name;
        let value = e.target.value;
        let id = row._id;

        if (type == "ExitTime" || type == "NoTradeTime") {
            value = (e.target.value).replace(":", "")
        }

        setUpdatedDataPriceTS((prevData) => ({
            ...prevData,
            [id]: {
                ...prevData[id],
                [name]: value,

            },
        }));
    };

    let columnsM = [
        {
            dataField: "1",
            text: "S No",
            formatter: (cell, row, rowIndex) => rowIndex + 1,
        },
        {
            dataField: "status",
            text: "Status",
            formatter: (cell, row, rowIndex) => (

                <select style={{
                    width: "105px",
                    height: "33px",
                    color: row.status == 0 ? 'green' : 'red'
                }}
                    className="form-select"
                    name="status"
                    onChange={(e) => { inputChangeTargetStoplos(e, "status", row) }}>
                    <option value="0" style={{ color: "green" }} selected={row.status == 0} >OPEN</option>
                    <option value="2" style={{ color: "red" }} selected={row.status == 2}>CLOSE</option>

                </select>
            ),
        },
        {
            dataField: "Symbol",
            text: "Script",
            formatter: (cell, row, rowIndex) => (
                <div>
                    {row.Segment == "O" || row.Segment == "MO" || row.Segment == "CO" ?
                        <span>{row.Symbol + " " + row.Strike + " " + row.OType + " " + row.Expiry}</span>

                        :

                        row.Segment == "F" || row.Segment == "MF" || row.Segment == "CF" ?
                            <span>{row.Symbol + " FUT " + row.Expiry}</span>
                            :

                            <span>{row.Symbol}</span>
                    }
                </div>
            ),

        },

        {
            dataField: "Strategy",
            text: "Strategy Tag",
        },

        {
            dataField: "ExitTime",
            text: "Exit Time",
            formatter: (cell, row, rowIndex) => (
                <div className="col-12"><input type="time"
                    name="ExitTime"
                    defaultValue={row.ExitTime.substring(0, 2) + ":" + row.ExitTime.substring(2)}
                    onChange={(e) => {
                        inputChangeTargetStoplos(e, "ExitTime", row);
                    }}
                />
                </div>
            ),

        },

        {
            dataField: "NoTradeTime",
            text: "No Trade Time",
            formatter: (cell, row, rowIndex) => (
                <div className="col-12"><input type="time"
                    name="NoTradeTime"
                    defaultValue={row.NoTradeTime.substring(0, 2) + ":" + row.NoTradeTime.substring(2)}
                    onChange={(e) => {
                        inputChangeTargetStoplos(e, "NoTradeTime", row);
                    }}
                /></div>
            ),

        },

        {
            dataField: "Price",
            text: "Price",
            formatter: (cell, row, rowIndex) => (
                <div>
                    <input
                        style={containerStyle}
                        className="hidebg"
                        name="Price"
                        type="number"
                        onChange={(e) => {
                            inputChangeTargetStoplos(e, "price", row);
                        }}
                        defaultValue={row.Price}
                    />
                </div>
            ),
            hidden: iscolumntPrice
        },
        {
            dataField: "EntryPriceRange_one",
            text: "Price First",
            formatter: (cell, row, rowIndex) => (
                <div>
                    <input
                        style={containerStyle}
                        className="hidebg"
                        name="EntryPriceRange_one"
                        type="number"
                        onChange={(e) => {
                            inputChangeTargetStoplos(e, "rangePriceOne", row);
                        }}
                        defaultValue={row.EntryPriceRange_one}
                    />
                </div>
            ),
            hidden: iscolumntPriceRange
        },
        {
            dataField: "EntryPriceRange_two",
            text: "Price Second",
            formatter: (cell, row, rowIndex) => (
                <div>
                    <input
                        style={containerStyle}
                        //className="hidebg"
                        name="EntryPriceRange_two"
                        type="number"
                        onChange={(e) => {
                            inputChangeTargetStoplos(e, "rangePriceTwo", row);
                        }}
                        defaultValue={row.EntryPriceRange_two}
                    />
                </div>
            ),
            hidden: iscolumntPriceRange
        },
        {
            dataField: "TType",
            text: "T Type",
            formatter: (cell, row, rowIndex) => (
                <div>
                    {row.TType == "LE" ?
                        <span>BUY</span>
                        :
                        <span>SELL</span>
                    }
                </div>
            ),
        },
        {
            dataField: "WiseTypeDropdown",
            text: "Wise Type",
            formatter: (cell, row, rowIndex) => (

                <select style={containerStyle1} className="form-select" name="WiseTypeDropdown" onChange={(e) => { inputChangeTargetStoplos(e, "WiseTypeDropdown", row) }}>

                    <option value="" selected={row.WiseTypeDropdown == ""} >Not Set</option>
                    <option value="1" selected={row.WiseTypeDropdown == "1"} >%</option>
                    <option value="2" selected={row.WiseTypeDropdown == "2"}>Points</option>

                </select>
            ),
        },

        {
            dataField: "Target",
            text: "Target",
            formatter: (cell, row, rowIndex) => (
                <div>
                    <input
                        style={containerStyle}
                        className="hidebg"
                        name="Target"
                        type="number"
                        onChange={(e) => {
                            inputChangeTargetStoplos(e, "target", row);
                        }}
                        defaultValue={row.Target}
                    />
                </div>
            ),
        },

        {
            dataField: "StopLoss",
            text: "StopLoss",
            formatter: (cell, row, rowIndex) => (
                <div>
                    <input
                        style={containerStyle}
                        className="hidebg"
                        name="StopLoss"
                        type="number"
                        onChange={(e) => {
                            inputChangeTargetStoplos(e, "stoploss", row);
                        }}
                        defaultValue={row.StopLoss}
                    />
                </div>
            ),
        },

    ]

    if (iscolumntPrice == true) {
        columnsM = columnsM.filter(column => column.dataField !== "Price");
    }

    const handleOnSelectM = (row, isSelect) => {

        if (isSelect) {
            setSelectedM([...selectedM, row._id]);
            setSelected1M([...selected1M, row]);
        } else {
            setSelectedM(selectedM.filter(x => x !== row._id));
            setSelected1M(selected1M.filter(x => x._id !== row._id));
        }

    }

    const handleOnSelectAllM = (isSelect, rows) => {
        const ids = rows.map(r => r._id);

        if (isSelect) {
            setSelectedM(ids);
            setSelected1M(rows);
        } else {
            setSelectedM([]);
            setSelected1M([]);
        }
    }

    const selectRowM = {
        mode: 'checkbox',
        clickToSelect: true,
        // selected: selected,
        // nonSelectable: forMCXandCurrencyMarketTrade(),
        nonSelectableStyle: { backgroundColor: 'aliceblue' },
        onSelect: handleOnSelectM,
        onSelectAll: handleOnSelectAllM

    };

    const delete_data = async (ABR) => {

        if (selected1M.length <= 0) {
            //   alert("please select any signal");
            Swal.fire({
                text: "please select any signal",
                icon: "error",
                timer: 1500,
                timerProgressBar: true
            });
            return
        }
        let text = "Are you sure you want delete signal ?";
        if (window.confirm(text) == true) {
            //  alert("DONE")
            await dispatch(DeleteDataMakeCall(
                {
                    req:
                    {
                        user_id: UserLocalDetails.user_id,
                        row: selected1M,
                    },

                    token: UserLocalDetails.token
                }
            ))
                .unwrap()
                .then((response) => {
                    setSelected([]);
                    setSelected1([]);
                    setUpdatedDataPriceTS({})
                    if (response.status) {
                        Swal.fire({
                            title: "Delete Successful!",
                            text: response.msg,
                            icon: "success",
                            timer: 1500,
                            timerProgressBar: true
                        });

                        setRefreshscreen(!refreshscreen);

                        handleClick_abr(ABR)
                    } else {
                        Swal.fire({
                            title: "Error",
                            text: response.msg,
                            icon: "error",
                            timer: 1500,
                            timerProgressBar: true
                        });
                        setRefreshscreen(!refreshscreen);
                        handleClick_abr(ABR)

                    }
                });


        }

    }


    const update_data = async (ABR) => {

        if (Object.keys(updatedDataPriceTS).length === 0) {
            // alert("please input any field");
            Swal.fire({
                text: "please Input Any Field",
                icon: "error",
                timer: 1500,
                timerProgressBar: true
            });
            return;
        }

        await dispatch(UpdateDataMakeCall(
            {
                req:
                {
                    user_id: UserLocalDetails.user_id,
                    row: updatedDataPriceTS,
                },

                token: UserLocalDetails.token
            }
        ))
            .unwrap()
            .then((response) => {
                setSelected([]);
                setSelected1([]);
                setUpdatedDataPriceTS({})

                if (response.status) {
                    Swal.fire({
                        title: "Update Successful!",
                        text: response.msg,
                        icon: "success",
                        timer: 1500,
                        timerProgressBar: true
                    });
                    setRefreshscreen(!refreshscreen);
                    handleClick_abr(ABR)
                    // window.location.reload();
                } else {
                    Swal.fire({
                        title: "Error",
                        text: response.msg,
                        icon: "error",
                        timer: 1500,
                        timerProgressBar: true
                    });
                    setRefreshscreen(!refreshscreen);
                    handleClick_abr(ABR)

                }
            });


    }

    const handleClick_abr = (ABR) => {
        //  alert(ABR)
        setSelected([]);
        setSelected1([]);
        setUpdatedDataPriceTS({})
        if (ABR == 'range') {
            setiscolumntPrice(true)
            setiscolumntPriceRange(false)
        } else {
            setiscolumntPrice(false)
            setiscolumntPriceRange(true)

        }
        currentTypeABRRef.current = ABR
        setTypeABROnclickFunc(ABR)
        GetDataAboveBelowRangeFun(ABR)
    }

    const GetDataAboveBelowRangeFun = async (ABR) => {

        await dispatch(GetDataAboveBelowRange(
            {
                req:
                {
                    user_id: UserLocalDetails.user_id,
                    ABR: ABR,
                },

                token: UserLocalDetails.token
            }
        ))
            .unwrap()
            .then((response) => {
                console.log("DDDD", response)
                if (response.status) {
                    setAboveBelowRangData({
                        loading: false,
                        data: response.data,
                    });
                } else {
                    setAboveBelowRangData({
                        loading: false,
                        data: [],
                    });

                }
            });


    }

    useEffect(() => {
        handleClick_abr(typeABROnclickFunc)
    }, [])



    /////MAKE CALL END //////////





    return (



        <>
            <div className="content-body">
                <div className="content container-fluid">
                    <div className="row">

                        <div className="col-lg-12 col-md-12">
                            <ul className="nav nav-tabs nav-tabs-solid d-flex justify-content-center">
                                <li className="nav-item">
                                    <a
                                        className="nav-link active"
                                        href="#solid-tab1"
                                        data-bs-toggle="tab"
                                        onClick={() => handleClick_abr("below")}
                                    >
                                        <i className="fa-solid fa-landmark pe-2"></i>
                                        Below
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a
                                        className="nav-link"
                                        href="#solid-tab2"
                                        data-bs-toggle="tab"
                                        onClick={() => handleClick_abr("above")}
                                    >
                                        <i className="fa-solid fa-envelope pe-2"></i>
                                        Above
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a
                                        className="nav-link"
                                        href="#solid-tab3"
                                        data-bs-toggle="tab"
                                        onClick={() => handleClick_abr("range")}
                                    >
                                        <i className="fa-regular fa-image pe-2"></i>
                                        Range
                                    </a>
                                </li>
                            </ul>

                        </div>
                  </div>
                    <div className="row mt-3">
                        <div className="tab-content">
                            <div className="tab-pane show active" id="solid-tab1">
                                <div className="d-flex">
                                    <div className="preview-boxs mb-3">
                                        <button type="submit" className="btn btn-primary" onClick={() => update_data('below')}>
                                            Update
                                        </button>
                                    </div>
                                    <div className="preview-boxs mb-3 ms-2 ">
                                        <button type="submit" className="btn btn-primary" onClick={() => delete_data('below')}>
                                            Delete
                                        </button>
                                    </div>
                                </div>

                                <div className="card-header d-flex justify-content-between align-items-center border-bottom">
                                    <h5 className="card-title mb-0 w-auto"> <i className="fa-solid fa-landmark pe-2"></i>Below</h5>
                                    <div className="pay-btn text-end w-auto">

                                    </div>
                                </div>

                                <div className="card-body table-responsive">
                                    <div className="invoice-total-box border">
                                        <div className="invoice-total-inner">
                                            <div className="inventory-table">


                                                <FullDataTable
                                                    keyField="_id"
                                                    TableColumns={columnsM}
                                                    tableData={aboveBelowRangData.data}
                                                    pagination1={true}
                                                    selectRow={selectRowM}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="tab-pane" id="solid-tab2">

                                <div className="d-flex">
                                    <div className="preview-boxs mb-3">
                                        <button type="submit" className="btn btn-primary" onClick={() => update_data('above')}>
                                            Update
                                        </button>
                                    </div>
                                    <div className="preview-boxs mb-3 ms-2 ">
                                        <button type="submit" className="btn btn-primary" onClick={() => delete_data('above')}>
                                            Delete
                                        </button>
                                    </div>
                                </div>



                                <div className="card-header d-flex justify-content-between align-items-center border-bottom">

                                    <h5 className="card-title mb-0 w-auto"> <i className="fa-solid fa-envelope pe-2"></i>Above</h5>
                                    <div className="pay-btn text-end w-auto">

                                    </div>
                                </div>

                                <div className="card-body table-responsive">
                                    <div className="invoice-total-box border">
                                        <div className="invoice-total-inner">
                                            <div className="inventory-table">
                                                <FullDataTable

                                                    keyField="_id"
                                                    TableColumns={columnsM}
                                                    tableData={aboveBelowRangData.data}
                                                    pagination1={true}
                                                    selectRow={selectRowM}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>



                            </div>
                            <div className="tab-pane" id="solid-tab3">
                                <div className="d-flex">
                                    <div className="preview-boxs mb-3">
                                        <button type="submit" className="btn btn-primary" onClick={() => update_data('range')}>
                                            Update
                                        </button>
                                    </div>
                                    <div className="preview-boxs mb-3 ms-2 ">
                                        <button type="submit" className="btn btn-primary" onClick={() => delete_data('range')}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                                <div className="card-header d-flex justify-content-between align-items-center border-bottom">
                                    <h5 className="card-title mb-0 w-auto">  <i className="fa-regular fa-image pe-2"></i>Range</h5>
                                    <div className="pay-btn text-end w-auto">

                                    </div>
                                </div>
                                <div className="card-body table-responsive">
                                    <div className="invoice-total-box border">
                                        <div className="invoice-total-inner">
                                            <div className="inventory-table">
                                                <FullDataTable

                                                    keyField="_id"
                                                    TableColumns={columnsM}

                                                    tableData={aboveBelowRangData.data}
                                                    pagination1={true}
                                                    selectRow={selectRowM}

                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>



                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </>



    )
}

export default MakeCallPendingPosition
