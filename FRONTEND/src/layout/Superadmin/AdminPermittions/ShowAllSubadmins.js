
import React, { useEffect, useState } from 'react'
import FullDataTable from "../../../Components/ExtraComponents/Datatable/FullDataTable"
import { Pencil, Trash2 } from 'lucide-react';
import { Link } from "react-router-dom";
import { Get_All_Subadmin_Client } from '../../../ReduxStore/Slice/Superadmin/SuperAdminSlice'
import { useDispatch, useSelector } from "react-redux";

import Modal from '../../../Components/ExtraComponents/Modal';

const ShowAllSubadmins = ({ showModal, setshowModal, List }) => {

    const [ShowClients, setshowClients] = useState([])




    const dispatch = useDispatch()

    const data = async () => {

        if (showModal) {

            await dispatch(Get_All_Subadmin_Client(List)).unwrap()
                .then((response) => {
                    if (response.status) {
                        setshowClients(
                            response.data
                        );
                    }
                })
        }

    }

    useEffect(() => {
        data()
    }, [List])



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


    ];
    return (
        <div>
            <Modal isOpen={showModal} backdrop="static" size="xl" title="All Subadmin" hideBtn={true}
                handleClose={() => setshowModal(false)}
            >
                <FullDataTable TableColumns={columns}
                    tableData={ShowClients && ShowClients}

                />
            </Modal>
        </div>
    )
}

export default ShowAllSubadmins