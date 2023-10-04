/* eslint-disable react/jsx-pascal-case */
/* eslint-disable react/jsx-no-undef */
import React, { useState, useEffect } from 'react'
import Content from "../../../Components/Dashboard/Content/Content"
import Accordion from 'react-bootstrap/Accordion';
import { Get_Broker_Response,UpdateBrokerResponse } from "../../../ReduxStore/Slice/Users/BrokerResponseSlice"
import BasicDataTable from "../../../Components/ExtraComponents/Datatable/BasicDataTable"

import { useDispatch, useSelector } from "react-redux";
import Modal from '../../../Components/ExtraComponents/Modal';
import FullDataTable from "../../../Components/ExtraComponents/Datatable/FullDataTable"
import { fa_time, fDateTimeSuffix } from '../../../Utils/Date_formet'
import { GanttChartSquare, Eye } from 'lucide-react';



const BrokerResponse = () => {
  const dispatch = useDispatch()


  const [showModal, setshowModal] = useState(false)
  const [BrokerResponseId, setBrokerResponseId] = useState([])

  console.log("BrokerResponseId", BrokerResponseId && BrokerResponseId);

  const [DashboardData, setDashboardData] = useState({ loading: true, data: [] });

  const user_Id = JSON.parse(localStorage.getItem('user_details')).user_id;
  const AdminToken = JSON.parse(localStorage.getItem('user_details')).token;



  const getsignals11 = async (e) => {
    await dispatch(Get_Broker_Response({ _id: user_Id, token: AdminToken })).unwrap()
      .then((response) => {
        if (response.status) {
          setDashboardData({
            loading: false,
            data: response.data
          });
          ;
        }
      })
  }

  useEffect(() => {
    getsignals11()
  }, [])



  const [activeKey, setActiveKey] = useState(null);

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
      dataField: 'reject_reason',
      text: 'Reason'
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
    {
      dataField: 'order_view_status',
      text: 'Message',
      formatter: (cell, row, rowIndex) =>
        cell == "0" || cell == 0 ?
          <>
            {console.log("row", row)}
            <GanttChartSquare onClick={(e) => GetBrokerInforMation(row)
            } size={20} color="#198754" strokeWidth={2} className="mx-1" />
          </>
          :
          "-"
    },

  ];




  // GET ALL GROUP SERVICES NAME
  const GetAllServicesName = async (row) => {

    setBrokerResponseId(row)
    setshowModal(true)

  }


  const GetBrokerInforMation=async(row)=>{
    console.log("row", row);

    await dispatch(UpdateBrokerResponse({ OrderId: row.order_id,user_id:row.user_id, token: AdminToken })).unwrap()
    .then((response) => {
      
      if (response.status) {
      
        setDashboardData({
          loading: false,
          data: response.data
        });
        ;
      }
    })

  }

  return (



    <Content Page_title="Broker Response" button_status={false}>
      {
        DashboardData.data && DashboardData.data.length === 0 ? (
          <FullDataTable TableColumns={columns} tableData={DashboardData.data} />
        ) :
          <>
            <FullDataTable TableColumns={columns} tableData={DashboardData.data} />
          </>
      }



      {
        showModal ?
          <>
            <Modal isOpen={showModal} size="xl" title="Details View" hideBtn={true}
              // onHide={handleClose}
              handleClose={() => setshowModal(false)}
            >
              <BasicDataTable TableColumns={[
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
                  dataField: 'broker_name',
                  text: 'Broker Name'
                },

                {
                  dataField: 'order_id',
                  text: 'Oder Id'
                },
                {
                  dataField: 'send_request',
                  text: 'Signal',
                  formatter: (cell, row, rowIndex) => <div>{atob(cell)}</div>

                },
                {
                  dataField: 'order_status',
                  text: 'Order Status'
                },
                {
                  dataField: 'order_view_date',
                  text: 'order date'
                },
              ]} tableData={[BrokerResponseId]} />

            </Modal >
          </>
          : ""
      }

    </Content>



)
}


export default BrokerResponse
