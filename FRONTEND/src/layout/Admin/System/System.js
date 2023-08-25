import React from 'react'
import Content from "../../../Components/Dashboard/Content/Content"
import FullDataTable from '../../../Components/ExtraComponents/Datatable/FullDataTable'
import BasicDataTable from '../../../Components/ExtraComponents/Datatable/BasicDataTable'

import { Pencil, Trash2 } from 'lucide-react';



const System = () => {

    const products = [];

    // Create 50 items
    for (let i = 1; i <= 1; i++) {
        products.push({
            id: i,
            name: i % 2 === 0 ? "mango" : "banana", // Alternating between mango and banana names
            price: Math.floor(Math.random() * 100) + 1, // Random price between 1 and 100
        });
    }


    const Company_columns = [
        {
            dataField: 'id',
            text: 'Company ID',
            Cell: row => (
                <div>
                    <span title={row.value}>{row.value}</span>
                </div>
            )
        },
        {
            dataField: 'name',
            text: 'Company Name'
        },
        {
            dataField: 'price',
            text: 'Company Short Name'
        },
        {
            dataField: 'price',
            text: 'Broker Name'
        },
        {
            dataField: 'price',
            text: 'Version'
        },
        {
            dataField: 'Action',
            text: 'Action',
            formatter: (cell, row) => (
                <div>
                    <span data-toggle="tooltip" data-placement="top" title="Edit">
                        <Pencil size={20} color="#198754" strokeWidth={2} className="mx-1" />
                    </span>
                 
                </div>
            ),
        },
    ];

    const Email_columns = [
        {
            dataField: 'id',
            text: 'Email ID',
            Cell: row => (
                <div>
                    <span title={row.value}>{row.value}</span>
                </div>
            )
        },
        {
            dataField: 'Email',
            text: 'Email'
        },
        {
            dataField: 'CC',
            text: 'CC'
        },
        {
            dataField: 'BCC',
            text: 'BCC'
        },
        {
            dataField: 'Password',
            text: 'Password'
        },
        {
            dataField: 'SMTP Host',
            text: 'SMTP Host'
        },
        {
            dataField: 'SMTP Port',
            text: 'SMTP Port'
        },
        {
            dataField: 'Action',
            text: 'Action',
            formatter: (cell, row) => (
                <div>
                    <span data-toggle="tooltip" data-placement="top" title="Edit">
                        <Pencil size={20} color="#198754" strokeWidth={2} className="mx-1" />
                    </span>
                 
                </div>
            ),
        },
    ];
    return <>
        <Content Page_title="System">


            <h2>Company Information</h2>
            <BasicDataTable tableData={products} TableColumns={Company_columns} dropdown={false} />
            <br />

            <h2>Email Information</h2>
            <BasicDataTable tableData={products} TableColumns={Email_columns} dropdown={false} />
            <br />

        </Content>
    </>
}


export default System


