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
import { Expired_Soon_User } from '../../../../ReduxStore/Slice/Admin/LicenceSlice';
import { fDate, fDateTimeSuffix } from '../../../../Utils/Date_formet';



const ExpiredLicence = () => {

    const dispatch = useDispatch()

    const token = JSON.parse(localStorage.getItem("user_details")).token



    const [getAllClients, setAllClients] = useState({
        loading: true,
        data: []
    });


    const data = async () => {
        await dispatch(Expired_Soon_User({ token: token })).unwrap()
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
            text: "SR. No.",
            formatter: (cell, row, rowIndex) => rowIndex + 1,
        },
        {
            dataField: 'UserName',
            text: 'User Name',
            sort: true
        },
        {
            dataField: 'Email',
            text: 'Email',
            sort: true
        },
        {
            dataField: 'PhoneNo',
            text: 'Phone Number',
            sort: true
        },
        {
            dataField: 'StartDate',
            text: 'Start Date',
            formatter: (cell, row) => fDateTimeSuffix(row.StartDate)
            ,
            sort: true
        },
        {
            dataField: 'EndDate',
            text: 'End Date',
            formatter: (cell, row) => fDateTimeSuffix(row.EndDate)
            ,
            sort: true
        },
    ];
    return (
        <>
            {
                getAllClients.loading ? <Loader /> :
                    <>
                        <Content Page_title="Expired Soon Licence" button_status={false} >

                            {
                                getAllClients.data && getAllClients.data.length === 0 ? (
                                    'No data found') :
                                    <>
                                        <FullDataTable TableColumns={columns} tableData={getAllClients.data} />
                                    </>
                            }

                        </Content>
                    </>
            }



        </ >
    )

}


export default ExpiredLicence

