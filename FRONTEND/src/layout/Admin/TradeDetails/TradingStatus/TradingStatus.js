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
import { fa_time , fDateTimeSuffix } from "../../../../Utils/Date_formet";



const TradingStatus = () => {

    const dispatch = useDispatch()

    const [first, setfirst] = useState('USER')

    const [getAllClients, setAllClients] = useState({
        loading: true,
        data: []
    });

    const [ForGetCSV , setForGetCSV] = useState([])



    const data = async () => {
        await dispatch(GET_ALL_TRADING_STATUS({ Role: first })).unwrap()
            .then((response) => {
                if (response.status) {
console.log("response" ,response)


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
            formatter: (cell, row, rowIndex) => rowIndex + 1,
        },
        {
            dataField: 'userinfo.FullName',
            text: 'User Name'
        },

        {
            dataField: 'login_status',
            text: 'Login And Trading  Status',
            // formatter: (cell, row) => cell == null || "" ? "-" : cell
            formatter: (cell, row) => row.login_status == null ? row.trading_status : row.login_status
        },
        {
            dataField: 'message',
            text: 'message',
            formatter: (cell, row) => cell == null || "" ? "-" : cell

        },

        {
            dataField: 'createdAt',
            text: 'Panel ON/OFF Time',
            formatter: (cell, row) => fDateTimeSuffix(cell)

        },
        {
            dataField: 'role',
            text: 'role'
        },
        {
            dataField: 'system_ip',
            text: 'system IP'
        },



    ];

    var RoleArr = ["ADMIN", "USER", "SUBADMIN"]

    return (
        <>
            {
                getAllClients.loading ? <Loader /> :
                    <>
                        <Content Page_title="Trading Status" button_status={false} 
                        // show_csv_button={true} csv_data={getAllClients.data}  csv_title="TradingStatus" 
                        >


                        <div className="col-lg-6">
                            <div className="mb-3 row">
                                <div className="col-lg-7">
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

                                </div>
                            </div>
                        </div>

                        <FullDataTable TableColumns={columns} tableData={getAllClients.data} />
                    </Content>
        </>
            }



        </ >
    )

    // <Content Page_title="Signals">
    //     <BasicDataTable tableData={columns} TableColumns={columns} dropdown={false} />
    // </Content>
    // )
}


export default TradingStatus;


