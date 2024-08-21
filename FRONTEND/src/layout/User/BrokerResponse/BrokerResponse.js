/* eslint-disable react/jsx-pascal-case */
/* eslint-disable react/jsx-no-undef */
import React, { useState, useEffect } from 'react'
import Content from "../../../Components/Dashboard/Content/Content"
import Accordion from 'react-bootstrap/Accordion';
import { Get_Broker_Response, UpdateBrokerResponse, GET_ALL_BROKER_RESPONSES } from "../../../ReduxStore/Slice/Users/BrokerResponseSlice"
import { User_Profile } from "../../../ReduxStore/Slice/Common/commoSlice.js";
import BasicDataTable from "../../../Components/ExtraComponents/Datatable/BasicDataTable"
import { useDispatch, useSelector } from "react-redux";
import Modal from '../../../Components/ExtraComponents/Modal';
import FullDataTable from "../../../Components/ExtraComponents/Datatable/FullDataTable"
import { fa_time, fDateTimeSuffix } from '../../../Utils/Date_formet'
import { GanttChartSquare, Eye, Pencil, Trash2 } from 'lucide-react';
import OrderPending from "./OrderPending"


const BrokerResponse = () => {
  const dispatch = useDispatch()
  const user_details = JSON.parse(localStorage.getItem("user_details"));

  const [refresh, setrefresh] = useState(false)
  const [showModal, setshowModal] = useState(false)
  const [shouldAddNewColumn, setShouldAddNewColumn] = useState(false)
  const [BrokerResponseId, setBrokerResponseId] = useState([])
  const [DashboardData, setDashboardData] = useState({ loading: true, data: [] });
  const [UserDetails, setUserDetails] = useState({ loading: true, data: [] });
  const [showAddLicenceModal, setshowAddLicenceModal] = useState(false)


  const gotodashboard = JSON.parse(localStorage.getItem('user_details_goTo'))
  const isgotodashboard = JSON.parse(localStorage.getItem('gotodashboard'))
  const user_Id = JSON.parse(localStorage.getItem('user_details')).user_id;
  const AdminToken = JSON.parse(localStorage.getItem('user_details')).token;



  const data = async () => {

    const userId = isgotodashboard ? gotodashboard.user_id : user_details.user_id;
    const token = isgotodashboard ? gotodashboard.token : user_details.token;

    await dispatch(User_Profile({
      id: userId,
      token: token,
    }))
      .unwrap()
      .then((response) => {
        if (response.status) {
          setUserDetails({
            loading: false,
            data: response.data,
          });
          if (response.data.broker == "12") {
            setShouldAddNewColumn(true)
          }
          else if (response.data.broker == "2") {
            setShouldAddNewColumn(true)
          }
        }
      });
  };
  useEffect(() => {
    data();
  }, []);



  const columns = [
    {
      dataField: 'index',
      text: 'S.No.',
      formatter: (cell, row, rowIndex) => rowIndex + 1,

    },
    {
      dataField: 'createdAt',
      text: 'Created At',
      formatter: (cell, row, rowIndex) => <div>{fDateTimeSuffix(cell)}</div>

    },
    {
      dataField: 'symbol',
      text: 'Symbol'
    },
    {
      dataField: 'type',
      text: 'type'
    },
    {
      dataField: 'broker_name',
      text: 'Broker Name'
    },

    {
      dataField: 'order_id',
      text: 'Oder Id',
      formatter: (cell, row, rowIndex) => <>{row.order_id == null ? "-" : row.order_id}</>

    },
    {
      dataField: 'order_status',
      text: 'order status',
      formatter: (cell, row, rowIndex) => <div>{cell}</div>

    },
    {
      dataField: 'order_view_response',
      text: 'order Info',
      formatter: (cell, row, rowIndex) => <div>{cell}</div>

    },
    {
      dataField: 'Details View',
      text: 'View',
      formatter: (cell, row, rowIndex) =>

        <>
          <Eye onClick={(e) => GetAllServicesName(row)
          } size={20} color="#198754" strokeWidth={2} className="mx-1" />
        </>
    },


  ];

  // Conditionally add the new column
  if (shouldAddNewColumn) {
    columns.push({
      dataField: '',
      text: 'Refresh',
      formatter: (cell, row, rowIndex) => (
        <>
          {row.order_id !== ''&& row.order_id !== undefined && row.order_view_status == '0' ? (
           
            <button
              className='btn btn-primary d-flex ms-auto mb-3'
              type="reset"
              style={{ height: '40px' }}
              onClick={(e) => Singlerefresh(e, row)

              }>Refresh</button>
          ) : (
            ''
          )}
        </>
      ),
    });
  }

  const Singlerefresh = async (e, row) => {

    await dispatch(GET_ALL_BROKER_RESPONSES({ user_id: isgotodashboard ? gotodashboard.user_id : user_Id, broker_response_id: row._id, order_id: row.order_id })).unwrap()
      .then((response) => {
        if (response.status) {
          setrefresh(!refresh)
          window.location.reload();
        } else {
          setrefresh(!refresh)
        }
      })


  }

  const BrokerResponse = async (e) => {
    await dispatch(Get_Broker_Response({ _id: isgotodashboard ? gotodashboard.user_id : user_Id, token: AdminToken })).unwrap()
      .then((response) => {
        if (response.status) {
          console.log("response.data",response.data)
          setDashboardData({
            loading: false,
            data: response.data
          });
          ;
        }
      })
  }

  const updateBrokerResponse = async (e) => {
    await dispatch(GET_ALL_BROKER_RESPONSES({ user_id: isgotodashboard ? gotodashboard.user_id : user_Id })).unwrap()
      .then((response) => {
        if (response.status) {

        }
      })
  }

  const GetAllServicesName = async (row) => {
    setBrokerResponseId(row)
    setshowModal(true)
  }

  // USE EFFECT
  useEffect(() => {
    BrokerResponse()
  }, [refresh])



  return (

    <Content Page_title="Broker Response" button_status={false}>

      {/* {
        UserDetails.data && UserDetails.data.broker == "12" || UserDetails.data.broker == "2" ? "" :
          <button className='btn btn-primary d-flex ms-auto mb-3' type="reset" onClick={(e) => setrefresh(!refresh)}>Refresh</button>
      } */}

      <FullDataTable TableColumns={columns} tableData={DashboardData.data} />
      <OrderPending showModal={showAddLicenceModal} setshowModal={() => setshowAddLicenceModal(false)} />
      {
        showModal ?
          <>
            <Modal isOpen={showModal} size="xl" title="Details View" hideBtn={true}
              // onHide={handleClose}
              handleClose={() => setshowModal(false)}
            >
              <div className='table-responsive'>
                <table className='table table-striped table-bordered border border-response-view' style={{ width: '100%', tableLayout: 'fixed' }}>
                  <tr>
                    <td className="bg-table"> Created At</td>
                    <td>{fDateTimeSuffix(BrokerResponseId.createdAt)}</td>
                  </tr>
                  <tr>
                    <td className="bg-table"> Symbol</td>
                    <td>{BrokerResponseId.symbol}</td>
                  </tr>
                  <tr>
                    <td className="bg-table"> Broker Name</td>
                    <td>{BrokerResponseId.broker_name}</td>
                  </tr>
                  <tr>
                    <td className="bg-table"> Order Id</td>
                    <td>{BrokerResponseId.order_id}</td>
                  </tr>
                  <tr>

                    <td className="bg-table"> Receive Signal</td>
                    <td className="order-date-cell">{BrokerResponseId.receive_signal != undefined ? atob(BrokerResponseId.receive_signal) : ""}</td>
                  </tr>
                  <tr>

                    <td className="bg-table"> Signal</td>
                    <td className="order-date-cell">{BrokerResponseId.send_request != undefined ? atob(BrokerResponseId.send_request) : ""}</td>
                  </tr>
                  <tr>
                    <td className="bg-table"> Order Status</td>
                    <td>{BrokerResponseId.order_status}</td>
                  </tr>
                  <tr>
                    <td className="bg-table"> Reject Reson</td>
                    <td>{BrokerResponseId.reject_reason}</td>
                  </tr>
                  <tr>
                    <td className="bg-table"> Order Data</td>
                    <td className="order-date-cell">{BrokerResponseId.order_view_date}</td>
                  </tr>


                </table>
              </div>
            </Modal >
          </>
          : ""
      }

    </Content>



  )
}


export default BrokerResponse
