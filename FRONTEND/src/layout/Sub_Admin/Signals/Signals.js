import React, { useEffect, useState } from 'react'
import Content from "../../../Components/Dashboard/Content/Content"
import FullDataTable from "../../../Components/ExtraComponents/Datatable/FullDataTable"
import Loader from '../../../Utils/Loader'
import {  fDateTimeSuffix } from '../../../Utils/Date_formet'
import { Get_All_Signals } from '../../../ReduxStore/Slice/Admin/SignalsSlice'
import { useDispatch } from "react-redux";



const Signals = () => {

    const dispatch = useDispatch()

    const token = JSON.parse(localStorage.getItem("user_details")).token;


    const [DateFilter, setDateFilter] = useState();


    const columns = [
        {
            dataField: 'index',
            text: 'S.No.',
            formatter: (cell, row, rowIndex) => rowIndex + 1,

        },
        {
            dataField: 'createdAt',
            text: 'Signals Time',
            formatter: (cell, row, rowIndex) => <div>{fDateTimeSuffix(cell)}</div>
        },
        {
            dataField: 'type',
            text: 'Type'
        },
        {
            dataField: 'trade_symbol',
            text: 'Symbol'
        },
        {
            dataField: 'price',
            text: 'Price'
        },
        // {
        //     dataField: 'prefix',
        //     text: 'Message'
        // },
        {
            dataField: 'strategy',
            text: 'Strategy',
        },

    ];



    const [SignalsData, getSignalsData] = useState({
        loading: true,
        data: []
    });



    useEffect(() => {
        const fetchData = async () => {
          await dispatch(Get_All_Signals({ startDate: DateFilter, token: token })).unwrap()
            .then((response) => {
              getSignalsData({
                loading: false,
                data: response.data,
              });
            });
        };
      
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [DateFilter, token]); // Ignore the warning about 'dispatch'
      
      

      useEffect(() => {
        const dateArray = [];
        for (let i = 0; i < 3; i++) {
          const currentDate = new Date();
          currentDate.setDate(currentDate.getDate() - i);
          const day = currentDate.getDate();
          const month = currentDate.getMonth() + 1; // Months are zero-based
          const year = currentDate.getFullYear();
          const formattedDate = `${year}/${month}/${day}`;
          dateArray.push(formattedDate);
        }
        setDateFilter(dateArray[0]);
      }, []); // Empty dependency array since no external variables are being used
      


    return (
        <>
            {
                SignalsData.loading ? <Loader /> :
                    <>
                        <Content Page_title="All Services" button_status={false}>
                         

                            {
                                SignalsData.data && SignalsData.data.length === 0 ? (
                                    // 'No data found'
                                    <FullDataTable TableColumns={columns} tableData={SignalsData.data} />
                                )
                                    :
                                    <>
                                        <FullDataTable TableColumns={columns} tableData={SignalsData.data} />
                                    </>


                            }
                        </Content>
                    </>
            }



        </ >
    );


}


export default Signals
