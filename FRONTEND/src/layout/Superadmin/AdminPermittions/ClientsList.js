
import React, { useEffect, useState } from 'react'
import Content from "../../../Components/Dashboard/Content/Content"
import Loader from '../../../Utils/Loader'
import { Pencil, Trash2 } from "lucide-react";
import { Link } from 'react-router-dom';

import FullDataTable from "../../../Components/ExtraComponents/Datatable/FullDataTable"
import { Get_Admin_Helps } from '../../../ReduxStore/Slice/Superadmin/SuperAdminSlice'
import { useDispatch, useSelector } from "react-redux";
import Modal from '../../../Components/ExtraComponents/Modal';
import { fa_time, fDateTimeSuffix, today } from "../../../Utils/Date_formet";
import { useLocation } from 'react-router-dom';
import { Get_All_Admin_Client } from '../../../ReduxStore/Slice/Superadmin/SuperAdminSlice'

import toast, { Toaster } from 'react-hot-toast';
import { DELETE_USER_SERVICES } from "../../../ReduxStore/Slice/Admin/AdminSlice";



const SubAdminList = () => {
    const dispatch = useDispatch()
    const [ShowClients, setshowClients] = useState([])
    const [refresh, setrefresh] = useState(false);
    let location = useLocation();
    console.log("=>", location.state._id)


    const GetAllClients = async () => {
        await dispatch(Get_All_Admin_Client({ id: location.state._id })).unwrap()
            .then((response) => {
                if (response.status) {
                    setshowClients(
                        response.data
                    );
                }
            })
    }


    const Delete_user = async (id) => {
        var req1 = {
            id: id,
        };
        if (window.confirm("Do you want to delete this User ?")) {
            await dispatch(DELETE_USER_SERVICES(req1))
                .unwrap()
                .then((response) => {
                    if (response.status) {
                        toast.success(response.msg);

                        setrefresh(!refresh);
                    } else {
                        toast.error(response.msg);

                    }
                });
        } else {
            return
        }
    };

    const showBrokerName = (value1, licence_type) => {
        let value = parseInt(value1);

        if (licence_type === "0") {
            return "2 Days Only";
        } else if (licence_type === "1") {
            return "Demo";
        } else {
            if (value === 1) {
                return "markethub";
            }
            if (value === 1) {
                return "markethub";
            } else if (value === 2) {
                return "alice blue";
            } else if (value === 3) {
                return "master trust";
            } else if (value === 4) {
                return "Motilal Oswal";
            } else if (value === 5) {
                return "Zebull";
            } else if (value === 6) {
                return "IIFl";
            } else if (value === 7) {
                return "Kotak";
            } else if (value === 8) {
                return "Mandot";
            } else if (value === 9) {
                return "Choice";
            } else if (value === 10) {
                return "Anand Rathi";
            } else if (value === 11) {
                return "B2C";
            } else if (value === 12) {
                return "Angel";
            } else if (value === 13) {
                return "Fyers";
            } else if (value === 14) {
                return "5-Paisa";
            } else if (value === 15) {
                return "Zerodha";
            }
        }
    };


    const showLicenceName = (value1, licence_type) => {
        let value = parseInt(value1);

        if (licence_type === "0") {
            return "2 Days Only";
        } else if (licence_type === "1") {
            return "Demo";
        } else {
            return "Live";
        }
    };




    const columns = [
        {
            dataField: "index",
            text: "SR. No.",
            formatter: (cell, row, rowIndex) => rowIndex + 1,

        },
        {
            dataField: 'UserName',
            text: 'User Name'
        }, {
            dataField: 'Email',
            text: 'Email'
        },
        {
            dataField: 'PhoneNo',
            text: 'Phone Number'
        },
        {
            dataField: 'broker',
            text: 'Broker'
            ,
            formatter: (cell, row) => (
                <span >
                    {showBrokerName(cell, row.license_type)}
                </span>
            )
        },
        {
            dataField: 'license_type',
            text: 'Licence Type',
            formatter: (cell, row) => showLicenceName(cell, row.license_type)

        },


        {
            dataField: "actions",
            text: "Actions",
            formatter: (cell, row) => (
                <div style={{ width: "120px" }}>
                    <div>
                        <Link to={`/admin/client/edit/${row._id}`} state={row}>
                            <span data-toggle="tooltip" data-placement="top" title="Edit">
                                <Pencil
                                    size={20}
                                    color="#198754"
                                    strokeWidth={2}
                                    className="mx-1"
                                />
                            </span>
                        </Link>

                        <Link>
                            <span data-toggle="tooltip" data-placement="top" title="Delete">
                                <Trash2
                                    size={20}
                                    color="#d83131"
                                    strokeWidth={2}
                                    className="mx-1"
                                    onClick={(e) => Delete_user(row._id)}
                                />
                            </span>
                        </Link>
                        {/* : ""}  */}

                    </div>
                </div>
            ),
        },

    ];

    useEffect(() => {
        GetAllClients()
    }, [])


    // console.log("ShowClients", ShowClients )

    return (
        <>
            {ShowClients.loading ? (
                <Loader />
            ) : (
                <Content Page_title="Client List" button_status={true} button_title='Back' route='/super/permitions'>
                    {ShowClients.data ?
                        <FullDataTable TableColumns={columns} tableData={ShowClients.data} />
                        :
                        <FullDataTable TableColumns={columns} tableData={[]} />
                    }
                </Content>
            )}
        </>
    )
}


export default SubAdminList
