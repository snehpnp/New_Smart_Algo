import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate  } from "react-router-dom";
import axios from "axios";
import CryptoJS from "crypto-js";
import $ from "jquery";
import * as Config from "../../../Utils/Config";

import {
    getAllServices,
    getCatogries,
    getexpirymanualtrade,
    getAllStrikePriceApi,
    getStrategyData,
    gettokenbysocket,
    GetBrokerLiveDatas,
    AddDataAboveBelowRange,
    GetDataAboveBelowRange,
    DeleteDataMakeCall,
    UpdateDataMakeCall

} from "../../../ReduxStore/Slice/Common/Makecall/make";

import { GetBrokerDatas } from "../../../ReduxStore/Slice/Common/Userinfo";
import { CreateSocketSession, ConnctSocket, GetAccessToken, ConnctSocket_user } from "../../../Utils/Alice_Socket";

// import FullDataTable from "../../../Components/ExtraComponents/Tables/DataTable";
import Swal from 'sweetalert2';




const Makecall = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [ForDisabledSubmit, SetForDisabledSubmit] = useState(false)
    const [UserDetails, seUserDetails] = useState('')
    const [AllServices, setAllServices] = useState({ loading: true, data: [] });
    const [CatagoryData, setCatagoryData] = useState({ loading: true, data: [] });
    const [expirydateSelect, setExpirydateSelect] = useState({ loading: true, data: [] });
    const [strikePriceAll, setStrikePriceAll] = useState({ loading: true, data: [] });
    const [strategyDataAll, setStrategyDataAll] = useState({ loading: true, data: [] });
    const [selectStrategy, setSelectStrategy] = useState("");
    const [strikePrice, setStrikePrice] = useState('')
    const [strikePriceErr, setStrikePriceErr] = useState('')
    const [optionType, setOptionType] = useState('CALL')
    const [optionTypeErr, setOptionTypeErr] = useState('')
    const [expiryOnChange, setExpiryOnChange] = useState('');
    const [showstrikePrice, setShowstrikePrice] = useState(0)
    const [selectCatagoryid, SetSelectCatagoryId] = useState('')
    const [scriptSegment, SetScriptSegment] = useState('')
    const [selectCatagoryidSegment, SetSelectCatagorySegment] = useState('')
    const [scriptname, SetScriptname] = useState('')
    const [scriptnameErr, SetScriptnameErr] = useState('')
    const [tradeType, setTradeType] = useState('LE')
    const [tradeTypeErr, setTradeTypeErr] = useState('')
    const [changeDropdown, setChangeDropdown] = useState(0)
    const [markettime, setMarkettime] = useState("1")
    const [EntryPriceBA, SetEntryPriceBA] = useState('at')
    const [showmarkettime, setShowMarkettime] = useState(1)
    const [showhideAtBelow, setShowhideAtBelow] = useState(0)
    const [EntryPrice, SetEntryPrice] = useState('')
    const [EntryPriceErr, SetEntryPriceErr] = useState('')
    const [EntryPriceBAErr, SetEntryPriceBAErr] = useState('')
    const [EntryPriceRange_one, SetEntryPriceRange_one] = useState('')
    const [EntryPriceRange_oneErr, SetEntryPriceRange_oneErr] = useState('')
    const [EntryPriceRange_two, SetEntryPriceRange_two] = useState('')
    const [EntryPriceRange_twoErr, SetEntryPriceRange_twoErr] = useState('')
    const [IntradayDelivery, setIntradayDelivery] = useState("1")
    const [selectedTimeExit, setselectedTimeExit] = useState('');
    const [selectedTimeNoTrade, setselectedTimeNoTrade] = useState('');
    const [showhideTargetStoploss, setShowhideTargetStoploss] = useState(0)
    const [WiseTypeDropdown, setWiseTypeDropdown] = useState("")
    const [target1, setTarget1] = useState(0)
    const [stoploss, setStopLoss] = useState(0)
    const [targetStoplossDropdown, setTargetStoplossDropdown] = useState('')
    const [target1Err, setTarget1Err] = useState('')
    const [stoplossErr, setStopLossErr] = useState('')


    const handleTimeChangeExit = (event) => {
        setselectedTimeExit(event.target.value);
    };

    const handleTimeChangeNoTrade = (event) => {
        setselectedTimeNoTrade(event.target.value);
    };

 


    const UserLocalDetails = JSON.parse(localStorage.getItem("user_details"));

    const [sockets, setSockets] = useState(null);
    const previousToken = useRef("")
    const liveToken = useRef("");
    const [liveprice, setLiveprice] = useState("");
    const [stockBuyPrice, setStockBuyPrice] = useState("");
    const [stockSellPrice, setStockSellPrice] = useState("");
    const [livePriceDataDetails, setLivePriceDataDetails] = useState('');
    const [userIdSocketRun, setUserIdSocketRun] = useState("none");

    const [aboveBelowRangData, setAboveBelowRangData] = useState({ loading: true, data: [] });
    const [typeABROnclickFunc, setTypeABROnclickFunc] = useState("below");

    const [iscolumntPrice, setiscolumntPrice] = useState(false);
    const [iscolumntPriceRange, setiscolumntPriceRange] = useState(true);
    const [selected, setSelected] = useState([]);
    const [selected1, setSelected1] = useState([]);

    const [refreshscreen, setRefreshscreen] = useState(false);

    let socket;


    const styles = {
        container: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
        },
        card: {
            width: "auto",
        },
        boldHeader: {
            fontWeight: "bold",
        },
        headerButton: {
            marginRight: 8,
        },
    };


    const containerStyle = {
        width: '70px',
        height: '20px',
        // backgroundColor: 'lightgray', // Example background color
    };

  


    const [updatedDataPriceTS, setUpdatedDataPriceTS] = useState({});
    
    const [updatedDataTokenArray, setUpdatedDataTokenArray] = useState([]);
 


    const inputChangeTargetStoplos = (e, type, row) => {

         let name = e.target.name;
         let value = e.target.value;
         let id = row._id;

         setUpdatedDataTokenArray(oldValues => {
            return oldValues.filter(item => item !== row.token)
          })
    
         setUpdatedDataTokenArray((oldArray) => [row.token, ...oldArray]);

         if(type == "ExitTime" || type == "NoTradeTime"){
          value = (e.target.value).replace(":", "")
         }
    
        setUpdatedDataPriceTS((prevData) => ({
          ...prevData,
          [id]: {
            ...prevData[id],
            [name]:value,
           
          },
        }));
      };




        
      let columns = [
        {
            dataField: "1",
            text: "SR. No.",
            formatter: (cell, row, rowIndex) => rowIndex + 1,
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
                        className="hidebg"
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
            text: "Type",
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

                <select className="form-select" name="WiseTypeDropdown" onChange={(e) => { inputChangeTargetStoplos(e, "WiseTypeDropdown", row)}}>
                          
                              <option value="" selected={row.WiseTypeDropdown==""} >---</option>
                              <option value="1" selected={row.WiseTypeDropdown=="1"} >%</option>
                              <option value="2"  selected={row.WiseTypeDropdown=="2"}>Points</option>
                              
               </select>
                // <div>
                //     {row.WiseTypeDropdown == "LE" ?
                //         <span>BUY</span>
                //         :
                //         <span>SELL</span>
                //     }
                // </div>
                
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
        columns = columns.filter(column => column.dataField !== "Price");
    }





   
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





    const delete_data = async (ABR) => {
        if(selected1.length <= 0){
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
   
           await dispatch(DeleteDataMakeCall(
            {
                req:
                {
                    user_id: UserLocalDetails.user_id,
                    row: selected1,
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




    const selectRow = {
        mode: 'checkbox',
        clickToSelect: true,
        // selected: selected,
        // nonSelectable: forMCXandCurrencyMarketTrade(),
        nonSelectableStyle: { backgroundColor: 'aliceblue' },
        onSelect: handleOnSelect,
        onSelectAll: handleOnSelectAll

    };






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






    useEffect(() => {
        GetBrokerLiveData(userIdSocketRun)
    }, [userIdSocketRun]);


    const GetBrokerLiveData = async (userIdSocketRun) => {

        //alert(userIdSocketRun)
        await dispatch(GetBrokerLiveDatas(

            {
                req:
                {
                    id: UserLocalDetails.user_id,
                    exist_user: userIdSocketRun,
                    exist_user_details: livePriceDataDetails
                },

                token: UserLocalDetails.token
            }
        ))
            .unwrap()
            .then(async (response) => {

                if (response.status) {
                    setLivePriceDataDetails(response.data)
                    if (response.data && response.data.demate_user_id !== undefined && response.data && response.data.access_token !== undefined && response.data.trading_status == "on") {
                        let type = { loginType: "API" };
                        const res = await CreateSocketSession(type, response.data.demate_user_id, response.data.access_token);
                     
                        if (res.data.stat) {
                            const url = "wss://ws1.aliceblueonline.com/NorenWS/"
                            socket = new WebSocket(url)
                            socket.onopen = function () {
                                // var encrcptToken = CryptoJS.SHA256(CryptoJS.SHA256(userSession21).toString()).toString();
                                let userSession1 = response.data.access_token;
                                let userId1 = response.data.demate_user_id;
                                var encrcptToken = CryptoJS.SHA256(CryptoJS.SHA256(userSession1).toString()).toString();
                                var initCon = {
                                    susertoken: encrcptToken,
                                    t: "c",
                                    // actid: userId + "_" + "API",
                                    // uid: userId + "_" + "API",
                                    actid: userId1 + "_" + "API",
                                    uid: userId1 + "_" + "API",
                                    source: "API"
                                }
                                setSockets(socket)
                                socket.send(JSON.stringify(initCon))
                                socket.onmessage = async function (msg) {
                                    var response = JSON.parse(msg.data)
                                    if (response.tk) {
                                        if (response.lp != undefined) {
                                            if (response.tk == liveToken.current) {
                                                setLiveprice(response.lp);
                                                if (response.pc != undefined) {
                                                    if (parseFloat(response.pc) > 0) {
                                                        $('.liveprice' + response.tk).css({ "color": "green" });

                                                    }
                                                    else if (parseFloat(response.pc) < 0) {

                                                        $('.liveprice' + response.tk).css({ "color": "red" });

                                                    }
                                                    else if (parseFloat(response.pc) == 0) {

                                                        $('.liveprice' + response.tk).css({ "color": "black" });

                                                    }
                                                }

                                                setLiveprice(response.lp);
                                                $(".liveprice" + response.tk).html(response.lp);

                                                //  SetEntryPrice

                                                if (response.sp1 != undefined) {
                                                    setStockSellPrice(response.sp1)
                                                } if (response.bp1 != undefined) {
                                                    setStockBuyPrice(response.bp1);
                                                }
                                            } else {
                                                // setLiveprice("")
                                            }
                                            $(".liveprice" + response.tk).html(response.lp);
                                        }
                                    }
                                    if (response.s === 'OK') {
                                        // var channel = await channelList;
                                        // let json = {
                                        //     k: channelList,
                                        //     t: 't'
                                        // };
                                        // await socket.send(JSON.stringify(json))


                                    }
                                }
                                socket.onclose = async function (event) {
                                    if (event.wasClean) {
                                        setUserIdSocketRun('DONE')

                                    } else {
                                        setUserIdSocketRun('DONE')

                                    }
                                };

                                socket.onerror = function (error) {
                                    setUserIdSocketRun('DONE')

                                };


                            }
                        } else {
                            setUserIdSocketRun('DONE')
                            setSockets(null)
                        }
                    }
                }
            });
    };


  
    const GetBrokerData = async () => {
        var data = { id: UserLocalDetails.user_id }
        await dispatch(GetBrokerDatas(data))
            .unwrap()
            .then(async (response) => {
                console.log( "console.log(response.data) " ,response.data)
                if (response.status) {
                    
                    seUserDetails(response.data)
                }
            });
    };


    const getAllSteategyApiFun = async () => {
        await dispatch(getStrategyData(
            {
                req: {

                    user_id: UserLocalDetails.user_id
                },

                token: UserLocalDetails.token
            }
        ))
            .unwrap()
            .then((response) => {

                if (response.status) {
                    setStrategyDataAll({
                        loading: false,
                        data: response.data,
                    });
                } else {
                    setStrategyDataAll({
                        loading: false,
                        data: [],
                    });

                }
            });
    };

    const getCatogriesFun = async () => {
        await dispatch(getCatogries(
            {
                req: {

                    id: "1"
                },

                token: UserLocalDetails.token
            }
        ))
            .unwrap()
            .then((response) => {

                if (response.status) {
                    setCatagoryData({
                        loading: false,
                        data: response.data,
                    });
                }
            });
    };


    useEffect(() => {
        getCatogriesFun();
        getAllSteategyApiFun();
        GetBrokerData();
    }, []);


    const getAllServicesFun = async () => {

        await dispatch(getAllServices(
            {
                req:
                {
                    category_id: selectCatagoryid,
                },

                token: UserLocalDetails.token
            }
        ))
            .unwrap()
            .then((response) => {

                if (response.status) {
                    setAllServices({
                        loading: false,
                        data: response.data,
                    });
                } else {
                    setAllServices({
                        loading: false,
                        data: [],
                    });
                }
            });
    };


    useEffect(() => {


        setAllServices({ loading: false, data: [] });
        getAllServicesFun()
    

        let datra = CatagoryData.data && CatagoryData.data.filter((x) => {
            if ((selectCatagoryid) == x._id) {
                return x
            }
        })



        if (datra.length > 0) {
            SetScriptSegment(datra && datra[0].segment)

            switch (datra && datra[0].segment) {
                case "C":
                case "O":
                case "F":
                    setselectedTimeExit('15:25')
                    setselectedTimeNoTrade('15:25')
                    break;
                case "CF":
                case "CO":
                    setselectedTimeExit('16:55')
                    setselectedTimeNoTrade('16:55')
                    break;
                case "MF":
                case "MO":
                    setselectedTimeExit('23:25')
                    setselectedTimeNoTrade('23:25')
                    break;
                default:
                    // Handle the case where datra or datra[0].segment is undefined or doesn't match any of the cases
                    break;
            }

        }



    }, [selectCatagoryid])


    const selectCatagoryId = (e) => {
      
         

       //alert(e.target.value)


        setStrikePrice('');
        setOptionType('');
        setExpiryOnChange('')
        setShowstrikePrice(0);
        previousToken.current = "";
        liveToken.current = "";
        setLiveprice("");
        setExpirydateSelect({ loading: false, data: [] });
        setStrikePriceAll({ loading: false, data: [] });
        SetSelectCatagoryId(e.target.value);

    }

    const selectscriptname = (e) => {
        setStrikePrice('');
        setOptionType('');
        setExpiryOnChange('')
        setShowstrikePrice(0);
        previousToken.current = "";
        liveToken.current = "";
        setLiveprice("");
        setExpirydateSelect({ loading: false, data: [] });
        setStrikePriceAll({ loading: false, data: [] });
        SetScriptname(e.target.value);

        if (scriptSegment == 'C') {
            gettoken(selectCatagoryid, e.target.value, scriptSegment);
        }else if(scriptSegment == 'FO'){
           // alert("okkk ")
            gettoken(selectCatagoryid, e.target.value, scriptSegment);
        }

    }

    const getExpirybackend = async (selectCatagoryid, symbol) => {
          
        if (selectCatagoryid != '' && symbol != '') {
     
            await dispatch(getexpirymanualtrade(
                {
                    req:
                    {
                        category_id: selectCatagoryid,
                        symbol: symbol
                    },

                    token: UserLocalDetails.token
                }
            ))
                .unwrap()
                .then((response) => {
                    if (response.status) {
                        setExpirydateSelect({
                            loading: false,
                            data: response.data,
                        });
                    } else {
                        setExpirydateSelect({
                            loading: false,
                            data: [],
                        });
                    }
                });






        }



        // const data = { categorie_id: selectCatagoryid , symbol : symbol }
        // const response = await getexpirymanualtrade(data);
        // setExpirydateSelect(response.data.data);

    }

    useEffect(() => {
        getExpirybackend(selectCatagoryid, scriptname)
    }, [scriptname]);

    const selectExpiryFun = (e) => {
        setStrikePrice('');
        setOptionType('');
        setStrikePriceAll([]);
        setShowstrikePrice(0);
        setExpiryOnChange(e.target.value)

        if (scriptSegment == 'F' || scriptSegment == 'MF' || scriptSegment == 'CF') {
            gettoken(selectCatagoryid, scriptname, scriptSegment, e.target.value, scriptSegment);
        }

        else if (scriptSegment == 'O' || scriptSegment == 'MO' || scriptSegment == 'CO') {

            previousToken.current = "";
            liveToken.current = "";
            setLiveprice("");
            setShowstrikePrice(1);
            getAllStrikePrice(selectCatagoryid, scriptname, e.target.value, scriptSegment)
        }


    }

    const getAllStrikePrice = async (selectCatagoryid, symbol, expiry, segment) => {
        await dispatch(getAllStrikePriceApi(
            {
                req:
                {
                    category_id: selectCatagoryid,
                    symbol: symbol,
                    expiry: expiry,
                    segment: segment
                },

                token: UserLocalDetails.token
            }
        ))
            .unwrap()
            .then((response) => {

                if (response.status) {
                    setStrikePriceAll({
                        loading: false,
                        data: response.data,
                    });
                } else {
                    setStrikePriceAll({
                        loading: false,
                        data: [],
                    });
                }
            });
    }


    const selectStrikePrice = (e) => {
        if (e.target.value != "") {
            setStrikePrice(e.target.value)
            if (optionType != '') {
                if (scriptSegment == 'O' || scriptSegment == 'CO' || scriptSegment == 'MO') {
                    gettoken(selectCatagoryid, scriptname, scriptSegment, expiryOnChange, scriptSegment, e.target.value, optionType);
                }
            }

        } else {
            setStrikePrice('')
            setOptionType('')
        }
    }

    const selectOptionType = (e) => {
        if (e.target.value != '') {
            if (strikePrice == '') {
               // alert('please alert select strike price');
                Swal.fire({
                    text: "please alert select strike price",
                    icon: "error",
                    timer: 1500,
                    timerProgressBar: true
                  });
                return
            }
            setOptionType(e.target.value);
            if (scriptSegment == 'O' || scriptSegment == 'MO' || scriptSegment == 'CO') {
                gettoken(selectCatagoryid, scriptname, scriptSegment, expiryOnChange, scriptSegment, strikePrice, e.target.value);
            }

        } else {
            previousToken.current = "";
            liveToken.current = "";
            setLiveprice("");
            setOptionType("");
        }

    }

    const dropdownSelect = (num) => {
        if (num == "1") {
            return setChangeDropdown(1)
        } else if (num == "0") {
            return setChangeDropdown(0)
        }
    }

    const selectMarkettime = (e) => {
        if (e.target.value == "2") {
            if (EntryPriceBA == 'at') {
                SetEntryPriceBA('above')
                setShowhideAtBelow(0)
            } else {
                SetEntryPriceBA('above')
                setShowhideAtBelow(0)
            }
            setShowMarkettime(0)
        } else {
            setShowMarkettime(1)
            SetEntryPriceBA('at')
            setShowhideAtBelow(0)
        }
        setMarkettime(e.target.value)
    }

    const selectAtAboveBelow = (e) => {

        if (e.target.value == 'range') {
            setShowhideAtBelow(1)
            SetEntryPriceBA(e.target.value);
        } else {
            setShowhideAtBelow(0)
            SetEntryPriceBA(e.target.value);
        }

    }

    const selectWiseTypeDropdown = (e) => {
        if (e.target.value == '') {
            setTarget1(0)
            setStopLoss(0)
            setShowhideTargetStoploss(0)
            setWiseTypeDropdown(e.target.value)
        } else {
            setShowhideTargetStoploss(1)
            setWiseTypeDropdown(e.target.value)
        }

    }


    const selectTargetStoplossDropdown = (e) => {
        setTargetStoplossDropdown(e.target.value)
    }

    const gettoken = async (selectCatagoryid = "", symbol = "", scriptSegment = "", expiry = "", segment = "", strike_price = "", option_type = "") => {

        if (scriptSegment != "") {
            if (scriptSegment == "C") {

                const data = { symbol: symbol, categorie_id: selectCatagoryid, segment: scriptSegment }
                await dispatch(gettokenbysocket(
                    {
                        req: data,
                        token: UserLocalDetails.token
                    }
                ))
                    .unwrap()
                    .then((response) => {
                        if (response.status) {

                            if (sockets != null) {
                                let json1 = {
                                    k: previousToken.current,
                                    t: "u",
                                };
                                sockets.send(JSON.stringify(json1));
                                previousToken.current = response.exchange + "|" + response.token;

                                liveToken.current = response.token;
                                let json = {
                                    k: response.exchange + "|" + response.token,
                                    t: "t",
                                };
                                sockets.send(JSON.stringify(json));

                            } else {
                                liveToken.current = response.token;
                            }

                        } else {

                        }
                    });

            }
            else if (scriptSegment == "FO") {

                const data = { symbol: symbol, categorie_id: selectCatagoryid, segment: scriptSegment }
                await dispatch(gettokenbysocket(
                    {
                        req: data,
                        token: UserLocalDetails.token
                    }
                ))
                    .unwrap()
                    .then((response) => {
                        if (response.status) {

                            if (sockets != null) {
                                let json1 = {
                                    k: previousToken.current,
                                    t: "u",
                                };
                                sockets.send(JSON.stringify(json1));
                                previousToken.current = response.exchange + "|" + response.token;

                                liveToken.current = response.token;
                                let json = {
                                    k: response.exchange + "|" + response.token,
                                    t: "t",
                                };
                                sockets.send(JSON.stringify(json));

                            } else {
                                liveToken.current = response.token;
                            }

                        } else {

                        }
                    });

            }
            else if (scriptSegment == "F" || scriptSegment == "MF" || scriptSegment == "CF") {

                const data = { symbol: symbol, categorie_id: selectCatagoryid, expiry: expiry, segment: segment }

                await dispatch(gettokenbysocket(
                    {
                        req: data,
                        token: UserLocalDetails.token
                    }
                ))
                    .unwrap()
                    .then((response) => {
                        if (response.status) {
                            if (sockets != null) {
                                let json1 = {
                                    k: previousToken.current,
                                    t: "u",
                                };
                                sockets.send(JSON.stringify(json1));
                                previousToken.current = response.exchange + "|" + response.token;

                                liveToken.current = response.token;
                                let json = {
                                    k: response.exchange + "|" + response.token,
                                    t: "t",
                                };
                                sockets.send(JSON.stringify(json));

                            } else {
                                liveToken.current = response.token;
                           
                            }

                        } else {

                        }
                    });

            }
            else if (scriptSegment == "O" || scriptSegment == "MO" || scriptSegment == "CO") {
                const data = { symbol: symbol, categorie_id: selectCatagoryid, expiry: expiry, segment: segment, strike_price: strike_price, option_type: option_type }
                await dispatch(gettokenbysocket(
                    {
                        req: data,
                        token: UserLocalDetails.token
                    }
                ))
                    .unwrap()
                    .then((response) => {
                        if (response.status) {

                            if (sockets != null) {
                                let json1 = {
                                    k: previousToken.current,
                                    t: "u",
                                };
                                sockets.send(JSON.stringify(json1));
                                previousToken.current = response.exchange + "|" + response.token;

                                liveToken.current = response.token;
                                let json = {
                                    k: response.exchange + "|" + response.token,
                                    t: "t",
                                };
                                sockets.send(JSON.stringify(json));

                            } else {

                                liveToken.current = response.token;
                            
                            }

                        } else {

                        }
                    });

            }


        }
    }


    const GenerateMakeCall = async (e) => {

        e.preventDefault();

        if (selectCatagoryid == "") {
           // alert("Please Select a Script  Type")
             Swal.fire({
                text: "Please Select a Script  Type",
                icon: "error",
                timer: 1500,
                timerProgressBar: true
              });
            return
        }
        if (scriptname == "") {
            // alert("Please Select a Script Name")
            Swal.fire({
                text: "Please Select a Script Name",
                icon: "error",
                timer: 1500,
                timerProgressBar: true
              });
            return
        }
        if (scriptSegment != 'C') {
            if (expiryOnChange == "") {
                // alert("Please Select a Expiry")
                Swal.fire({
                    text: "Please Select a Expiry",
                    icon: "error",
                    timer: 1500,
                    timerProgressBar: true
                  });
                return
            }
        }
        if (scriptSegment == 'O' || scriptSegment == 'MO' || scriptSegment == 'CO') {
            if (strikePrice == "") {
                // alert("Please Select a strike price")
                Swal.fire({
                    text: "Please Select a strike price",
                    icon: "error",
                    timer: 1500,
                    timerProgressBar: true
                  });
                return
            }
            if (optionType == "") {
                // alert("Please Select a Option Type")
                Swal.fire({
                    text: "Please Select a Option Type",
                    icon: "error",
                    timer: 1500,
                    timerProgressBar: true
                  });
                return
            }
        }
        if (selectStrategy == "") {
            // alert("Please Select a Strategy")
            Swal.fire({
                text: "Please Select a Strategy",
                icon: "error",
                timer: 1500,
                timerProgressBar: true
              });
            return
        }
        if (tradeType == '') {
            // alert("Please Select a Trade Type")
            Swal.fire({
                text: "Please Select a Trade Type",
                icon: "error",
                timer: 1500,
                timerProgressBar: true
              });
            return
        }
        if (EntryPriceBA == '') {
            // alert("Please Select a  Above/Below/Range")
            Swal.fire({
                text: "Please Select a  Above/Below/Range",
                icon: "error",
                timer: 1500,
                timerProgressBar: true
              });
            return
        }


        if (IntradayDelivery == '1') {
            if (EntryPriceBA == "at") {
                if (selectedTimeExit == '') {
                    // alert("Please Select a Intraday Time Exit")
                    Swal.fire({
                        text: "Please Select a Intraday Time Exit",
                        icon: "error",
                        timer: 1500,
                        timerProgressBar: true
                      });
                    return
                }
            } else {
                if (selectedTimeExit == '') {
                    // alert("Please Select a Intraday Time Exit")
                    Swal.fire({
                        text: "Please Select a Intraday Time Exit",
                        icon: "error",
                        timer: 1500,
                        timerProgressBar: true
                      });
                    return
                }

                if (selectedTimeNoTrade == '') {
                    // alert("Please Select a Intraday No Trade Time")
                    Swal.fire({
                        text: "Please Select a Intraday No Trade Time",
                        icon: "error",
                        timer: 1500,
                        timerProgressBar: true
                      });
                    return
                }
            }
        }

        if (IntradayDelivery == '2') {
            if (selectedTimeNoTrade == '') {
                // alert("Please Select a Delivery No Trade Time")
                Swal.fire({
                    text: "Please Select a Delivery No Trade Time",
                    icon: "error",
                    timer: 1500,
                    timerProgressBar: true
                  });
                return
            }
        }

        var price = "0";
        var sl_status = 0
        var Target = 0
        var StopLoss = 0


        if (EntryPriceBA == 'at') {
            const get_price_live = $(".liveprice" + liveToken.current).html();

            if (get_price_live == '' || get_price_live == undefined) {
                if (EntryPrice == '') {
                    // alert("Please Enter a Entry Price")
                    Swal.fire({
                        text: "Please Enter a Entry Price",
                        icon: "error",
                        timer: 1500,
                        timerProgressBar: true
                      });
                    return
                } else {
                    price = EntryPrice
                }
            } else {
                price = get_price_live
            }


        }

        else if (EntryPriceBA == 'range') {
            if (EntryPriceRange_one == '') {
                // alert("Please Enter a price from")
                Swal.fire({
                    text: "Please Enter a price from",
                    icon: "error",
                    timer: 1500,
                    timerProgressBar: true
                  });
                return
            }
            if (EntryPriceRange_two == '') {
                // alert("Please Enter a price to")
                Swal.fire({
                    text: "Please Enter a price to",
                    icon: "error",
                    timer: 1500,
                    timerProgressBar: true
                  });
                return
            }
        }
        else if (EntryPriceBA == 'above' || EntryPriceBA == 'below') {
            if (EntryPrice == '') {
                // alert("Please Enter a Entry Price")
                Swal.fire({
                    text: "Please Enter a Entry Price",
                    icon: "error",
                    timer: 1500,
                    timerProgressBar: true
                  });
                return
            } else {
                price = EntryPrice
            }

        }


        if (WiseTypeDropdown != '') {
            if (parseFloat(target1) == 0 && parseFloat(stoploss) == 0) {
                // alert("Please Select Any target/Stoploss")
                Swal.fire({
                    text: "Please Select Any target/Stoploss",
                    icon: "error",
                    timer: 1500,
                    timerProgressBar: true
                  });
                return
            }

            if (parseFloat(target1) < 0) {
                // alert("Not Set Negative value in Target")
                Swal.fire({
                    text: "Not Set Negative value in Target",
                    icon: "error",
                    timer: 1500,
                    timerProgressBar: true
                  });
                return
            }
            if (parseFloat(stoploss) < 0) {
                // alert("Not Set Negative value in Stoploss")
                Swal.fire({
                    text: "Not Set Negative value in Stoploss",
                    icon: "error",
                    timer: 1500,
                    timerProgressBar: true
                  });
                return
            }



            // if (WiseTypeDropdown == '1') {
            //     if (parseFloat(target1) != 0 && target1 != '') {

            //         let percent_value = parseFloat(price) * (target1 / 100)
            //         Target = parseFloat(price) + parseFloat(percent_value)
            //         sl_status = 1
            //     }
            //     if (parseFloat(stoploss) != 0 && stoploss != '') {
            //         let percent_value = parseFloat(price) * (stoploss / 100)
            //         StopLoss = parseFloat(price) - parseFloat(percent_value)
            //         sl_status = 1
            //     }
            // }

            // else if (WiseTypeDropdown == '2') {
            //     // Points
            //     if (parseFloat(target1) != 0 && target1 != '') {
            //         Target = parseFloat(price) + parseFloat(target1)
            //         sl_status = 1
            //     }
            //     if (parseFloat(stoploss) != 0 && stoploss != '') {
            //         StopLoss = parseFloat(price) - parseFloat(stoploss)
            //         sl_status = 1
            //     }
            // }

        }


        var Tr_Price = '0.00'
        var Sq_Value = '0.00'
        var Sl_Value = '0.00'
        var TSL = '0.00'



        // set price
        //alert("Done")
        //Trade At price -------- AT
        if (EntryPriceBA == 'at') {
           let ExitTime  = selectedTimeExit.replace(":", "")
   

          
          
            
            if (WiseTypeDropdown == '1') {
                if (parseFloat(target1) != 0 && target1 != '') {

                    let percent_value = parseFloat(price) * (target1 / 100)
                    Target = parseFloat(price) + parseFloat(percent_value)
                    sl_status = 1
                }
                if (parseFloat(stoploss) != 0 && stoploss != '') {
                    let percent_value = parseFloat(price) * (stoploss / 100)
                    StopLoss = parseFloat(price) - parseFloat(percent_value)
                    sl_status = 1
                }
            }

            else if (WiseTypeDropdown == '2') {
                // Points
                if (parseFloat(target1) != 0 && target1 != '') {
                    Target = parseFloat(price) + parseFloat(target1)
                    sl_status = 1
                }
                if (parseFloat(stoploss) != 0 && stoploss != '') {
                    StopLoss = parseFloat(price) - parseFloat(stoploss)
                    sl_status = 1
                }
            }
            // const currentTimestamp = Math.floor(Date.now() / 1000);
            //     let req = `DTime:${currentTimestamp}|Symbol:${scriptname}|TType:${tradeType}|Tr_Price:0.00|Price:${price}|Sq_Value:0.00|Sl_Value:0.00|TSL:0.00|Segment:${scriptSegment}|Strike:${strikePrice==''?'100':strikePrice}|OType:${optionType}|Expiry:${expiryOnChange}|Strategy:${selectStrategy}|Quntity:100|Key:SNE132023|TradeType:MAKECALL|Target:${target1}|StopLoss:${stoploss}|ExitTime:${selectedTimeExit}|sl_status:1|Demo:demo`
            SetForDisabledSubmit(true)
            const currentTimestamp = Math.floor(Date.now() / 1000);
            let req = `DTime:${currentTimestamp}|Symbol:${scriptname}|TType:${tradeType}|Tr_Price:0.00|Price:${price}|Sq_Value:0.00|Sl_Value:0.00|TSL:0.00|Segment:${scriptSegment}|Strike:${strikePrice == '' ? '100' : strikePrice}|OType:${optionType}|Expiry:${expiryOnChange}|Strategy:${selectStrategy}|Quntity:100|Key:${UserDetails && UserDetails[0].client_key}|TradeType:MAKECALL|Target:${Target == 0 ? 0 : Target.toFixed(2)}|StopLoss:${StopLoss == 0 ? 0 : StopLoss.toFixed(2)}|ExitTime:${ExitTime}|sl_status:${sl_status}|ExitStatus:MAKECALL AT|Demo:demo`
           

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: Config.broker_backend,
                headers: {
                    'Content-Type': 'text/plain'
                },
                data: req
            };
            axios.request(config)
                .then(async (response) => {
                    if (response.status) {


                        await dispatch(AddDataAboveBelowRange(
                            {
                                req: {
            
                                    user_id: UserLocalDetails.user_id,
                                    Symbol: scriptname,
                                    TType: tradeType,
                                    Tr_Price: Tr_Price,
                                    Price: price,
                                    EntryPrice: EntryPrice,
                                    Sq_Value: Sq_Value,
                                    Sl_Value: Sl_Value,
                                    TSL: TSL,
                                    Segment: scriptSegment,
                                    Strike: strikePrice == '' ? '100' : strikePrice,
                                    OType: optionType,
                                    Expiry: expiryOnChange,
                                    Strategy: selectStrategy,
                                    Quntity: '100',
                                    Key: UserDetails && UserDetails[0].client_key,
                                    TradeType: 'MAKECALL',
                                    Target: Target == 0 ? 0 : Target.toFixed(2),
                                    StopLoss: StopLoss == 0 ? 0 : StopLoss.toFixed(2),
                                    ExitTime: selectedTimeExit,
                                    NoTradeTime: selectedTimeNoTrade,
                                    sl_status: sl_status,
                                    token: liveToken.current,
                                    EntryPriceRange_one: EntryPriceRange_one,
                                    EntryPriceRange_two: EntryPriceRange_two,
                                    ABR_TYPE: EntryPriceBA,
                                    marketTimeAmo: markettime,
                                    WiseTypeDropdown:WiseTypeDropdown,
            
                                },
            
                                token: UserLocalDetails.token
                               }
                             ))
                            .unwrap()
                            .then((response) => {
                         
                            });


                        Swal.fire({
                            title: "Data Add Successful!",
                            text: response.msg,
                            icon: "success",
                            timer: 1500,
                            timerProgressBar: true
                          });

                          setRefreshscreen(!refreshscreen);
                          setTimeout(() => {
                            navigate("/admin/makecallpendingposition")
                            //window.location.reload()
                          }, 1500);

                     } else {
                       
                        Swal.fire({
                            title: "Error",
                            text: response.msg,
                            icon: "error",
                            timer: 1500,
                            timerProgressBar: true
                          });
                          setRefreshscreen(!refreshscreen);
                         


                     }
                })
                .catch((error) => {
                });






        }

        // TRADE RANGE --------
        else if (EntryPriceBA == 'range') {
            if (EntryPriceRange_one == '') {
                // alert("Please Enter a price from")
                
                Swal.fire({
                    text: "Please Enter a price from",
                    icon: "error",
                    timer: 1500,
                    timerProgressBar: true
                  });
                return
            }
            if (EntryPriceRange_two == '') {
                // alert("Please Enter a price to")
                Swal.fire({
                    text: "Please Enter a price to",
                    icon: "error",
                    timer: 1500,
                    timerProgressBar: true
                  });
                return
            }


            if(parseFloat(EntryPriceRange_one) >= parseFloat(EntryPriceRange_two)){
                Swal.fire({
                    title: "Error",
                    text: "Second price should be higher than the first price.",
                    icon: "error",
                    timer: 1500,
                    timerProgressBar: true
                    });
              return
            }

            
            if (parseFloat(target1) != 0 && target1 != '') {

                Target = parseFloat(target1)
                sl_status = 1
            }
            if (parseFloat(stoploss) != 0 && stoploss != '') {

                StopLoss = parseFloat(stoploss)
                sl_status = 1
            }

            // markettime - after market order

            SetForDisabledSubmit(true)
            await dispatch(AddDataAboveBelowRange(
                {
                    req: {

                        user_id: UserLocalDetails.user_id,
                        Symbol: scriptname,
                        TType: tradeType,
                        Tr_Price: Tr_Price,
                        Price: price,
                        EntryPrice: EntryPrice,
                        Sq_Value: Sq_Value,
                        Sl_Value: Sl_Value,
                        TSL: TSL,
                        Segment: scriptSegment,
                        Strike: strikePrice == '' ? '100' : strikePrice,
                        OType: optionType,
                        Expiry: expiryOnChange,
                        Strategy: selectStrategy,
                        Quntity: '100',
                        Key: UserDetails && UserDetails[0].client_key,
                        TradeType: 'MAKECALL',
                        Target: Target == 0 ? 0 : Target.toFixed(2),
                        StopLoss: StopLoss == 0 ? 0 : StopLoss.toFixed(2),
                        ExitTime: selectedTimeExit,
                        NoTradeTime: selectedTimeNoTrade,
                        sl_status: sl_status,
                        token: liveToken.current,
                        EntryPriceRange_one: EntryPriceRange_one,
                        EntryPriceRange_two: EntryPriceRange_two,
                        ABR_TYPE: EntryPriceBA,
                        marketTimeAmo: markettime,
                        WiseTypeDropdown:WiseTypeDropdown,

                    },

                    token: UserLocalDetails.token
                }
            ))
                .unwrap()
                .then((response) => {

                    if (response.status) {
                        Swal.fire({
                            title: "Data Add Successful!",
                            text: response.msg,
                            icon: "success",
                            timer: 1500,
                            timerProgressBar: true
                          });
                          setRefreshscreen(!refreshscreen);
                          setTimeout(() => {
                            navigate("/admin/makecallpendingposition")
                            //window.location.reload()
                          }, 1500);

                     } else {
                       
                        Swal.fire({
                            title: "Error",
                            text: response.msg,
                            icon: "error",
                            timer: 1500,
                            timerProgressBar: true
                          });
                          setRefreshscreen(!refreshscreen);
                         


                     }
                });


        }

        // TRADE ABOVE BELOW ------------
        else if (EntryPriceBA == 'above' || EntryPriceBA == 'below') {
            if (EntryPrice == '') {
                // alert("Please Enter a Entry Price")
                Swal.fire({
                    text: "Please Enter a Entry Price",
                    icon: "error",
                    timer: 1500,
                    timerProgressBar: true
                  });
                return
            } else {
                price = EntryPrice
            }


            if (parseFloat(target1) != 0 && target1 != '') {

                Target = parseFloat(target1)
                sl_status = 1
            }
            if (parseFloat(stoploss) != 0 && stoploss != '') {

                StopLoss = parseFloat(stoploss)
                sl_status = 1
            }




            // markettime - after market order
            //alert(liveToken.current)
            SetForDisabledSubmit(true)
            await dispatch(AddDataAboveBelowRange(
                {
                    req: {

                        user_id: UserLocalDetails.user_id,
                        Symbol: scriptname,
                        TType: tradeType,
                        Tr_Price: Tr_Price,
                        Price: price,
                        EntryPrice: EntryPrice,
                        Sq_Value: Sq_Value,
                        Sl_Value: Sl_Value,
                        TSL: TSL,
                        Segment: scriptSegment,
                        Strike: strikePrice == '' ? '100' : strikePrice,
                        OType: optionType,
                        Expiry: expiryOnChange,
                        Strategy: selectStrategy,
                        Quntity: '100',
                        Key: UserDetails && UserDetails[0].client_key,
                        TradeType: 'MAKECALL',
                        Target: Target == 0 ? 0 : Target.toFixed(2),
                        StopLoss: StopLoss == 0 ? 0 : StopLoss.toFixed(2),
                        ExitTime: selectedTimeExit,
                        NoTradeTime: selectedTimeNoTrade,
                        sl_status: sl_status,
                        token: liveToken.current,
                        EntryPriceRange_one: "",
                        EntryPriceRange_two: "",
                        ABR_TYPE: EntryPriceBA,
                        marketTimeAmo: markettime,
                        WiseTypeDropdown:WiseTypeDropdown,

                    },

                    token: UserLocalDetails.token
                }
            ))
                .unwrap()
                .then((response) => {
                     if (response.status) {
                        Swal.fire({
                            title: "Data Add Successful!",
                            text: response.msg,
                            icon: "success",
                            timer: 1500,
                            timerProgressBar: true
                          });
                          setRefreshscreen(!refreshscreen);
                          setTimeout(() => {
                            navigate("/admin/makecallpendingposition")
                            //window.location.reload()
                          }, 1500);

                     } else {
                       
                        Swal.fire({
                            title: "Error",
                            text: response.msg,
                            icon: "error",
                            timer: 1500,
                            timerProgressBar: true
                          });
                          setRefreshscreen(!refreshscreen);
                         


                     }
                });






        }

    }


    const selectPriceRange = (e) =>{
        //alert(e.target.name)
        if(e.target.name == "FirstPrice"){
            if(e.target.value == ''){
             SetEntryPriceRange_one('')
             SetEntryPriceRange_two('')
            }else{
             SetEntryPriceRange_one(e.target.value)
            }
        }else if(e.target.name == "SecondPrice"){

            // alert(e.target.value)  
             if(EntryPriceRange_one == '' || EntryPriceRange_one == undefined){
                 Swal.fire({
                     title: "Error",
                     text: "Please Input First price in Range",
                     icon: "error",
                     timer: 1500,
                     timerProgressBar: true
                   });
                 return
             }else{
                    
                SetEntryPriceRange_two(e.target.value);

                // if(parseFloat(EntryPriceRange_one) < parseFloat(e.target.value)){
                //     SetEntryPriceRange_two(e.target.value);
                // }else{
                    
                //      Swal.fire({
                //         title: "Error",
                //         text: "This Input price should be higher than the first price.",
                //         icon: "error",
                //         timer: 1500,
                //         timerProgressBar: true
                //       });
                //       return

                // }
               
         
             }

        }
     
    

    }



    return (
        <div className="content-body">
            <div className="content container-fluid">
                <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center border-bottom">
                        <h5 className="card-title mb-0 w-auto">
                            <i className="fas fa-money-bill-wave pe-2" />
                            Make Call
                        </h5>
                        <div className="pay-btn text-end w-auto" />
                    </div>
                    <div className="card-body">


                        <div className="row">
                            <div className="col-md-12">
                                <div className="edit-card">
                                    <div className="card-body">
                                        <div className="form-group-item border-0 mb-0">
                                            <div className="row align-item-center">
                                                <div className="col-lg-4 col-md-6 col-sm-12">
                                                    <div className="input-block mb-3">
                                                        <label>Script Type * </label>
                                                        <select className="form-select" onChange={(e) => {

                                                            selectCatagoryId(e);
                                                            SetScriptname("")
                                                            // SetForDisabledSubmit(false)
                                                        }}>
                                                            <option name="none" disabled="">Select Script Type</option>

                                                            {CatagoryData.data && CatagoryData.data?.map((x, index) => {

                                                             if (x.segment !== "FO") {
                                                               return <option key={x._id} name={x.segment} value={x._id}>{x.name}</option>
                                                        
                                                             }

                                                            })}
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="col-lg-4 col-md-6 col-sm-12">
                                                    <div className="input-block mb-3">
                                                        <label>Script Name</label>
                                                        <ul className="form-group-plus css-equal-heights">
                                                            <li>
                                                                <select className="form-select" onChange={(e) => {
                                                                    selectscriptname(e);
                                                                    SetScriptnameErr('');
                                                                    // selecttype(''); 
                                                                    dropdownSelect("1")

                                                                }}
                                                                >
                                                                    <option name="none" disabled="">Select Script Name</option>
                                                                    {
                                                                        AllServices.data && AllServices.data.map((x) => {
                                                                            return <option value={x.name}>{x.name}</option>
                                                                        })
                                                                    }
                                                                </select>
                                                            </li>
                                                            <li>

                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-md-6 col-sm-12">
                                                    <div className="input-block mb-3">
                                                        <label>Expiry Date</label>
                                                        <select className="form-select" name="expiry_date" onChange={(e) => { selectExpiryFun(e) }} selected>
                                                            <option value="">Select Expiry Date</option>
                                                            {expirydateSelect.data && expirydateSelect.data?.map((sm, i) =>
                                                                <option value={sm.uniqueExpiryValues}>{sm.uniqueExpiryValues}</option>)}
                                                        </select>
                                                    </div>
                                                </div>



                                                {
                                                    showstrikePrice == 1 ?
                                                        <div className="col-lg-4 col-md-6 col-sm-12">
                                                            <div className="input-block mb-3">
                                                                <label>Strike Price - -</label>
                                                                <select className="form-select" onChange={(e) => { selectStrikePrice(e); setStrikePriceErr('') }}>
                                                                    <option selected value="">--Select strike price--</option>
                                                                    {
                                                                        strikePriceAll.data && strikePriceAll.data.map((x) => {
                                                                            return <option value={x.strike}>{x.strike}</option>
                                                                        })
                                                                    }
                                                                </select>
                                                            </div>
                                                        </div>
                                                        :
                                                        ""
                                                }



                                                {
                                                    strikePrice && showstrikePrice == 1 ?
                                                        <div className="col-lg-4 col-md-6 col-sm-12">
                                                            <div className="input-block mb-3">
                                                                <label>Option-Type Call/Put -</label>
                                                                <select className="form-select" onChange={(e) => { selectOptionType(e); setOptionTypeErr(''); }}>
                                                                    <option selected value="" >--Select--</option>
                                                                    <option value="CALL">CALL</option>
                                                                    <option value="PUT">PUT</option>

                                                                </select>
                                                            </div>
                                                        </div>
                                                        :
                                                        ""
                                                }




                                                <div className="col-lg-4 col-md-6 col-sm-12">
                                                    <div className="input-block mb-3">
                                                        <label>Select Strategy -</label>
                                                        <select className="form-select" onChange={(e) => setSelectStrategy(e.target.value)} name="strategyname">

                                                            <option value="">-- Select Strategy Tag--</option>
                                                            {strategyDataAll.data && strategyDataAll.data.map((sm, i) =>
                                                                <option value={sm.strategy_name}>{sm.strategy_name}</option>)}
                                                        </select>
                                                    </div>
                                                </div>


                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="edit-card">
                                    <div className="card-body">
                                        <div className="form-group-item border-0 mb-0">
                                            <div className="row align-item-center">
                                                <div className="col-lg-4 col-md-6 col-sm-12">
                                                    <div className="input-block mb-3">
                                                        <label>Type -</label>
                                                        <select className="form-select" onChange={(e) => { setTradeType(e.target.value); setTradeTypeErr(''); dropdownSelect("0") }}>
                                                            <option selected={tradeType == "LE"} value="LE">Buy</option>
                                                            <option selected={tradeType == "SE"} value="SE">Sell</option>
                                                        </select>

                                                    </div>
                                                </div>

                                                {/* <div className="col-lg-4 col-md-6 col-sm-12">
                                                    <div className="input-block mb-3">
                                                        <label>Market Time -</label>
                                                        <ul className="form-group-plus css-equal-heights">
                                                            <li>
                                                                <select className="form-select" onChange={(e) => { selectMarkettime(e) }}>
                                                 <option value="1" selected={markettime == "1"}>DAY</option>
                                                 <option value="2" selected={markettime == "2"}>AMO</option>
                                                                </select>
                                                            </li>
                                                            <li>
                                                               
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div> */}


                                                <div className="col-lg-4 col-md-6 col-sm-12">
                                                    <div className="input-block mb-3">
                                                        <label>Entry Price :</label>
                                                        <span className={'liveprice' + liveToken.current}>{
                                                            liveprice
                                                        }</span>


                                                        {
                                                            showhideAtBelow == 0 ?

                                                                <input type="number" name="exampleFormControlInput1" className="form-control show_entry_price" onChange={(e) => {
                                                                    SetEntryPrice(e.target.value);
                                                                    SetEntryPriceErr('')
                                                                }} value={EntryPrice} />

                                                                :

                                                                <>

                                                                    <div className="row mt-2">
                                                                        <div className="col-sm-6 col-lg-6">
                                                                            <input type="number" name="FirstPrice" className="form-control"  onChange={(e) => {
                                                                                selectPriceRange(e)
                                                                               // SetEntryPriceRange_one(e.target.value);
                                                                                SetEntryPriceRange_oneErr('')
                                                                            }} value={EntryPriceRange_one} />
                                                                        </div>

                                                                        <div className="col-sm-6 col-lg-6">
                                                                            <input type="number" name="SecondPrice" className="form-control" onChange={(e) => {selectPriceRange(e)
                                                                               // SetEntryPriceRange_two(e.target.value);
                                                                                SetEntryPriceRange_twoErr('')
                                                                            }} value={EntryPriceRange_two} />
                                                                        </div>
                                                                    </div>
                                                                </>
                                                        }

                                                    </div>

                                                    <div className="row mt-2">
                                                        {
                                                            showmarkettime == 1 ?
                                                                <div className="col-sm-4 col-lg-3">
                                                                    <div className="radio">
                                                                        <label htmlFor="at_check">
                                                                            <input
                                                                                id="at_check"
                                                                                type="radio"
                                                                                name="at_check"
                                                                                value="at"
                                                                                checked={EntryPriceBA == 'at' ? true : false}
                                                                                onChange={(e) => { selectAtAboveBelow(e); SetEntryPriceBAErr('') }}
                                                                            />
                                                                            At
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                                :
                                                                ""
                                                        }

                                                        <div className="col-sm-4 col-lg-3">
                                                            <div className="radio">
                                                                <label htmlFor="at_above">
                                                                    <input
                                                                        id="at_above"
                                                                        type="radio"
                                                                        name="at_above"
                                                                        value="above"
                                                                        checked={EntryPriceBA == 'above' ? true : false}
                                                                        onChange={(e) => { selectAtAboveBelow(e); SetEntryPriceBAErr('') }}
                                                                    />
                                                                    Above
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4 col-lg-3">
                                                            <div className="radio">
                                                                <label htmlFor="at_below">
                                                                    <input
                                                                        id="at_below"
                                                                        type="radio"
                                                                        name="at_below"
                                                                        value="below"
                                                                        checked={EntryPriceBA == 'below' ? true : false}
                                                                        onChange={(e) => { selectAtAboveBelow(e); SetEntryPriceBAErr('') }}
                                                                    />
                                                                    Below
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4 col-lg-3">
                                                            <div className="radio">
                                                                <label htmlFor="at_range">
                                                                    <input
                                                                        id="at_range"
                                                                        type="radio"
                                                                        name="at_range"
                                                                        value="range"
                                                                        checked={EntryPriceBA == 'range' ? true : false}
                                                                        onChange={(e) => { selectAtAboveBelow(e); SetEntryPriceBAErr('') }}
                                                                    />
                                                                    Range
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>

                                                <div className="col-lg-4 col-md-6 col-sm-12">
                                                </div>

                                                <div className="col-lg-4">
                                                    <div className="input-block mb-3">
                                                        <label>Intraday / Delivery -</label>
                                                        <select className="form-select" onChange={(e) => { setIntradayDelivery(e.target.value) }}>
                                                            <option selected={IntradayDelivery == "1"} value="1">Intraday</option>
                                                            <option selected={IntradayDelivery == "2"} value="2">Delivery</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                {IntradayDelivery == "1" ?
                                                    EntryPriceBA == "at" ? <>
                                                        <div className="col-lg-4">
                                                            <label for="exampleFormControlSelect1" > Exit Time  :  &nbsp; </label>
                                                            <input type="time" id="appt" className="form-control" name="appt"
                                                                min="09:15"
                                                                max="15:15"
                                                                value={selectedTimeExit}
                                                                onChange={handleTimeChangeExit} />
                                                        </div>

                                                        <div className="col-lg-4 col-md-4 col-sm-12">
                                                        </div>
                                                    </> :
                                                        <>
                                                            <div className="col-lg-4">
                                                                <label for="exampleFormControlSelect1" > Exit Time  :  &nbsp; </label>
                                                                <input type="time" id="appt" className="form-control" name="appt"
                                                                    min="09:15"
                                                                    max="15:15"
                                                                    value={selectedTimeExit}
                                                                    onChange={handleTimeChangeExit} />
                                                            </div>

                                                            <div className="col-lg-4 col-md-4 col-sm-12">
                                                                <label for="exampleFormControlSelect1" > No Trade Time : &nbsp; </label>

                                                                <input type="time" id="appt" className="form-control" name="appt"
                                                                    min="09:15"
                                                                    max="15:15"
                                                                    value={selectedTimeNoTrade}
                                                                    onChange={handleTimeChangeNoTrade} />

                                                            </div>
                                                        </>

                                                    : IntradayDelivery == "2" ? <>
                                                        <div className="col-lg-4 col-md-4 col-sm-12">
                                                            <label for="exampleFormControlSelect1" > No Trade Time : &nbsp; </label>
                                                            <input type="time" id="appt" className="form-control" name="appt"
                                                                min="09:15"
                                                                max="15:15"
                                                                value={selectedTimeNoTrade}
                                                                onChange={handleTimeChangeNoTrade} />
                                                        </div>

                                                        <div className="col-lg-4 col-md-4 col-sm-12">
                                                        </div>
                                                    </> :
                                                        ""

                                                }

                                                <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                                    <div className="input-block mb-3 ">
                                                        <label>Wise Type -</label>
                                                        <select className="form-select" onChange={(e) => { selectWiseTypeDropdown(e) }}>
                                                            <option selected value="">Select Wise Type</option>
                                                            <option selected={WiseTypeDropdown == "1"} value="1">Percentage(%)</option>
                                                            <option selected={WiseTypeDropdown == "2"} value="2">Points</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                {
                                                    showhideTargetStoploss == 1 ?
                                                        <>
                                                            <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                                                <div className="input-block mb-3">
                                                                    <label>Target -</label>
                                                                    <input type="number" className="form-control" onChange={(e) => { setTarget1(e.target.value); setTarget1Err("") }} />
                                                                    {target1Err ? <p style={{ color: "#ff8888", fontSize: '10px' }}> *{target1Err}</p> : ''}
                                                                </div>
                                                            </div>

                                                            <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                                                <div className="input-block mb-3">
                                                                    <label>Stop Loss  -</label>
                                                                    <input type="number" className="form-control" onChange={(e) => { setStopLoss(e.target.value); setStopLossErr('') }} />

                                                                </div>
                                                            </div>

                                                            <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                                                <div className="input-block mb-3">
                                                                    <label>Taget/StopLoss Status - -</label>
                                                                    <select className="form-select" aria-label="Default select example" onChange={(e) => { selectTargetStoplossDropdown(e); }}>
                                                                        <option selected value=""> --select-- </option>
                                                                        {target1 == 'not' || target1 == '' ? ""
                                                                            :
                                                                            <>
                                                                                <option value="1">Target</option>
                                                                            </>
                                                                        }

                                                                        {stoploss == 'not' || stoploss == '' ? ""
                                                                            :
                                                                            <>
                                                                                <option value="2">stoploss</option>
                                                                            </>
                                                                        }
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </>
                                                        :
                                                        ""
                                                }


                                                <div className="preview-boxs mt-3">
                                                    <button type="submit" onClick={(e) => GenerateMakeCall(e)} disabled={ForDisabledSubmit} className="btn btn-primary">
                                                        Gnenerate
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                 {/* <div className='card'>
                    <div className='card-body'>
                        
                        <div className="col-lg-12 col-md-12" data-aos="fade-right">
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

                       
                        <div className="col-lg-12 col-md-12" data-aos="fade-left">
                            <div className="card h-100">
                                <div className="card-body">
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

                                            <div className="card-header d-flex justify-content-between align-items-center border-bottom mb-3">
                                                <h5 className="card-title mb-0 w-auto"> <i className="fa-solid fa-landmark pe-2"></i>Below</h5>
                                                <div className="pay-btn text-end w-auto">
                                                   
                                                </div>
                                            </div>


                                            <div className="invoice-total-box border">
                                                <div className="invoice-total-inner">
                                                    <div className="inventory-table">


                                                        <FullDataTable
                                                            keyField="_id"
                                                            TableColumns={columns}
                                                            tableData={aboveBelowRangData.data}
                                                            pagination1={true}
                                                            selectRow={selectRow}
                                                        />
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

                                            <div className="card-header d-flex justify-content-between align-items-center border-bottom mb-3">

                                                <h5 className="card-title mb-0 w-auto"> <i className="fa-solid fa-envelope pe-2"></i>Above</h5>
                                                <div className="pay-btn text-end w-auto">
                                                   
                                                </div>
                                            </div>


                                            <div className="invoice-total-box border">
                                                <div className="invoice-total-inner">
                                                    <div className="inventory-table">
                                                        <FullDataTable
                                                
                                                            keyField="_id"
                                                            TableColumns={columns}
                                                            tableData={aboveBelowRangData.data}
                                                            pagination1={true}
                                                            selectRow={selectRow}
                                                        />
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
                                            <div className="card-header d-flex justify-content-between align-items-center border-bottom mb-3">
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
                                                            TableColumns={columns}
                                                            tableData={aboveBelowRangData.data}
                                                            pagination1={true}
                                                            selectRow={selectRow}

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
                    </div>
                 </div> */}
            </div>

        </div>
    )
}

export default Makecall
