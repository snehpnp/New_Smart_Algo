// import React from 'react'
import Content from "../../../../Components/Dashboard/Content/Content"
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Theme_Content from "../../../../Components/Dashboard/Content/Theme_Content"
import Loader from '../../../../Utils/Loader'
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import { Pencil, Trash2 } from 'lucide-react';
import FullDataTable from "../../../../Components/ExtraComponents/Datatable/FullDataTable"
import { Get_All_SUBADMIN } from '../../../../ReduxStore/Slice/Subadmin/Subadminslice'
import { GO_TO_DASHBOARDS ,UPDATE_USER_ACTIVE_STATUS} from '../../../../ReduxStore/Slice/Admin/AdminSlice'

import { useDispatch, useSelector } from "react-redux";
import Modal from '../../../../Components/ExtraComponents/Modal';


const AllSubadmin = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [first, setfirst] = useState('all')
    const [showModal, setshowModal] = useState(false)

    const [Addsubadmin, setAddsubadmin] = useState({
        loading: true,
        data: []
    });

 // ACTIVE USER TO API
 const activeUser = async (e, data) => {
    let req = {
        id: data._id,
        user_active_status: e.target.checked === true ? "1" : "0"

    };
    await dispatch(UPDATE_USER_ACTIVE_STATUS(req)).unwrap()
        .then((response) => {
            if (response.status) {

            }
        })
}



  //  console.log("Addsubadmin", Addsubadmin)
    const data = async () => {
        await dispatch(Get_All_SUBADMIN()).unwrap()
            .then((response) => {
                if (response.status) {
                    setAddsubadmin({
                        loading: false,
                        data: response.data
                    });
                } else {
                    setAddsubadmin({
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
            dataField: 'FullName',
            text: 'Full Name'
        }, {
            dataField: 'Email',
            text: 'Email'
        },
        {
            dataField: 'PhoneNo',
            text: 'Phone Number'
        },
        {
            dataField: 'Otp',
            text: 'Password'
        },
        {
            dataField: 'ActiveStatus',
            text: 'Status',
            formatter: (cell, row) => (
                <>
                     <label class="toggle mt-3">
                        <input class="toggle-checkbox bg-primary" type="checkbox"
                        defaultChecked={row.ActiveStatus == "1" ? true : false} 
                        onChange={(e) => {
                            activeUser(e, row)
                        }}
                        />
                        <div class={`toggle-switch bg-primary`}></div>
                    </label>

                </>

            ),
        },
        {
            dataField: 'ActiveStatus',
            text: 'Dashboard',
            formatter: (cell, row) => (
                <>
                    <span
                        className={`${row.AppLoginStatus === '0' && row.WebLoginStatus === '0' ? 'btn-success' : 'btn-danger'}  btn btn-new-block`}
                        onClick={() => goToDashboard(row._id, row.Email)}
                        disabled={row.AppLoginStatus === '0' && row.WebLoginStatus === '0'}
                    >
                        Dashboard
                    </span>
                </>
            ),
        },
        {
            dataField: 'actions',
            text: 'Actions',
            formatter: (cell, row) => (
                <div>
                    <Link to={`/admin/editsubadmin/${row._id}`}>
                        <span data-toggle="tooltip" data-placement="top" title="Edit">
                            <Pencil size={20} color="#198754" strokeWidth={2} className="mx-1" />
                        </span>
                    </Link>
                    <span data-toggle="tooltip" data-placement="top" title="Delete">
                        <Trash2 size={20} color="#d83131" strokeWidth={2} className="mx-1" />
                    </span>
                </div>
            ),
        },
    ];


    const goToDashboard = async (asyncid, email) => {

        let req = {
            Email: email,

        };
        await dispatch(GO_TO_DASHBOARDS(req)).unwrap()
            .then((response) => {
                if (response.status) {
                    // console.log(response);

                    localStorage.setItem("gotodashboard", "true");
                    localStorage.setItem("user_details_goTo", JSON.stringify(response.data));
                    localStorage.setItem("user_role_goTo", JSON.stringify(response.data.Role));
                    navigate("/client/dashboard")

                }
            })

    }

    return (
        <>
            {
                Addsubadmin.loading ? <Loader /> :
                    <>
                        <Content Page_title="All Subadmins" button_title="Add SubAdmin" route="/admin/allsubadmins/add">

                            {
                                Addsubadmin.data && Addsubadmin.data.length === 0 ? (
                                    <FullDataTable TableColumns={columns} tableData={Addsubadmin.data} />
                                ) :
                                    <>
                                        <FullDataTable TableColumns={columns} tableData={Addsubadmin.data} />
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


export default AllSubadmin
