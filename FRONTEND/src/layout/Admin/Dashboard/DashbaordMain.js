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
import * as Config from "../../../Utils/Config";
import ToastButton from "../../../Components/ExtraComponents/Alert_Toast";
import { GET_ALL_CLIENTS } from "../../../ReduxStore/Slice/Admin/AdminSlice";
import { Get_All_SUBADMIN } from '../../../ReduxStore/Slice/Subadmin/Subadminslice'


import { useDispatch, useSelector } from "react-redux";
import { Get_Dashboard_Count } from "../../../ReduxStore/Slice/Admin/DashboardSlice";

import socketIOClient from "socket.io-client";

import toast, { Toaster } from "react-hot-toast";

const Dashboard = () => {
  const dispatch = useDispatch();
  const user_token = JSON.parse(localStorage.getItem("user_details")).token;

  const Role = JSON.parse(localStorage.getItem("user_details")).Role;
  const user_ID = JSON.parse(localStorage.getItem("user_details")).user_id;

  const [DashboardData, setDashboardData] = useState("");
  const [DashboardData1, setDashboardData1] = useState([]);

  const [getAllClients, setAllClients] = useState({
    loading: true,
    data: [],
  });

  const getGroupeServics = async () => {
    await dispatch(Get_Dashboard_Count(user_token))
      .unwrap()
      .then((response) => {
        if (response.status) {
          if (response.totalCount) {
            setDashboardData(response.totalCount);
          }
        }
      });
  };



  useEffect(() => {
    getGroupeServics();
  }, []);


  // const data = async () => {
  //  let  total_subadmins
  //   await dispatch(Get_All_SUBADMIN())
  //     .unwrap()
  //     .then((response) => {
  //          total_subadmins =
  //         response.data &&
  //         response.data.filter((item) => {
  //           return item.Role === "SUBADMIN";
  //         });


  //     });


  //   var req1 = {
  //     Find_Role: Role,
  //     user_ID: user_ID,
  //   };
  //   await dispatch(GET_ALL_CLIENTS(req1))
  //     .unwrap()
  //     .then((response) => {
  //       if (response.status) {
  //         // let totalclients = response.data && response.data.length
  //         let totalclients = response.data && response.data;

  //         let total_live =
  //           response.data &&
  //           response.data.filter((item) => {
  //             return item.license_type === 2 || item.license_type === "2";
  //           });

  //         let total_live_active =
  //           response.data &&
  //           response.data.filter((item) => {
  //             return (
  //               new Date(item.EndDate) > new Date() &&
  //               (item.license_type === "2" || item.license_type === 2)
  //             );
  //           });

  //         let total_live_expired =
  //           response.data &&
  //           response.data.filter((item) => {
  //             return (
  //               new Date(item.EndDate) < new Date() &&
  //               (item.license_type === "2" || item.license_type === 2)
  //             );
  //           });

  //         // ------------------------------------------------------------

  //         let total_Demo =
  //           response.data &&
  //           response.data.filter((item) => {
  //             return item.license_type === 1 || item.license_type === "1";
  //           });

  //         let total_Demo_active =
  //           response.data &&
  //           response.data.filter((item) => {
  //             return (
  //               new Date(item.EndDate) > new Date() &&
  //               (item.license_type === "1" || item.license_type === 1)
  //             );
  //           });

  //         let total_Demo_expired =
  //           response.data &&
  //           response.data.filter((item) => {
  //             return (
  //               new Date(item.EndDate) < new Date() &&
  //               (item.license_type === "1" || item.license_type === 1)
  //             );
  //           });

  //         // ------------------------------------------------------------

  //         let total_2Days =
  //           response.data &&
  //           response.data.filter((item) => {
  //             return item.license_type === 0 || item.license_type === "0";
  //           });

  //         let total_2Days_active =
  //           response.data &&
  //           response.data.filter((item) => {
  //             return (
  //               new Date(item.EndDate) > new Date() &&
  //               (item.license_type === "0" || item.license_type === 0)
  //             );
  //           });

  //         let total_2Days_expired =
  //           response.data &&
  //           response.data.filter((item) => {
  //             return (
  //               new Date(item.EndDate) < new Date() &&
  //               (item.license_type === "0" || item.license_type === 0)
  //             );
  //           });

  //         // ------------------------------------------------------------

  //         let total_admin_clients =
  //           response.data &&
  //           response.data.filter((item) => {
  //             return item.parent_role === "ADMIN" && item.Role === "USER";
  //           });

  //         let total_subadmin_clients =
  //           response.data &&
  //           response.data.filter((item) => {
  //             return item.parent_role === "SUBADMIN";
  //           });

      
  //         setDashboardData({
  //           loading: false,
  //           data: {
  //             total_client: totalclients.length,
  //             admin_client: total_admin_clients.length,
  //             subadmin_client: total_subadmin_clients.length,
  //             total_Subadmin: total_subadmins.length,
  //             total_live: total_live.length,
  //             total_active_live: total_live_active.length,
  //             total_expired_live: total_live_expired.length,
  //             total_demo: total_Demo.length,
  //             total_active_demo: total_Demo_active.length,
  //             total_expired_demo: total_Demo_expired.length,
  //             total_two_days: total_2Days.length,
  //             total_active_two_days: total_2Days_active.length,
  //             total_expired_two_days: total_2Days_expired.length,
  //             //   all_licence:
  //             //     DashboardData1 !== undefined && DashboardData1.all_licence,
  //             //   used_licence:
  //             //     DashboardData1 !== undefined && DashboardData1.used_licence,
  //             //   remaining_licence:
  //             //     DashboardData1 !== undefined &&
  //             //     DashboardData1.remaining_licence,
  //           },
  //         });
          
  //       }
  //     });
  // };
  // useEffect(() => {
  //   data();
  // }, []);

  //  Recieve Notfication

  useEffect(() => {
    const socket = socketIOClient(`${Config.base_url}`);

    socket.on("test_msg_Response", (data) => {
      toast.success(`Notificatipn Received From ${data.username}`);
      console.log("test_msg_Response", data.username);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <div>
        <div className="content-body">
          <div className="container-fluid">
            <Dashboard1 data={DashboardData} />
            <Dashboard2 data={DashboardData} />
            <Dashboard3 data={DashboardData} />
            <Dashboard4 data={DashboardData} />
            <Dashboard5 data={DashboardData} />
            <Dashboard6 data={DashboardData} />
            <Dashboard7 data={DashboardData} />
            <Dashboard8 data={DashboardData} />
            <Dashboard9 data={DashboardData} />
            <Dashboard10 data={DashboardData} />
          </div>
        </div>
        <ToastButton />
      </div>
    </>
  );
};

export default Dashboard;
