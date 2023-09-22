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
import { Transcation_Licence } from '../../../../ReduxStore/Slice/Admin/LicenceSlice';
import { fDate, fDateTimeSuffix } from '../../../../Utils/Date_formet';

const AllLicence = () => {

    const dispatch = useDispatch()

    const [first, setfirst] = useState('all')
    const [showModal, setshowModal] = useState(false)

    const token = JSON.parse(localStorage.getItem("user_details")).token




    const [getAllClients, setAllClients] = useState({
        loading: true,
        data: []
    });

    console.log("getAllClients", getAllClients.data);

    const data = async () => {
        await dispatch(Transcation_Licence({ token: token })).unwrap()
            .then((response) => {
                if (response.status) {
                    setAllClients({
                        loading: false,
                        data: response.data
                    });
                }
            })
    }
    useEffect(() => {
        data()
    }, [])
    const columns = [
        {
            dataField: "index",
            text: "S.No.",
            formatter: (cell, row, rowIndex) => rowIndex + 1,
        },
        {
            dataField: 'user',
            text: 'Full Name',
            formatter: (cell, row, rowIndex) => <>{row.user[0].FullName}</>,

        },
    
        {
            dataField: '',
            text: 'license',
            formatter: (cell, row, rowIndex) => <>{row.count_license.license}</>,

        },
        {
            dataField: '',
            text: 'Create At',
            formatter: (cell, row, rowIndex) => <>{fDateTimeSuffix(row.count_license.createdAt)}</>,

        },
    ];
    return (
        <>
            {
                getAllClients.loading ? <Loader /> :
                    <>
                        <Content Page_title="Transaction Licence" button_status={false} >

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


export default AllLicence

