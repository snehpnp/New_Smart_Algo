import React, { useEffect, useState } from 'react'
import Theme_Content from "../../../Components/Dashboard/Content/Theme_Content"
import Loader from '../../../Utils/Loader'
import FullDataTable from "../../../Components/ExtraComponents/Datatable/FullDataTable"
import { useDispatch, useSelector } from "react-redux";
import axios from "axios"
import { Get_Option_Symbols_Expiry, Get_Option_Symbols, Get_Option_All_Round_token } from '../../../ReduxStore/Slice/Common/Option_Chain_Slice';
import { get_thre_digit_month } from "../../../Utils/Date_formet";
import { Get_All_Service_for_Client } from "../../../ReduxStore/Slice/Common/commoSlice";
import { CreateSocketSession, ConnctSocket, GetAccessToken } from "../../../Service/Alice_Socket";
import $ from "jquery";




const HelpCenter = () => {

    const dispatch = useDispatch()


    const user_id = JSON.parse(localStorage.getItem("user_details")).user_id
    const token = JSON.parse(localStorage.getItem("user_details")).token


    const [first, setfirst] = useState('all')

    const [All_Symbols, set_All_Symbols] = useState({
        loading: false,
        data: []
    });

    const [All_Symbols_Expiry, set_All_Symbols_Expiry] = useState({
        loading: false,
        data: []
    });

    const [getAllStrategyName, setAllStrategyName] = useState({
        loading: true,
        data: [],
    });


    const [OptionChainData, setOptionChainData] = useState({
        loading: true,
        data: [],
    });

    const [TokenSymbolChain, setTokenSymbolChain] = useState('')
    const [UserDetails, setUserDetails] = useState([]);



    console.log("OptionChainData", OptionChainData)

    const [symbol, setSymbol] = useState('')
    const [expiry, setExpiry] = useState('')




    const columns = [
        {
            dataField: 'BUY/Sell',
            text: 'BUY/SELL',
            formatter: (cell, row) => (
                    <div class="btn-group">
                        <button class="btn btn-default btn-sm">Buy</button>
                        <button class="btn btn-default btn-sm">Sell</button>
                    </div>
            ),
        },
        {
            dataField: 'CALL/LP',
            text: 'CALL/LP',
            formatter: (cell, row, rowIndex) => (
                <div>
                    <span className={`Call_Price_${row.call_token}`}></span>
                </div>
            ),
        },
        {
            dataField: 'strike_price',
            text: 'STRIKE PRICE'
        },
        {
            dataField: 'PUT/LP',
            text: 'PUT/LP',
            formatter: (cell, row, rowIndex) => (
                <div>
                    <span className={`Put_Price_${row.put_token}`}></span>
                </div>
            ),
        },
        {
            dataField: 'BUY/Sell',
            text: 'BUY/SELL',
            formatter: (cell, row) => (
                <>
                    <div class="btn-group">
                        <button class="btn btn-default btn-sm">Buy</button>
                        <button class="btn btn-default btn-sm">Sell</button>
                    </div>
                </>
            ),
        },
    ];


    // --------------- FOR GET OPTIONS SYMBOLS -----------------------

    const symbols = async () => {

        await dispatch(Get_Option_Symbols({ req: '', token: token })).unwrap()
            .then((response) => {
                if (response.status) {
                    set_All_Symbols({
                        loading: false,
                        data: response.data
                    });
                }
            })
    }
    useEffect(() => {
        symbols()
        GetAllStrategyName();
    }, [])



    // --------------- FOR GET OPTIONS SYMBOLS -----------------------



    // --------------- FOR GET OPTIONS SYMBOLS -----------------------

    const GetExpiry = async (value) => {
        if (symbol) {
            await dispatch(Get_Option_Symbols_Expiry({ req: symbol, token: token })).unwrap()
                .then((response) => {
                    if (response.status) {
                        set_All_Symbols_Expiry({
                            loading: false,
                            data: response.data
                        });
                    }
                })
        }
    }
    useEffect(() => {
        GetExpiry()
    }, [symbol])

    // --------------- FOR GET OPTIONS SYMBOLS -----------------------


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

    // --------------- FOR GET OPTIONS SYMBOLS -----------------------


    // --------------- FOR GET OPTIONS SYMBOLS -----------------------

    const getAllRoundToken = async () => {

        if (expiry) {

            const data = {
                // expiry: "26102023",
                // symbol: "NIFTY"
                expiry: expiry,
                symbol: symbol
            };

            await dispatch(Get_Option_All_Round_token(data, token))
                .unwrap()
                .then((response) => {
                    if (response.status) {
                        setOptionChainData({
                            loading: false,
                            data: response.data,
                        });
                        setTokenSymbolChain(response.channellist)
                    }
                });
        }
    }


    useEffect(() => {
        getAllRoundToken()
    }, [expiry])


    // --------------- FOR GET OPTIONS SYMBOLS -----------------------


    //  SHOW lIVE PRICE
    const ShowLivePrice = async () => {
        let type = { loginType: "API" };
        let channelList = TokenSymbolChain && TokenSymbolChain;

        // const res = await CreateSocketSession(type);

        if (UserDetails.user_id !== undefined && UserDetails.access_token !== undefined) {


            const res = await CreateSocketSession(type, UserDetails.user_id, UserDetails.access_token);

            if (res.data.stat) {
                const handleResponse = async (response) => {

                    console.log("response", response)
                    var live_price = response.lp === undefined ? "" : response.lp;

                    // UPL_
                    $(".Call_Price_" + response.tk).html(response.lp);
                    $(".Put_Price_" + response.tk).html(response.lp);





                    // }
                };
                await ConnctSocket(handleResponse, channelList, UserDetails.user_id, UserDetails.access_token).then((res) => { });
            }
        }

    };



    useEffect(() => {
        ShowLivePrice();
    }, [UserDetails, TokenSymbolChain]);





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

    return (
        <>
            {



                All_Symbols.loading ? <Loader /> :
                    <>
                        <Theme_Content Page_title="Help Center" button_status={false}>

                            <div className="row d-flex">
                                <div className="col-md-2 text-secondary">
                                    <label className="text-secondary"
                                        style={{ fontWeight: "bold", color: "black" }}
                                    >SYMBOLS</label>
                                    <select
                                        name="symbols_filter"
                                        className="default-select wide form-control spacing"
                                        onChange={(e) => {
                                            setSymbol(e.target.value)
                                        }}
                                    // value={Symbol}
                                    >
                                        <option value="" >Select Stock Name</option>
                                        {All_Symbols.data && All_Symbols.data.map((item) => {
                                            return <option value={item.symbol}>{item.symbol}</option>
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
                                    <select className="default-select wide form-control" name="expiry_date"
                                        onChange={(e) => {
                                            setExpiry(e.target.value)
                                        }}
                                    >
                                        <option value="" >Select Expiry</option>
                                        {All_Symbols_Expiry.data && All_Symbols_Expiry.data.map((item) => {
                                            return <option value={item.uniqueExpiryValues}>{get_thre_digit_month(item.expiryDate)}</option>
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
                                    <select className="default-select wide form-control" name="strategyname">

                                        <option value="STRAT1">Select Strategy</option>
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
                                <div className="col-md-2 text-secondary ">
                                    <label
                                        className="text-secondary"
                                        style={{ fontWeight: "bold", color: "black" }}
                                    > Price
                                    </label>
                                    <input type="number" className="new-input-control form-control" />
                                </div>
                                <div className="col-md-4 d-flex justify-content-end align-items-center text-secondary ">
                                    <button
                                        className="btn btn-primary me-2"
                                    // onClick={(e) => GetTradhistory(e)}
                                    >
                                        Execute Trade
                                    </button>
                                </div>
                            </div>


                            <div className='option-chain mt-2'>
                                <FullDataTable TableColumns={columns} tableData={OptionChainData.data} pagination1={true}></FullDataTable>
                            </div>
                        </Theme_Content>
                    </>
            }



        </ >
    )

}


export default HelpCenter