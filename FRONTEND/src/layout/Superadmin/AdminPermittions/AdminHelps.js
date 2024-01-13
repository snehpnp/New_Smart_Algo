
import React, { useEffect, useState } from 'react'
import Content from "../../../Components/Dashboard/Content/Content"
import Loader from '../../../Utils/Loader'

import FullDataTable from "../../../Components/ExtraComponents/Datatable/FullDataTable"
import { Get_Admin_Helps } from '../../../ReduxStore/Slice/Superadmin/SuperAdminSlice'
import { useDispatch, useSelector } from "react-redux";
import Modal from '../../../Components/ExtraComponents/Modal';
import { fa_time, fDateTimeSuffix, today } from "../../../Utils/Date_formet";
import { useLocation } from 'react-router-dom';




const AdminHelps = () => {

    const dispatch = useDispatch()
    let location = useLocation();
    let admin_details = location.state




    const user_id = JSON.parse(localStorage.getItem("user_details")).user_id
    const token = JSON.parse(localStorage.getItem("user_details")).token


    const [getAllClients, setAllClients] = useState({
        loading: true,
        data: []
    });

    const data = async () => {

        let req = {
            "id": admin_details._id,
            "db_url": admin_details.db_url,
            "db_name": admin_details.db_name,
            "startdate": today(),
            "enddate": today()
        }




        await dispatch(Get_Admin_Helps(req, token)).unwrap()
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
            dataField: 'username',
            text: 'User Name'
        },
        {
            dataField: 'email',
            text: 'Email'
        },
        {
            dataField: 'mobile',
            text: 'Phone Number'
        },
        {
            dataField: 'help_msg',
            text: 'Help Message'
        },
        {
            dataField: 'createdAt',
            text: 'Date',
            formatter: (cell, row) => (
                <><div>{cell.split('T')[0] + "   " + cell.split('T')[1].split('.')[0]}</div> </>
                // <><div>{cell.split('.')[0]}</div> </>



            ),
        },

    ];




    return (
        <>
            {
                getAllClients.loading ? <Loader /> :
                    <>
                        <Content Page_title="Help Center" button_status={true} button_title='Back' route='/super/permitions'>


                            <FullDataTable TableColumns={columns} tableData={getAllClients.data} />
                        </Content>
                    </>
            }



        </ >
    )

}


export default AdminHelps
