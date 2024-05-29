// import React from 'react'
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Content from "../../../Components/Dashboard/Content/Content";
import FullDataTable from "../../../Components/ExtraComponents/Datatable/BasicDataTable";
import { Get_Tradehisotry } from "../../../ReduxStore/Slice/Users/TradehistorySlice";
import { useDispatch, useSelector } from "react-redux";
import { fa_time, fDateTimeSuffix } from "../../../Utils/Date_formet";
import { Eye, CandlestickChart, Pencil } from "lucide-react";


import DetailsView from "./DetailsView";
import {
  GetAliceTokenAndID,
  CreateSocketSession,
  ConnctSocket,
  GetAccessToken
} from "../../../Service/Alice_Socket";
import {
  ShowColor,
  ShowColor_Compare_two,
} from "../../../Utils/ShowTradeColor";
import $ from "jquery";
import { FunctionForLivePriceCalculation } from "./tradehistoryCalculation";


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

  const [UserDetails, setUserDetails] = useState([]);


  const [rowData, setRowData] = useState("");

  const [SelectServiceIndex, setSelectServiceIndex] = useState("null");
  const [selectStrategy, setSelectStrategy] = useState("null");

  
 // console.log("rowdata :", rowData);

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

  const [startegyFilterData, setStartegyFilterData] = useState({
    loading: true,
    data: [],
  });


 //console.log("startegyFilterData ",startegyFilterData)


  //  GET BROKER DETAILS
  const data = async () => {
    const response = await GetAccessToken({ broker_name: "aliceblue" });
    if (response.status) {
      setUserDetails(response.data[0]);
    }

  };
  useEffect(() => {
    data();
  }, []);




  const getsignals = async (e) => {
    let startDate = getActualDateFormate(fromDate);
    let endDate = getActualDateFormate(toDate);
    e.preventDefault();

    await dispatch(
      Get_Tradehisotry({
        user_id: gotodashboard ? gotodashboard_Details.user_id : user_id,
        startDate: startDate,
        endDate: endDate,
        serviceIndex :SelectServiceIndex,
        selectStrategy:selectStrategy,
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

          setStartegyFilterData({
            loading: false,
            data: response.trade_strategy_filter,
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
        serviceIndex :SelectServiceIndex,
        selectStrategy:selectStrategy,
        token: token,
      })
    )
      .unwrap()
      .then((response) => {
        if (response.status) {

         // console.log("response.trade_strategy_filter ",response.trade_strategy_filter)
          setTradeHistoryData({
            loading: false,
            data: response.data,
          });
          setTradeHistoryData1({
            loading: false,
            data: response.data,
          });

          setStartegyFilterData({
            loading: false,
            data: response.trade_strategy_filter,
          });
        }
        setTradeHistoryData({
          loading: false,
          data: response.data,
        });
      });
  };

  useEffect(() => {
    getsignals11();
  }, [SelectServiceIndex ,selectStrategy ]);

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
    setSelectServiceIndex("null")
    setSelectStrategy("null")
    setTradeHistoryData({
      loading: false,
      data: tradeHistoryData1.data,
    });


  };






  const columns = [
    {
      dataField: "index",
      text: "S.No.",
      // hidden: true,
      formatter: (cell, row, rowIndex) => rowIndex + 1,
    },
    {
      dataField: "createdAt",
      text: "Signals Entry time",
      formatter: (cell, row, rowIndex) => <>{fDateTimeSuffix(row.createdAt)}</>,
    },
    {

      dataField: "exit_dt_date",
      text: "Signals Exit time",
      formatter: (cell, row, rowIndex) => <>{row.exit_dt_date ? fDateTimeSuffix(row.exit_dt_date):"-"}</>,
      
     },



    // {
    //   dataField: "closeprice",
    //   text: "Close Price",
    //   formatter: (cell, row, rowIndex) => (
    //     <div>
    //       <span className={`ClosePrice_${row.token}`}></span>
    //     </div>
    //   ),
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
      dataField: "2",
      text: "Entry Type",
      formatter: (cell, row, rowIndex) => (
        <div>
          <span>{row.entry_type === "LE"?"BUY ENTRY":"SELL ENTRY"}</span>
        </div>
      ),
    },
    // {
    //   dataField: "entry_qty",
    //   text: "Entry Qty",
    //   formatter: (cell, row, rowIndex) =>  (
    //      <span className="text">{cell !== "" ? parseInt(row.entry_qty_percent) : "-"}</span> 
    //    )
   
    // },

    {
      dataField: "entry_qty",
      text: "Entry Qty",
      formatter: (cell, row, rowIndex) => {
        return (
          <div>
            <span className="text">{cell !== "" ? parseInt(row.entry_qty_percent) : "-"}</span>


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



    // {
    //   dataField: "exit_qty",
    //   text: "Exit Qty",
    //   formatter: (cell, row, rowIndex) => (
    //     <span className="text">{cell !== "" ? parseInt(row.exit_qty_percent) : "-"}</span>
    //    // <span className="text">{cell !== "" ? parseInt(cell) : "-"}</span>
    //   ),
    // },

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
      dataField: "entry_price",
      text: "Entry Price",
      formatter: (cell, row, rowIndex) => (
        <div>{cell !== "" ? parseFloat(cell).toFixed(2) : "-"}
        </div>
      ),
    },
    {
      dataField: "exit_price",
      text: "Exit Price",
      formatter: (cell, row, rowIndex) => (
        <div>{cell !== "" ? parseFloat(cell).toFixed(2) : "-"}</div>
      ),
    },

    // {
    //   dataField: "Action",
    //   text: "Realised",
    //   formatter: (cell, row, rowIndex) => {
    //     return (
    //       <div>
    //         <span className={`fw-bold show_rpl_${row.token}_${row._id}`}></span>
    //         <span className={`d-none entry_qty_${row.token}_${row._id}`}>
    //           {row.entry_qty_percent}
    //         </span>
    //         <span className={`d-none exit_qty_${row.token}_${row._id}`}>
    //           {row.exit_qty_percent}
    //         </span>
    //         <span className={`d-none exit_price_${row.token}_${row._id}`}>
    //           {row.exit_price}
    //         </span>
    //         <span className={`d-none entry_price_${row.token}_${row._id}`}>
    //           {row.entry_price}
    //         </span>
    //         <span className={`d-none entry_type_${row.token}_${row._id}`}>
    //           {row.entry_type}
    //         </span>
    //         <span className={`d-none exit_type_${row.token}_${row._id}`}>
    //           {row.exit_type}
    //         </span>
    //         <span className={`d-none strategy_${row.token}_${row._id}`}>
    //           {row.strategy}
    //         </span>
    //         <span className={`d-none _id_${row.token}_${row._id}`}>
    //           {row._id}
    //         </span>
    //       </div>
    //     );
    //   },
    // },


    // {
    //   dataField: "UPL",
    //   text: "Un-Realised",
    //   formatter: (cell, row, rowIndex) => (
    //     <div>
    //       <span className={`fw-bold UPL_${row.token}_${row._id}`}></span>


    //     </div>
    //   ),
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
    await FunctionForLivePriceCalculation(CreatechannelList, UserDetails, setSocketState, tradeHistoryData.data &&
      tradeHistoryData.data)

  };



  useEffect(() => {
    ShowLivePrice();
  }, [tradeHistoryData.data, SocketState, UserDetails]);

  
   //console.log("tradeHistoryData.data",tradeHistoryData.data)

  let total=0;
  tradeHistoryData.data &&
    tradeHistoryData.data?.map((item) => {
      CreatechannelList += `${item.exchange}|${item.token}#`;
      console.log("item" ,item)

       


      // if(parseInt(item.exit_qty) == parseInt(item.entry_qty) && item.entry_price!= '' && item.exit_price){
      // total += (parseFloat(item.exit_price) - parseFloat(item.entry_price)) * parseInt(item.exit_qty_percent);
      // }

      if(parseInt(item.exit_qty) == parseInt(item.entry_qty) && item.entry_price!= '' && item.exit_price){
      
     
        if(item.entry_type ==="LE"){
         // console.log("item iFF" ,item._id , " total ",total)
          let total1 = (parseFloat(item.exit_price) - parseFloat(item.entry_price)) * parseInt(item.exit_qty_percent);
          if(!isNaN(total1)){
            total += total1
          }
         
        }else{
         let total1 = (parseFloat(item.entry_price) - parseFloat(item.exit_price)) * parseInt(item.exit_qty_percent);
         // console.log("item ELSE" ,item._id , " total ",total)
          if(!isNaN(total1)){
            total += total1
          }
  
        }
        }
    });

  return (
    <>
      <Content Page_title="Trade History" button_status={false} button_status1={true}>
        {gotodashboard === "true" || gotodashboard === true ? (
          <>
            <div className="row d-flex  align-items-center justify-content-start">
              <div className="col-lg-3 d-none">
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
              <div className="col-lg-3 d-none">
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


            
            {/* <div className="col-lg-3 px-1">
            <div class="mb-3">
              <label for="select" class="form-label">
                Index Symbol
              </label>
              <select
                class="default-select wide form-control"
                aria-label="Default select example"
                id="select"
                onChange={(e) => setSelectServiceIndex(e.target.value)}
                value={SelectServiceIndex}
              >
                <option value="null" selected>All</option>
                <option value="BANKNIFTY" selected>BANKNIFTY</option>
                <option value="NIFTY" selected>NIFTY</option>
                <option value="FINNIFTY" selected>FINNIFTY</option>
              </select>
            </div>
           </div>

           <div className="col-lg-3 px-1">
            <div class="mb-3">
              <label for="select" class="form-label">
                Strategy
              </label>
              <select
                class="default-select wide form-control"
                aria-label="Default select example"
                id="select"
                onChange={(e) => setSelectStrategy(e.target.value)}
                value={selectStrategy}
              >
                <option value="null" selected>All</option>
                {startegyFilterData.data &&
                  startegyFilterData.data.map((item) => {
                    // return (
                    //   <option className="mt-1" value={item.fullname}>
                    //     {item.fullname}
                    //   </option>
                    // );

                    return (
                      <option className="mt-1" value={item}>
                        {item}
                      </option>
                    );

                  })}
              </select>
            </div>
          </div> */}



              <div className="col-lg-3 d-flex">
                {/* <button
                  className="btn btn-primary mx-2"
                  onClick={(e) => getsignals(e)}
                >
                  Search
                </button> */}
                {/* <button
                  className="btn btn-primary"
                  onClick={(e) => ResetDate(e)}
                >
                  Reset
                </button> */}
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

<div className="table-responsive">


{tradeHistoryData.data.length>0 ? 

total >= 0 ? 
  <h4 >Total Realised P/L : <span style={{color:"green"}}> {total.toFixed(2)}</span> </h4>  : 
  <h4 >Total Realised P/L : <span style={{  color:"red"}}> {total.toFixed(2)}</span> </h4>  : ""

}

 
</div>


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