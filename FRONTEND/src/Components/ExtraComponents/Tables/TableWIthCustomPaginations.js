/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import Content from "../../../Components/Dashboard/Content/Content"
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';



const TableWIthCustomPaginations = ({ tableData, tableColumn }) => {

    const data = tableData

    return (
        <div>

            <div className="table-responsive">
                <Table className="   table-bordered table border table-responsive-md">
                    <thead className="thead-primary text-primary text-center header-class" >
                        <tr>
                            {tableColumn.map((item) => (
                                <tr key={item.id}>
                                    <th>{item}</th>
                                </tr>
                            ))}

                        </tr>
                    </thead>
                    <tbody>
                        {/* {currentData.map((item) => ( */}
                        {data.map((item) => (
                            <tr key={item.id}>
                                <td>{item._id}</td>
                                <td>{item.name}</td>
                                <td>{item.age}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                {/* <Pagination /> */}
            </div >

        </div >
    );
}

export default TableWIthCustomPaginations


