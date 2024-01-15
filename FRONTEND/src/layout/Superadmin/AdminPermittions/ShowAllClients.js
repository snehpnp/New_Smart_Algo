import React, { useEffect, useState } from 'react'
import FullDataTable from "../../../Components/ExtraComponents/Datatable/FullDataTable"
import { Pencil, Trash2 } from 'lucide-react';
import { Link } from "react-router-dom";
import { Get_All_Admin_Client } from '../../../ReduxStore/Slice/Superadmin/SuperAdminSlice'
import { useDispatch, useSelector } from "react-redux";

import Modal from '../../../Components/ExtraComponents/Modal';

const ShowAllClients = ({ showModal, setshowModal, List }) => {

    const [ShowClients, setshowClients] = useState([])

    const dispatch = useDispatch()

    const data = async () => {

        if (showModal) {

            await dispatch(Get_All_Admin_Client(List)).unwrap()
                .then((response) => {

                    if (response.status) {
                        setshowClients(
                            response.data
                        );
                    }
                })
        }

    }








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
    ];





    useEffect(() => {
        data()
    }, [List])


    return (
        <div>
            <Modal isOpen={showModal} backdrop="static" size="xl" title="Show All Clients" hideBtn={true}
                handleClose={() => setshowModal(false)}
            >
                <FullDataTable TableColumns={columns}
                    tableData={ShowClients && ShowClients}
                />
            </Modal>
        </div>
    )
}

export default ShowAllClients