import React from 'react'
import FullDataTable from "../../../Components/ExtraComponents/Datatable/FullDataTable"
import { Pencil, Trash2 } from 'lucide-react';
import { Link } from "react-router-dom";

import Modal from '../../../Components/ExtraComponents/Modal';

const ShowAllClients = ({ showModal, setshowModal }) => {

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
            dataField: 'Email',
            text: 'Password'
        },
        {
            dataField: 'status',
            text: 'Password'
        },
        {
            dataField: 'Broker Status',
            text: 'Password'
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
    return (
        <div>
              <Modal isOpen={showModal} backdrop="static" size="xl" title="Show All Clients" hideBtn={true}
            handleClose={() => setshowModal(false)}
        >
            <FullDataTable TableColumns={columns}
                tableData={columns}
            />
        </Modal>
        </div>
    )
}

export default ShowAllClients