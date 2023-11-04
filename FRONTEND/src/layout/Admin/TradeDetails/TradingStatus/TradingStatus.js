// import React from 'react'
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Content from "../../../../Components/Dashboard/Content/Content"
import Loader from '../../../../Utils/Loader'
import FullDataTable from "../../../../Components/ExtraComponents/Datatable/FullDataTable"
import { GET_ALL_CLIENTS, GET_ALL_TRADING_STATUS } from '../../../../ReduxStore/Slice/Admin/AdminSlice'
import { useDispatch, useSelector } from "react-redux";
import { fa_time, fDateTimeSuffix } from "../../../../Utils/Date_formet";



const TradingStatus = () => {

    const dispatch = useDispatch()

    const [first, setfirst] = useState('on')

    const [getAllClients, setAllClients] = useState({
        loading: true,
        data: []
    });

    const [ForGetCSV, setForGetCSV] = useState([])



    const data = async () => {
        let csvarr = []
        await dispatch(GET_ALL_TRADING_STATUS({ Role: first })).unwrap()
            .then((response) => {
                if (response.status) {

                    response.data.map((data) => {

                        return csvarr.push({
                            "Full Name": data.FullName,
                            "User Name": data.UserName,
                            "Email": data.Email,
                            "Phone No": data.PhoneNo,
                            "Trading Status": data.TradingStatus,

                            "End Date": fDateTimeSuffix(data.EndDate),

                        })

                    })
                    setForGetCSV(csvarr)


                    setAllClients({
                        loading: false,
                        data: response.data
                    });
                } else {
                    setAllClients({
                        loading: false,
                        data: response.data
                    });
                }
            })
            .catch((err) => {
                console.log("err", err);
            })
    }
    useEffect(() => {
        data()
    }, [first])




    const columns = [
        {
            dataField: 'index',
            text: 'S.No.',
            formatter: (cell, row, rowIndex) => (
                <div
                  style={{
                    color: first == 'off' ? "red" : "black",
                  }}
                >
                  {rowIndex + 1}
                </div>
              ),
        },
       
        {
            dataField: 'UserName',
            text: 'User Name',
            formatter: (cell, row) => (
                <div
                  style={{
                    color: first == 'off' ? "red" : "green",
                  }}
                >
                  {row.UserName}
                </div>
              ),
        },
        {
            dataField: 'Email',
            text: 'Email',
            formatter: (cell, row) => (
                <div
                  style={{
                    color: first == 'off' ? "red" : "green",
                  }}
                >
                  {row.Email}
                </div>
              ),
        },
        {
            dataField: 'PhoneNo',
            text: 'Phone No',
            formatter: (cell, row) => (
                <div
                  style={{
                    color: first == 'off' ? "red" : "green",
                  }}
                >
                  {row.PhoneNo}
                </div>
              ),
        },
        {
            dataField: 'TradingStatus',
            text: 'Traing ON/OFF',
            formatter: (cell, row) => (
                <div
                  style={{
                    color: first == 'off' ? "red" : "green",
                  }}
                >
                  {row.TradingStatus}
                </div>
              ),

        },
        {
            dataField: 'EndDate',
            text: 'End Date',
            formatter: (cell, row) => (
                <div
                  style={{
                    color: first == 'off' ? "red" : "green",
                  }}
                >
                  {fDateTimeSuffix(cell)}
                </div>
              ),
    

        },



    ];

    var RoleArr = ["ADMIN", "USER", "SUBADMIN"]

    return (
        <>
            {
                getAllClients.loading ? <Loader /> :
                    <>
                        <Content Page_title="Trading Status" button_status={false}
                            show_csv_button={true} csv_data={ForGetCSV} csv_title="TradingStatus"
                        >
                            <div className="col-lg-6">
                                <div className="mb-3 row">
                                    <label for="validationCustom05" class="form-label">
                                        Select Status
                                    </label>
                                    {/* <div className="col-lg-7">
                                        <select
                                            className="default-select wide form-control"
                                            id="validationCustom05"
                                            onChange={(e) => setfirst(e.target.value)}
                                        >
                                            <option disabled>
                                                Please Select Catagory
                                            </option>

                                            {RoleArr && RoleArr.map((item) => {
                                                return <>
                                                    <option value={item}>{item}</option>
                                                </>
                                            })}

                                        </select>

                                    </div> */}
                                    <div className="col-lg-7">
                                        <select
                                            className="default-select wide form-control"
                                            id="validationCustom05"
                                            onChange={(e) => setfirst(e.target.value)}
                                        >
                                            <option disabled>
                                                Select Status
                                            </option>

                                            <option value={'on'}>ON</option>
                                            <option value={'off'}>OFF</option>



                                        </select>

                                    </div>
                                </div>
                            </div>

                            <FullDataTable TableColumns={columns} tableData={getAllClients.data} />
                        </Content>
                    </>
            }



        </ >
    )


}


export default TradingStatus;


