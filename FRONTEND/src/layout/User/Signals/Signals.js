import React, { useState, useEffect } from 'react'
import Content from "../../../Components/Dashboard/Content/Content"
import BasicDataTable from '../../../Components/ExtraComponents/Datatable/BasicDataTable'
import FullDataTable from "../../../Components/ExtraComponents/Datatable/FullDataTable"
import { Pencil, Trash2 } from 'lucide-react';
import Loader from '../../../Utils/Loader'
import { fDateTimeSuffix } from '../../../Utils/Date_formet'


import { Get_Signals } from "../../../ReduxStore/Slice/Users/SignalsSlice"
import { useDispatch, useSelector } from "react-redux";


const Signals = () => {

  const dispatch = useDispatch()


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

    {
      dataField: 'strategy',
      text: 'Strategy',
    },

  ];





  const [SignalsData, setSignalsData] = useState({ loading: true, data: [] });

  const user_Id = JSON.parse(localStorage.getItem('user_details')).user_id;
  const AdminToken = JSON.parse(localStorage.getItem('user_details')).token;



  const getsignals11 = async (e) => {
    await dispatch(Get_Signals({ _id: user_Id, token: AdminToken })).unwrap()
      .then((response) => {
        if (response.status) {
          setSignalsData({
            loading: false,
            data: response.data
          });
        } else {
          setSignalsData({
            loading: false,
            data: response.data
          });
        }
      })
  }

  useEffect(() => {
    getsignals11()
  }, [])

  return (
    <>
      {
        SignalsData.loading ? <Loader /> :
          <>
            <Content Page_title="Signals" button_status={false}>


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
  )

}

export default Signals
