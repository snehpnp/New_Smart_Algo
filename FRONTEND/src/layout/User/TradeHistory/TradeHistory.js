// import React from 'react'
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Content from "../../../Components/Dashboard/Content/Content";
import FullDataTable from "../../../Components/ExtraComponents/Datatable/BasicDataTable";
import { Get_Tradehisotry } from "../../../ReduxStore/Slice/Users/TradehistorySlice";
import { useDispatch, useSelector } from "react-redux";
import { fDateTimeSuffix } from "../../../Utils/Date_formet";
import { Eye, } from "lucide-react";
import DetailsView from "./DetailsView";
import { GetAccessToken } from "../../../Service/Alice_Socket";
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
  const [tradeHistoryData, setTradeHistoryData] = useState({ loading: true, data: [] });
  const [tradeHistoryData1, setTradeHistoryData1] = useState({ loading: true, data: [] });
  const [startegyFilterData, setStartegyFilterData] = useState({ loading: true, data: [] });

  const handleFromDateChange = (e) => {
    setFromDate(e.target.value);
  };

  const handleToDateChange = (e) => {
    setToDate(e.target.value);

    setDisableFromDate(true);
  };

  //  GET BROKER DETAILS
  const data = async () => {
    const response = await GetAccessToken({ broker_name: "aliceblue" });
    if (response.status) {
      setUserDetails(response.data[0]);
    }

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
        serviceIndex: SelectServiceIndex,
        selectStrategy: selectStrategy,
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
      formatter: (cell) => <>{cell ? fDateTimeSuffix(cell) : "-"}</>,
    },
    {

      dataField: "exit_dt_date",
      text: "Signals Exit time",
      formatter: (cell) => <>{cell ? fDateTimeSuffix(cell) : "-"}</>,

    },
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
          <span>{row.entry_type === "LE" ? "BUY ENTRY" : "SELL ENTRY"}</span>
        </div>
      ),
    },
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
    data();
  }, []);

  useEffect(() => {
    getsignals11();
  }, [SelectServiceIndex, selectStrategy]);

  useEffect(() => {
    ShowLivePrice();
  }, [tradeHistoryData.data, SocketState, UserDetails]);


  let total = 0;
  tradeHistoryData.data &&
    tradeHistoryData.data?.map((item) => {
      CreatechannelList += `${item.exchange}|${item.token}#`;

      if (parseInt(item.exit_qty) == parseInt(item.entry_qty) && item.entry_price != '' && item.exit_price) {

        if (item.entry_type === "LE") {
          let total1 = (parseFloat(item.exit_price) - parseFloat(item.entry_price)) * parseInt(item.exit_qty_percent);
          if (!isNaN(total1)) {
            total += total1
          }
        } else {
          let total1 = (parseFloat(item.entry_price) - parseFloat(item.exit_price)) * parseInt(item.exit_qty_percent);
          if (!isNaN(total1)) {
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
                    min={fromDate}
                  />
                </div>
              </div>

              <div className="col-lg-3 d-flex">

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
              {tradeHistoryData.data.length > 0 ?
                total >= 0 ?
                  <h4 >Total Realised P/L : <span style={{ color: "green" }}> {total.toFixed(2)}</span> </h4> :
                  <h4 >Total Realised P/L : <span style={{ color: "red" }}> {total.toFixed(2)}</span> </h4> : ""
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
        <br />
        <br />
        <h6><b>THIS RESULTS IS VALID FOR TODAY ONLY, WE DO NOT DIRECTLY OR INDIRECTLY MAKE ANY REFERENCE TO THE PAST OR EXPECTED FUTURE RETURN/PERFORMANCE OF THE ALGORITHM.</b></h6>
        <br />
        <h6><b>सभी प्रतिभूतियां एल्गो ट्रेडिंग सिस्टम बाजार जोखिमों के अधीन हैं और इस बात का कोई आश्वासन नहीं दिया जा सकता है कि उपयोगकर्ता के उद्देश्यों को आज के प्रदर्शन के आधार पर प्राप्त किया जाएगा। यह परिणाम केवल आज के लिए मान्य है।</b></h6>
      </Content>
    </>
  );
};

export default TradeHistory;