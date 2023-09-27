/* eslint-disable react/jsx-pascal-case */
/* eslint-disable react/jsx-no-undef */
import React, { useState, useEffect } from 'react'
import Content from "../../../Components/Dashboard/Content/Content"
import Accordion from 'react-bootstrap/Accordion';
import { Get_Broker_Response } from "../../../ReduxStore/Slice/Users/BrokerResponseSlice"
import BasicDataTable from "../../../Components/ExtraComponents/Datatable/BasicDataTable"

import { useDispatch, useSelector } from "react-redux";
import Modal from '../../../Components/ExtraComponents/Modal';
import FullDataTable from "../../../Components/ExtraComponents/Datatable/FullDataTable"
import { fa_time, fDateTimeSuffix } from '../../../Utils/Date_formet'
import { GanttChartSquare ,Eye } from 'lucide-react';



const BrokerResponse = () => {
  const dispatch = useDispatch()


  const [showModal, setshowModal] = useState(false)

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
      dataField: 'open_possition_qty',
      text: 'Open Pisition'
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
            <GanttChartSquare onClick={(e) => GetAllServicesName(row)
            } size={20} color="#198754" strokeWidth={2} className="mx-1" />
          </> : "-"
    },

  ];




  // GET ALL GROUP SERVICES NAME
  const GetAllServicesName = async (row) => {
    console.log("row", row);
    setshowModal(true)


    // await dispatch(GET_ALL_SERVICES_NAMES({
    //     data: row
    // })).unwrap()
    //     .then((response) => {
    //         setshowModal(true)

    //         if (response.status) {
    //             setServicesName({
    //                 loading: false,
    //                 data: response.data
    //             });
    //         }
    //         else {
    //             setServicesName({
    //                 loading: false,
    //                 data: []
    //             });

    //         }
    //     })

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
            <Modal isOpen={showModal} size="lg" title="Details View" hideBtn={true}
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
              ]} tableData={DashboardData.data} />

            </Modal >
          </>
          : ""
      }

    </Content>






    //     <Content Page_title="Broker Response" button_status={false}>


    //       {/* <Accordion>
    //         {
    //           DashboardData.data.length !== 0 ?
    //             <>
    //               {
    //                 DashboardData.data && DashboardData.data.map((item, index) => {
    //                   return <>
    //                     <Accordion.Item eventKey={index}>
    //                       <Accordion.Header>
    //                         {index + 1}
    //                         <div className="col-3 mx-3">
    //                           {item.symbol}
    //                         </div>
    //                         <div className="col-3">
    //                           {item.broker_name}
    //                         </div>
    //                         <div className="col-3">
    //                           {item.order_id}
    //                         </div>
    //                         <div className="col-3">
    //                           {item. createdAt
    // }
    //                         </div>
    //                       </Accordion.Header>
    //                       <Accordion.Body>
    //                         {item.order_status}
    //                       </Accordion.Body>
    //                     </Accordion.Item>
    //                   </>

    //                 })
    //               }
    //             </>
    //             : <img src="../../../../assets/images/norecordfound.png" className='mx-auto d-flex' />
    //         }

    //       </Accordion> */}
    //     </Content>
  )
}


export default BrokerResponse
