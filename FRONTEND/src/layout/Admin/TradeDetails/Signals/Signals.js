import React, { useEffect, useState } from "react";
import Content from "../../../../Components/Dashboard/Content/Content";
import FullDataTable from "../../../../Components/ExtraComponents/Datatable/FullDataTable";
import Loader from "../../../../Utils/Loader";
import {  fDateTimeSuffix } from "../../../../Utils/Date_formet";
import { Get_All_Signals } from "../../../../ReduxStore/Slice/Admin/SignalsSlice";
import { useDispatch} from "react-redux";
import { Get_All_Service_for_Client } from "../../../../ReduxStore/Slice/Common/commoSlice";


const Signals = () => {
  const dispatch = useDispatch();

  const token = JSON.parse(localStorage.getItem("user_details")).token;

  const [DateFilter, setDateFilter] = useState();
  const [DateArray, setDateArray] = useState([]);

  const [ForGetCSV, setForGetCSV] = useState([])

  //  For search filter
  const [originalData, setOriginalData] = useState([]);
  const [searchInput, setSearchInput] = useState("");



  //  For Strategy Filter
  const [StrategyClientStatus, setStrategyClientStatus] = useState("null");
  const [getAllStrategyName, setAllStrategyName] = useState({ loading: true, data: [], });






  const columns = [
    {
      dataField: "index",
      text: "S.No.",
      formatter: (cell, row, rowIndex) => rowIndex + 1,
      sort: true,
    },
    {
      dataField: "createdAt",
      text: "Signals Time",
      formatter: (cell, row, rowIndex) => <div>{fDateTimeSuffix(cell)}</div>,
      sort: true,

    },
    {
      dataField: "type",
      text: "Type",
      sort: true,

    },
    {
      dataField: "trade_symbol",
      text: "Symbol",
      sort: true,

    },
    {
      dataField: "price",
      text: "Price",
      sort: true,

    },

    {
      dataField: "strategy",
      text: "Strategy",
      sort: true,

    },
    {
      dataField: "TradeType",
      text: "Trade  Type",
      sort: true,

    },
  ];

  const [SignalsData, getSignalsData] = useState({
    loading: true,
    data: [],
  });

  const getsignals = async () => {
    let csvarr = []


    // await dispatch(Get_All_Signals({ startDate: '2023/10/14', token: token }))
    await dispatch(Get_All_Signals({ startDate: DateFilter, token: token }))
      .unwrap()
      .then((response) => {

        
        if (response.status) {


          response.data.map((data) => {
            return csvarr.push({
              "Signal Time": fDateTimeSuffix(data.createdAt),
              "type": data.type,
              "Trading Symbol": data.trade_symbol,
              "Price": data.price,
              "Strategy": data.strategy,
            })

          })
          setForGetCSV(csvarr)

          setOriginalData(response.data);

          getSignalsData({
            loading: false,
            data: response.data,
          });
        } else {
          getSignalsData({
            loading: false,
            data: response.data,
          });
        }
      });
  };
  useEffect(() => {
    getsignals();
  }, [DateFilter]);

  var dateArray = [];
  const dateArr = () => {
    for (let i = 0; i < 3; i++) {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() - i);
      const day = currentDate.getDate();
      const month = currentDate.getMonth() + 1; // Months are zero-based, so add 1
      const year = currentDate.getFullYear();
      const formattedDate = `${year}/${month}/${day}`;
      dateArray.push(formattedDate);
    }
    setDateArray(dateArray);
    setDateFilter(dateArray[0]);
  };
  useEffect(() => {
    dateArr();
  }, []);


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



  // MANAGE MULTIFILTER
 
  useEffect(() => {
    const filteredData = originalData.filter((item) => {

      const filter2Match = StrategyClientStatus == "null" || item.strategy.includes(StrategyClientStatus)
 
      const searchTermMatch =
        searchInput === '' ||
        item.strategy.toLowerCase().includes(searchInput.toLowerCase())
        ||
        item.TradeType.toLowerCase().includes(searchInput.toLowerCase()) ||
        item.trade_symbol.toLowerCase().includes(searchInput.toLowerCase()) ||
        item.type.toLowerCase().includes(searchInput.toLowerCase())

      return filter2Match && searchTermMatch
    });

    // Set the filtered data to the state or variable you want to use
    getSignalsData({
      loading: false,
      data: searchInput || StrategyClientStatus !== "null" ? filteredData : originalData,
    });
  }, [searchInput, StrategyClientStatus, originalData]);

  return (
    <>
      {SignalsData.loading ? (
        <Loader />
      ) : (
        <>
          <Content Page_title="All Signals" button_status={false}
            show_csv_button={true} csv_data={ForGetCSV} csv_title="Signals"

          >
            <div className="d-flex">
              <div className="col-lg-6">
                <div className="mb-3 row d-flex">
                  <div className="col-lg-6">
                    <div class="mb-3">
                      <label for="exampleFormControlInput1" class="form-label">
                        Search Something Here
                      </label>
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        class="form-control"
                        id="exampleFormControlInput1"
                      />
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <label className="col-lg-12" htmlFor="validationCustom05">
                      Select Strategy
                    </label>
                    <select
                      class="default-select wide form-control"
                      aria-label="Default select example"
                      id="select"
                      onChange={(e) => setStrategyClientStatus(e.target.value)}
                      value={StrategyClientStatus}
                    >
                      <option value="null">All</option>
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

              </div>
            </div>

            {SignalsData.data && SignalsData.data.length === 0 ? (
              // 'No data found'
              <FullDataTable
                TableColumns={columns}
                tableData={SignalsData.data}
              />
            ) : (
              <>
                <FullDataTable
                  TableColumns={columns}
                  tableData={SignalsData.data}
                />
              </>
            )}
          </Content>
        </>
      )}
    </>
  );
};

export default Signals;
