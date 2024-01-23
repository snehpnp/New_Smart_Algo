import React, { useState, useEffect } from 'react'
import Content from "../../../Components/Dashboard/Content/Content"
import BasicDataTable from '../../../Components/ExtraComponents/Datatable/BasicDataTable'
import FullDataTable from "../../../Components/ExtraComponents/Datatable/FullDataTable"
// import FullDataTable from "../../../Components/ExtraComponents/Datatable/TableWithPagination"
import { Pencil, Trash2 } from 'lucide-react';
import Loader from '../../../Utils/Loader'
import { fDateTimeSuffix } from '../../../Utils/Date_formet'


import { Get_Signals } from "../../../ReduxStore/Slice/Users/SignalsSlice"
import { useDispatch} from "react-redux";


const Signals = () => {

  const [SignalsData, setSignalsData] = useState({ loading: true, data: [] });

  const dispatch = useDispatch()
  const gotodashboard = JSON.parse(localStorage.getItem('user_details_goTo'))
  const isgotodashboard = JSON.parse(localStorage.getItem('gotodashboard'))
  const user_Id = JSON.parse(localStorage.getItem('user_details')).user_id;
  const AdminToken = JSON.parse(localStorage.getItem('user_details')).token;


  const getClientsignals = async (e) => {
    await dispatch(Get_Signals({ _id: isgotodashboard ? gotodashboard.user_id : user_Id, token: AdminToken })).unwrap()
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

  console.log("setSignalsData :", SignalsData)


  useEffect(() => {
    getClientsignals()
  }, [])


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
    {
      dataField: 'TradeType',
      text: 'Trade Type',
    },

  ];


  return (
    <>
      {
        SignalsData.loading ? <Loader /> :
          <>
            <Content Page_title="Signals" button_status={false}>
              {/* <FullDataTable data={SignalsData.data} itemsPerPage={10} /> */}
              <FullDataTable TableColumns={columns} tableData={SignalsData.data} />
            </Content>
          </>
      }



    </ >
  )

}

export default Signals
