import React from 'react'
import Content from "../../../Components/Dashboard/Content/Content"
import FullDataTable from '../../../Components/ExtraComponents/Datatable/FullDataTable'



const System = () => {




    const products = [];

    // Create 50 items
    for (let i = 1; i <= 50; i++) {
        products.push({
            id: i,
            name: i % 2 === 0 ? "mango" : "banana", // Alternating between mango and banana names
            price: Math.floor(Math.random() * 100) + 1, // Random price between 1 and 100
        });
    }


    const columns = [
        {
            dataField: 'id',
            text: 'Product ID',
            Cell: row => (
                <div>
                    <span title={row.value}>{row.value}</span>
                </div>
            )
        },
        {
            dataField: 'name',
            text: 'Product Name'
        },
        {
            dataField: 'price',
            text: 'Product Name'
        },
        {
            dataField: 'price',
            text: 'Product Name'
        },
        {
            dataField: 'price',
            text: 'Product Name'
        },
        {
            dataField: 'price',
            text: 'Product Name'
        },
        {
            dataField: 'price',
            text: 'Product Name'
        },
    ];




    return <>
        <Content Page_title="System">

            <FullDataTable tableData={products} TableColumns={columns} />

        </Content>
    </>
}


export default System


