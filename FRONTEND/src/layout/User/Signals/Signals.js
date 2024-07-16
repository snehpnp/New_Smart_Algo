import React, { useState, useEffect } from 'react'
import Content from "../../../Components/Dashboard/Content/Content"
import FullDataTable from "../../../Components/ExtraComponents/Datatable/FullDataTable"
import Loader from '../../../Utils/Loader'
import { fDateTimeSuffix } from '../../../Utils/Date_formet'
import { Get_Signals } from "../../../ReduxStore/Slice/Users/SignalsSlice"
import { useDispatch, useSelector } from "react-redux";



const Signals = () => {
  const dispatch = useDispatch()
  const [SelectServiceIndex, setSelectServiceIndex] = useState("Strategy");
  const [SignalsData, setSignalsData] = useState({ loading: true, data: [] });
  const gotodashboard = JSON.parse(localStorage.getItem('user_details_goTo'))
  const isgotodashboard = JSON.parse(localStorage.getItem('gotodashboard'))
  const user_details = JSON.parse(localStorage.getItem('user_details'))
  const AdminToken = JSON.parse(localStorage.getItem('user_details'));

  const getClientsignals = async (e) => {
    await dispatch(Get_Signals({ _id: isgotodashboard ? gotodashboard.user_id : user_details.user_id,type:SelectServiceIndex, token: AdminToken.token })).unwrap()
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

  useEffect(() => {
    getClientsignals()
  }, [SelectServiceIndex])

  return (
    <>
      {
        SignalsData.loading ? <Loader /> :
          <Content Page_title="Signals" button_status={false}>

            <div className="row d-flex  align-items-center justify-content-start">

              <div className="col-lg-2 px-1">
                <div className="mb-3">
                  <label for="select" className="form-label">
                    Type
                  </label>
                  <select
                    className="default-select wide form-control"
                    aria-label="Default select example"
                    id="select"
                    onChange={(e) => setSelectServiceIndex(e.target.value)}
                    value={SelectServiceIndex}
                  >
                    <option value="Strategy" selected>Starategy</option>
                    <option value="Trade" selected>Trade</option>

                  </select>
                </div>
              </div>

            



            </div>


            <FullDataTable TableColumns={columns} tableData={SignalsData.data} />
          </Content>
      }

    </ >
  )

}

export default Signals
