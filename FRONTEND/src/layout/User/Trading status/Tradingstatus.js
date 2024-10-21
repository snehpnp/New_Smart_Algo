import React, { useEffect, useState } from "react";
import Content from "../../../Components/Dashboard/Content/Content";
import Loader from "../../../Utils/Loader";
import FullDataTable from "../../../Components/ExtraComponents/Datatable/FullDataTable";
import { Get_All_TRADINGSTATUS_USER, user_activity_logs } from "../../../ReduxStore/Slice/Users/TradingStatusSlice";
import { useDispatch } from "react-redux";
import { fDateTimeSuffix } from "../../../Utils/Date_formet";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

const TradingStatus = () => {
  const dispatch = useDispatch();
  const user_details = JSON.parse(localStorage.getItem("user_details"));
  const gotodashboard = JSON.parse(localStorage.getItem('user_details_goTo'));
  const isgotodashboard = JSON.parse(localStorage.getItem('gotodashboard'));
  const [first, setFirst] = useState("all");
  const [first1, setFirst1] = useState("all");
  const [dateArray, setDateArray] = useState([]);
  const [getAllUserTradingStatus, setAllUserTradingStatus] = useState({ loading: true, data: [] });
  const [userLogs, setUserLogs] = useState({ loading: true, data: [] });

  let req = {
    user_Id: isgotodashboard ? gotodashboard.user_id : user_details.user_id,
  };

  const fetchData1 = async () => {
    await dispatch(Get_All_TRADINGSTATUS_USER(req))
      .unwrap()
      .then((response) => {
        if (response.status) {
          const data = first === "all" ? response.data : response.data.filter(item => item.createdAt.split("T")[0] === first);
          setAllUserTradingStatus({
            loading: false,
            data: data,
          });
        } else {
          setAllUserTradingStatus({
            loading: false,
            data: [],
          });
        }
      });
  };

  const fetchData3 = async () => {
    await dispatch(user_activity_logs(req))
      .unwrap()
      .then((response) => {
        if (response.status) {
          const data = first1 === "all" 
            ? response.data 
            : response.data.filter(item => {
                if (item.createdAt) {
                  // Format the createdAt date and first1 to the same string format for comparison
                  const createdAtDate = new Date(item.createdAt).toISOString().split('T')[0]; // YYYY-MM-DD format
                  return createdAtDate === first1;
                }
                return false; // If createdAt is not available, exclude the item
              });
          
          setUserLogs({
            loading: false,
            data: data,
          });
        } else {
          setUserLogs({
            loading: false,
            data: [],
          });
        }
        
      });
  };

  useEffect(() => {
    const generateDateArray = () => {
      let dates = [];
      let count = 0;
      let i = 0;
      
      while (count < 5) {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - i);
        const dayOfWeek = currentDate.getDay(); 
    
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          const day = currentDate.getDate() < 10 ? `0${currentDate.getDate()}` : currentDate.getDate();
          const month = currentDate.getMonth() + 1 < 10 ? `0${currentDate.getMonth() + 1}` : currentDate.getMonth() + 1;
          const year = currentDate.getFullYear();
          const formattedDate = `${year}-${month}-${day}`;
          dates.push(formattedDate);
          count++;
        }
        
        i++; 
      }
    
      setDateArray(dates);
      setFirst(dates[0]);
      setFirst1(dates[0]);
    };
    
    generateDateArray();
    
  }, []);

  useEffect(() => {
    fetchData1();
  }, [first, dispatch]);

  useEffect(() => {
    fetchData3();
  }, [first1, dispatch]);

  const columns = [
    {
      dataField: "index",
      text: "SR. No.",
      formatter: (cell, row, rowIndex) => rowIndex + 1,
    },
    {
      dataField: "createdAt",
      text: "Time",
      formatter: (cell, row, rowIndex) => fDateTimeSuffix(cell),
    },
    {
      dataField: "login_status",
      text: "login status",
      formatter: (cell, row) => (
        <div>
          <span data-toggle="tooltip" data-placement="top" title="Delete">
            {row.login_status == null ? row.trading_status : row.login_status}
          </span>
        </div>
      ),
    },
    {
      dataField: "role",
      text: "role",
    },
    {
      dataField: "system_ip",
      text: "system_ip",
    },
  ];

  const columns1 = [
    {
      dataField: "index",
      text: "SR. No.",
      formatter: (cell, row, rowIndex) => rowIndex + 1,
    },
    {
      dataField: "createdAt",
      text: "Time",
      formatter: (cell, row, rowIndex) => fDateTimeSuffix(cell),
    },
    {
      dataField: "Strategy",
      text: "Strategy / Group",
      formatter: (cell, row) => <div>{cell ? cell : "-"}</div>,
    },
    {
      dataField: "message",
      text: "Update",
      formatter: (cell, row) => <div>{cell ? cell : "-"}</div>,
    },
    {
      dataField: "quantity",
      text: "Qty",
      formatter: (cell, row) => <div>{cell ? cell : "-"}</div>,
    },
    {
      dataField: "system_ip",
      text: "IP",
    },
    {
      dataField: "device",
      text: "Device",
    },
    {
      dataField: "role",
      text: "Update By",
    },
  ];

  return (
    <Content Page_title="Trading Status" button_status={false}>
      <Tabs defaultActiveKey="home" id="uncontrolled-tab-example" className="mb-3">
        <Tab eventKey="home" title="Panel Trading Status">
          <div className="col-lg-6">
            <div className="mb-3 row">
              <div className="col-lg-7">
                <select
                  className="default-select wide form-control"
                  id="validationCustom05"
                  onChange={(e) => setFirst(e.target.value)}
                >
                  {dateArray.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          {getAllUserTradingStatus.loading ? (
            <Loader />
          ) : (
            <FullDataTable TableColumns={columns} tableData={getAllUserTradingStatus.data} />
          )}
        </Tab>
        <Tab eventKey="profile" title="Update Status">
          <div className="col-lg-6">
            <div className="mb-3 row">
              <div className="col-lg-7">
                <select
                  className="default-select wide form-control"
                  id="validationCustom05"
                  onChange={(e) => setFirst1(e.target.value)}
                >
                  {dateArray.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          {userLogs.loading ? (
            <Loader />
          ) : (
            <FullDataTable TableColumns={columns1} tableData={userLogs.data} />
          )}
        </Tab>
      </Tabs>
    </Content>
  );
};

export default TradingStatus;
