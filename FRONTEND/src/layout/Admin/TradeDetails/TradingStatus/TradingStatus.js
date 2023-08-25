// import React from 'react'
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Content from "../../../../Components/Dashboard/Content/Content"
import Theme_Content from "../../../../Components/Dashboard/Content/Theme_Content"
import Loader from '../../../../Utils/Loader'
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import { Pencil, Trash2 } from 'lucide-react';
import FullDataTable from "../../../../Components/ExtraComponents/Datatable/FullDataTable"
import { GET_ALL_CLIENTS } from '../../../../ReduxStore/Slice/Admin/AdminSlice'
import { useDispatch, useSelector } from "react-redux";
import Modal from '../../../../Components/ExtraComponents/Modal';


const TradingStatus = () => {

    const dispatch = useDispatch()

    const [first, setfirst] = useState('all')
    const [showModal, setshowModal] = useState(false)
    const [gettype, settype] = useState('on');
    
    console.log(gettype);

    const [getAllClients, setAllClients] = useState({
        loading: true,
        data: []
    });


    const data = async () => {
        await dispatch(GET_ALL_CLIENTS()).unwrap()
            .then((response) => {
                if (response.status) {

                    const alData = response.data.filter((item) => {
                        return item.TradingStatus == gettype
                    })

                    setAllClients({
                        loading: false,
                        data: alData
                    });

                }
            })
    }
    useEffect(() => {
        data()
    }, [gettype])

    const columns = [
        {
            dataField: "index",
            text: "SR. No.",
            formatter: (cell, row, rowIndex) => rowIndex + 1,
        },
        {
            dataField: 'UserName',
            text: 'User Name'
        },
        {
            dataField: 'Email',
            text: 'Email'
        },
        {
            dataField: 'PhoneNo',
            text: 'Phone Number'
        },
        {
            dataField: '',
            text: 'Trading Status'
        }

    ];
    return (
        <>
            {
                getAllClients.loading ? <Loader /> :
                    <>
                        <Content Page_title="Trading Status" button_title="#" route="/client/add">
                            <div className="col-lg-6">
                                <div className="mb-3 row">
                                    <div className="col-lg-7">
                                        <select
                                            className="default-select wide form-control"
                                            id="validationCustom05"
                                            onChange={(e) => settype(e.target.value)}
                                        >
                                            <option disabled>
                                                Please Select Type
                                            </option>
                                            <option value={"on"}>On</option>
                                            <option value={"off"}>Off</option>

                                        </select>

                                    </div>
                                </div>
                            </div>
                            {
                                getAllClients.data && getAllClients.data.length === 0 ? (
                                    'No data found') :
                                    <>
                                        <FullDataTable TableColumns={columns} tableData={getAllClients.data} />
                                    </>
                            }
                            {
                                showModal ?
                                    <>
                                        < Modal isOpen={showModal} backdrop="static" size="sm" title="Verify OTP" btn_name="Verify"
                                        //  handleClose={setshowModal(false)}
                                        >
                                        </Modal >
                                    </>
                                    : ""
                            }
                        </Content>
                    </>
            }



        </ >
    )

}


export default TradingStatus

