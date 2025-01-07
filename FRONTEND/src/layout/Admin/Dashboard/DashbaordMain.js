/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from "react";
import Dashboard1 from "./Dashboard1";
import Dashboard2 from "./Dashboard2";
import Dashboard3 from "./Dashboard3";
import Dashboard4 from "./Dashboard4";
import Dashboard5 from "./Dashboard5";
import Dashboard6 from "./Dashboard6";
import Dashboard7 from "./Dashboard7";
import Dashboard8 from "./Dashboard8";
import Dashboard9 from "./Dashboard9";
import Dashboard10 from "./Dashboard10";
import ToastButton from "../../../Components/ExtraComponents/Alert_Toast";
import Loader from "../../../Utils/Loader";

import { useDispatch } from "react-redux";
import { Get_Dashboard_Count } from "../../../ReduxStore/Slice/Admin/DashboardSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const user_token = JSON.parse(localStorage.getItem("user_details"))?.token;

  const [DashboardData, setDashboardData] = useState({
    loading: true,
    data: [],
  });

  const getGroupeServics = async () => {
    await dispatch(Get_Dashboard_Count(user_token))
      .unwrap()
      .then((response) => {
        if (response.status) {
          if (response.totalCount) {
            setDashboardData({
              loading: false,
              data: response.totalCount,
            });
          } else {
            setDashboardData({
              loading: false,
              data: response.totalCount,
            });
          }
        }
      });
  };

  useEffect(() => {
    getGroupeServics();
  }, []);

  return (
    <>
      <div>
            {DashboardData.loading && <Loader  fullPage={true}/>}
        <div className="content-body">
          <div className="container-fluid">
            <Dashboard1 data={DashboardData?.data} />
            <Dashboard2 data={DashboardData?.data} />
            <Dashboard3 data={DashboardData?.data} />
            <Dashboard4 data={DashboardData?.data} />
            <Dashboard5 data={DashboardData?.data} />
            <Dashboard6 data={DashboardData?.data} />
            <Dashboard7 data={DashboardData?.data} />
            <Dashboard8 data={DashboardData?.data} />
            <Dashboard9 data={DashboardData?.data} />
            <Dashboard10 data={DashboardData?.data} />
          </div>
        </div>
        <ToastButton />
      </div>
    </>
  );
};

export default Dashboard;
