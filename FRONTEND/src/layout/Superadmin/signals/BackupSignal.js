
import React, { useEffect, useState } from 'react'
import Content from "../../../Components/Dashboard/Content/Content"
import Loader from '../../../Utils/Loader'

import FullDataTable from "../../../Components/ExtraComponents/Datatable/FullDataTable"
import { GetAllDeletedSignal, BackupSignal } from '../../../ReduxStore/Slice/Superadmin/SuperAdminSlice'
import { useDispatch, useSelector } from "react-redux";
import Modal from '../../../Components/ExtraComponents/Modal';
import { fa_time, fDateTimeSuffix, today } from "../../../Utils/Date_formet";
import { useLocation, useNavigate } from 'react-router-dom';
import { RotateCcw , Pencil } from 'lucide-react';
import ToastButton from "../../../Components/ExtraComponents/Alert_Toast";
import toast from 'react-hot-toast';




const AdminHelps = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    let location = useLocation();
    let admin_details = location.state
    const user_id = JSON.parse(localStorage.getItem("user_details"))
    const backend_rul = localStorage.getItem("backend_rul");
    const token = JSON.parse(localStorage.getItem("user_details")).token
    const UserName = JSON.parse(localStorage.getItem("user_details")).UserName
    const panel_name = localStorage.getItem("panel_name");
    const [refresh, setRefresh] = useState(false)


    const [getDeleteSignals, setDeletSignals] = useState({
        loading: true,
        data: []
    });


 

    const data = async () => {
        const data={backend_rul : backend_rul}
        await dispatch(GetAllDeletedSignal(data)).unwrap()
            .then((response) => {
                if (response.status) {
                    setDeletSignals({
                        loading: false,
                        data: response.data
                    });
                } else {
                    setDeletSignals({
                        loading: false,
                        data: []
                    });
                }
            })
    }
    useEffect(() => {
        data()
    }, [refresh])


    const handleDelete = async (id) => {
        const data = { id: id , backend_rul: backend_rul , superadmin_name: UserName ,  panel_name : panel_name }
        await dispatch(BackupSignal(data)).unwrap()
            .then((response) => {
                if (response.status) {
                    toast.success("Signal Backup successfully")
                    setRefresh(!refresh)
                }
                else {
                    toast.error("some error finds")
                }
            }).catch((err) => {
                return;
            })


    }





    const columns = [

        {
            dataField: "index",
            text: "SR. No.",
            formatter: (cell, row, rowIndex) => rowIndex + 1,
        },
        {
            dataField: 'symbol',
            text: 'Symbol'
        },
        {
            dataField: 'strategy',
            text: 'Strategy'
        },
        {
            dataField: 'entry_type',
            text: 'Entry Type'
        },
        {
            dataField: 'entry_price',
            text: 'Entry Price',
           
        },
        {
            dataField: 'exit_price',
            text: 'Exit Price',
             
        },
        {
            dataField: 'entry_qty',
            text: 'Entry Quantity'
        },
        {
            dataField: 'createdAt',
            text: 'Date',
            formatter: (cell, row) => (
                <><div>{cell.split('T')[0] + "   " + cell.split('T')[1].split('.')[0]}</div> </>
            ),
        },
        {
            dataField: '',
            text: 'Action',
            formatter: (cell, row) => (
                <>
                    <RotateCcw  onClick={() => handleDelete(row._id)} />
                </>
            ),
        },

    ];

    const handleBackupBtn =()=>{
        navigate('/super/signals')
    }

    return (
        <>
            {
                getDeleteSignals.loading ? <Loader /> :
                    <>
                        <Content Page_title="Deleted Signal" button_status={true} button_title='Back' route='/super/permitions'>
                            <div>
                                <button className='btn btn-primary mb-3' onClick={handleBackupBtn}>Signal</button>
                            </div>
                            <FullDataTable TableColumns={columns} tableData={getDeleteSignals.data} pagination1={true} />
                        </Content>
                    </>
            }

            
        </ >
    )
}


export default AdminHelps
