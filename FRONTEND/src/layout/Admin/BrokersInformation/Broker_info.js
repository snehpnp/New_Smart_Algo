// import React from 'react'
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Theme_Content from "../../../Components/Dashboard/Content/Theme_Content"
import Loader from '../../../Utils/Loader'
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";

import FullDataTable from "../../../Components/ExtraComponents/Datatable/FullDataTable"
import { GET_BROKER_INFORMATIONS } from '../../../ReduxStore/Slice/Admin/DashboardSlice'
import { useDispatch, useSelector } from "react-redux";
import { fa_time } from "../../../Utils/Date_formet";


const Broker_info = () => {

    const dispatch = useDispatch()

    const [showModal, setshowModal] = useState(false)

    const [getAllClients, setAllClients] = useState({
        loading: true,
        data: []
    });




    const data = async () => {
        await dispatch(GET_BROKER_INFORMATIONS()).unwrap()
            .then((response) => {
                if (response.status) {
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
    }, [])

    const columns = [
        {
            dataField: 'index',
            text: 'S.No.',
            formatter: (cell, row, rowIndex) => rowIndex + 1,
        },
        {
            dataField: 'broker_name',
            text: 'User Name'
        },
        {
            dataField: 'app_code',
            text: 'App Code'
        },
        {
            dataField: 'createdAt',
            text: 'Create Date',
            formatter: (cell, row) => fa_time(cell)

        },
        {
            dataField: "actions",
            text: "Actions",
            formatter: (cell, row) => (
                <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                    <div>
                        <Link to={`/admin/brokerinfo/edit/${row._id}`} state={row}>
                            <span data-toggle="tooltip" data-placement="top" title="Edit">
                                <Pencil
                                    size={20}
                                    color="#198754"
                                    strokeWidth={2}
                                    className="mx-1"
                                />
                            </span>
                        </Link>
                    </div>
                </div>

            ),
        },


    ];


    return (
        <>
            {
                getAllClients.loading ? <Loader /> :
                    <>
                        <Theme_Content Page_title="Set Broker Information" button_status={false}  >


                            <FullDataTable TableColumns={columns} tableData={getAllClients.data} />
                        </Theme_Content>
                    </>
            }

        </ >
    )


}


export default Broker_info;


