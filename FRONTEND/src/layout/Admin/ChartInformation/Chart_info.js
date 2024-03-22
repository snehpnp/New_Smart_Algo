// import React from 'react'
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Content from "../../../Components/Dashboard/Content/Content"
import Loader from '../../../Utils/Loader'
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import Formikform from "../../../Components/ExtraComponents/Form/Formik_form"
import { useFormik } from 'formik';
import FullDataTable from "../../../Components/ExtraComponents/Datatable/FullDataTable"
import { GET_BROKER_INFORMATIONS, UPDATE_BROKER_INFORMATIONS, FIND_BROKER_RESPONSES } from '../../../ReduxStore/Slice/Admin/DashboardSlice'
import { useDispatch, useSelector } from "react-redux";
import { fDate } from "../../../Utils/Date_formet";
import Modal from '../../../Components/ExtraComponents/Modal';
import ToastButton from "../../../Components/ExtraComponents/Alert_Toast";
import toast from 'react-hot-toast';




import TradingViewWidget, { Themes } from 'react-tradingview-widget';


const Chart_info = () => {

    const dispatch = useDispatch()




    const user_id = JSON.parse(localStorage.getItem("user_details")).user_id;
    const AdminToken = JSON.parse(localStorage.getItem("user_details")).token;

    const [Refresh, setRefresh] = useState(false)

    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        fetchChartData();
      }, []);


      const fetchChartData = async () => {
        const data = [
            { time: '2024-03-20', open: 100, high: 110, low: 90, close: 105 },
            { time: '2024-03-21', open: 105, high: 115, low: 95, close: 110 },
            // Add more data points as needed
          ]
        try {
          setChartData(data);
        } catch (error) {
          console.error('Error fetching chart data:', error);
        }
      };

       
    return (
        <>
        
           
                    <>
                        <Content Page_title="TradingView Chart" button_status={false}  >
                        
                       
                        <TradingViewWidget
                            symbol="AAPL"
                            theme={Themes.DARK}
                            locale="en"
                            autosize
                            interval="D"
                            timezone="Etc/UTC"
                            hide_side_toolbar={false}
                            withdateranges={true}
                            data={chartData}
                        />
                      

                        </Content>
                    </>
        

        </ >
    )


}


export default Chart_info;


