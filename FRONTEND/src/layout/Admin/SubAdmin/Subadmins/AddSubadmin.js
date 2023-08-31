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
import { useDispatch, useSelector } from "react-redux";
import Modal from '../../../../Components/ExtraComponents/Modal';


const AllSubadmin = () => {

    const dispatch = useDispatch()

    const [first, setfirst] = useState('all')
    const [showModal, setshowModal] = useState(false)

    const [Addsubadmin, setAddsubadmin] = useState({
        loading: false,
        data: []
    });


    // const data = async () => {
    //     await dispatch(Get_All_SUBADMIN()).unwrap()
    //         .then((response) => {
    //             if (response.status) {
    //                 setAddsubadmin({
    //                     loading: false,
    //                     data: response.data
    //                 });
    //             }
    //         })
    // }
    // useEffect(() => {
    //     data()
    // }, [])

  
    return (
        <>
            {
                Addsubadmin.loading ? <Loader /> :
                    <>
                        <Theme_Content Page_title="Add SubAdmin" button_title="Back" route="/admin/subadmin">

                     <h1>okkk</h1>
                        </Theme_Content>
                    </>
            }



        </ >
    )
    {/* <>
        <Content Page_title="AllSubadmin">
            <p>AllSubadmin 123</p>
        </Content>
        )
    </> */}
}


export default AllSubadmin
