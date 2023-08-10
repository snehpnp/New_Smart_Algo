/* eslint-disable react/jsx-no-undef */
import React from 'react'
import TableWIthCustomPaginations from '../../../Components/ExtraComponents/Tables/TableWIthCustomPaginations'
import Content from '../../../Components/Dashboard/Content/Content'

const History = () => {


    const data = [];

    // Create 50 items
    for (let i = 1; i <= 5000; i++) {
        data.push({
            id: i,
            name: i % 2 === 0 ? "mango" : "banana", // Alternating between mango and banana names
            price: Math.floor(Math.random() * 100) + 1, // Random price between 1 and 100
        });
    }

    return (
        <div>
            <Content Page_title="TableWithIconButtons">
                <TableWIthCustomPaginations tableData={data} />
            </Content >
        </div>
    )
}

export default History