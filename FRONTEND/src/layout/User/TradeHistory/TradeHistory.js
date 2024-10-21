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
import DatePicker from "react-datepicker";
import Loader from "../../../Utils/Loader";
import "react-datepicker/dist/react-datepicker.css";

const TradeHistory = () => {
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("user_details")).token;
  const user_id = JSON.parse(localStorage.getItem("user_details")).user_id;
  const gotodashboard = JSON.parse(localStorage.getItem("gotodashboard"));
  const gotodashboard_Details = JSON.parse(localStorage.getItem('user_details_goTo'));
  const [showModal, setshowModal] = useState(false);
  const [SocketState, setSocketState] = useState("null");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [UserDetails, setUserDetails] = useState([]);
  const [rowData, setRowData] = useState("");
  const [SelectServiceIndex, setSelectServiceIndex] = useState("null");
  const [selectStrategy, setSelectStrategy] = useState("null");
  const [tradeHistoryData, setTradeHistoryData] = useState({ loading: true, data: [] });
  const [getType, setType] = useState("Strategy");
  const USerStartDate = useSelector((state) => state.CommonSlice?.profiledata?.data?.CreateDate);
  const formattedStartDate = USerStartDate ? new Date(USerStartDate).toISOString().split('T')[0] : "";


  const handleFromDateChange = (data) => {
    setFromDate(data);
  };

  const handleToDateChange = (data) => {
    setToDate(data);
  };


  const data = async () => {
    const response = await GetAccessToken({ broker_name: "aliceblue" });
    if (response.status) {
      setUserDetails(response.data[0]);
    }
  };


  const getsignals11 = async () => {
    let abc = new Date();

    let startDate1 = new Date(abc);
    startDate1.setHours(0, 1, 0, 0);

    let endDate1 = new Date(abc);
    endDate1.setHours(23, 59, 59, 999);

    const formattedFromDate = fromDate ? fromDate : startDate1;
    const formattedToDate = toDate ? toDate.setHours(23, 59, 59, 999) : endDate1;

    await dispatch(
      Get_Tradehisotry({
        user_id: gotodashboard ? gotodashboard_Details.user_id : user_id,
        startDate: formattedFromDate,
        endDate: formattedToDate,
        serviceIndex: SelectServiceIndex,
        selectStrategy: selectStrategy,
        token: token,
        getType: getType,
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
  };


  const columns = [
    {
      dataField: "index",
      text: "S.No.",
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
      formatter: (cell, row) => (
        <div>
          <span>{row.entry_type === "LE" ? "BUY ENTRY" : "SELL ENTRY"}</span>
        </div>
      ),
    },
    {
      dataField: "entry_qty",
      text: "Entry Qty",
      formatter: (cell, row) => {
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
      formatter: (cell) => (
        <div>{cell !== "" ? parseFloat(cell).toFixed(2) : "-"}
        </div>
      ),
    },
    {
      dataField: "exit_price",
      text: "Exit Price",
      formatter: (cell) => (
        <div>{cell !== "" ? parseFloat(cell).toFixed(2) : "-"}</div>
      ),
    },

    {
      dataField: "TPL",
      text: "Total",
      formatter: (cell, row) => (
        <div>
          <span className={`fw-bold  TPL_${row.token}_${row._id}`}></span>
        </div>
      ),
    },

    {
      dataField: "",
      text: "Details View",
      formatter: (cell, row) => (
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




  const ShowLivePrice = async () => {
    await FunctionForLivePriceCalculation(CreatechannelList, UserDetails, setSocketState, tradeHistoryData.data &&
      tradeHistoryData.data)
  };


  const ResetAllData = () => {
    setFromDate("");
    setToDate("");
    setType("Strategy");
  };


  useEffect(() => {
    data();
  }, []);

  useEffect(() => {
    getsignals11();
  }, [fromDate, toDate, getType]);

  useEffect(() => {
    ShowLivePrice();
  }, [tradeHistoryData.data, SocketState, UserDetails]);


  // ========================================================================
  let total = 0;
  tradeHistoryData.data &&
    tradeHistoryData.data?.map((item) => {
      CreatechannelList += `${item.exchange}|${item.token}#`;

      if (parseInt(item.exit_qty_percent) == parseInt(item.exit_qty_percent) && item.entry_price != '' && item.exit_price) {

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
    <Content Page_title="Trade History" button_status={false} button_status1={true}>

      <div className="row d-flex  align-items-center justify-content-start">
        {gotodashboard &&
          <>
            <div className="col-lg-2 px-1">
              <div className="form-check custom-checkbox mb-3 ps-0">
                <label className="col-lg-12" htmlFor="fromdate">
                  From Date
                </label>

                <DatePicker
                  selected={fromDate}
                  onChange={(date) => handleFromDateChange(date)}
                  minDate={formattedStartDate}
                  maxDate={new Date()}

                  placeholderText="Select a date"
                  dateFormat="yyyy-MM-dd"
                  className="form-control"
                  id="fromdate"
                />
              </div>
            </div>

            <div className="col-lg-2  px-1">
              <div className="form-check custom-checkbox mb-3 ps-0">
                <label className="col-lg-12" htmlFor="endDate">
                  To Date
                </label>


                <DatePicker
                  selected={toDate}
                  onChange={(date) => handleToDateChange(date)}
                  minDate={fromDate ? fromDate : formattedStartDate}
                  maxDate={new Date()}
                  placeholderText="Select a date"
                  dateFormat="yyyy-MM-dd"
                  className="form-control"
                  id="fromdate"
                />

              </div>
            </div>
          </>
        }
        <div className="col-lg-2 px-1">
          <div className="mb-3">
            <label for="select" className="form-label">
              Type
            </label>
            <select
              className="default-select wide form-control"
              aria-label="Default select example"
              id="select"
              onChange={(e) => setType(e.target.value)}
              value={getType}
            >
              <option value="Strategy" selected>Starategy</option>z
              <option value="Trade" selected>Trade</option>

            </select>
          </div>
        </div>


        <div className="col-lg-2  px-1">
          <div className="mt-2">
            <button className="btn btn-primary" onClick={(e) => ResetAllData(e)}>
              Reset
            </button>
          </div>
        </div>
      </div>


      <div className="table-responsive">
        {tradeHistoryData.data && tradeHistoryData.data.length > 0 ?
          total >= 0 ?
            <h3 ><b>Total Realised P/L </b>:<b> <span style={{ color: "green" }}> {total.toFixed(2)}</span> </b></h3> :
            <h3 ><b>Total Realised P/L </b>:<b> <span style={{ color: "red" }}> {total.toFixed(2)}</span> </b></h3> : ""
        }
      </div>


      {tradeHistoryData && tradeHistoryData.loading ? <Loader /> :
        <FullDataTable
          TableColumns={columns}
          tableData={tradeHistoryData.data}
        />}



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
  );
};

export default TradeHistory;