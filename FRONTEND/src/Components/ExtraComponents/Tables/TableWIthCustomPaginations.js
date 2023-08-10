/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import Content from "../../../Components/Dashboard/Content/Content"
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';



const TableWIthCustomPaginations = ({ tableData }) => {

    const data = tableData

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const maxVisibleButtons = 4;

    // Calculate indexes for current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Slice data for the current page
    const currentData = data.slice(startIndex, endIndex);

    // Calculate total number of pages
    const totalPages = Math.ceil(data.length / itemsPerPage);

    // Handle pagination click
    const handlePageClick = (page) => {
        setCurrentPage(page);
    };

    // Handle shift to first page
    const handleShiftFirst = () => {
        setCurrentPage(1);
    };

    // Handle shift to last page
    const handleShiftLast = () => {
        setCurrentPage(totalPages);
    };

    // Generate an array of middle page numbers to display
    const middleButtons = [];
    const startPage = Math.max(currentPage - Math.floor(maxVisibleButtons / 2), 1);
    const endPage = Math.min(startPage + maxVisibleButtons - 1, totalPages);
    for (let i = startPage; i <= endPage; i++) {
        middleButtons.push(i);
    }


    const [itemsPerPageData, setItemsPerPageData] = useState(5);


    // Handle items per page change
    const handleItemsPerPageChange = (event) => {
        const newItemsPerPage = parseInt(event.target.value, 10);
        setItemsPerPageData(newItemsPerPage);
        setCurrentPage(1); // Reset to the first page
    };

    return (
        <div>

            <div className="table-responsive">
                <Table className="   table-bordered table border table-responsive-md">
                    <thead className="thead-primary text-primary text-center header-class" >
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Age</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((item) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td>{item.age}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <nav aria-label=" Page navigation example"  style={{
                    display:' flex' , justifyContent : 'space-between'}}>
                <div className="items-per-page ">
                <label>Rows per page:</label>
                <select value={itemsPerPageData} onChange={(e) => handleItemsPerPageChange(e)}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                </select>
            </div>
            <ul class="pagination">

                {/* <div className="pagination-container">
                            <div className="custom-pagination"> */}
                <li
                    class="page-item"
                    disabled={currentPage === 1}
                    onClick={handleShiftFirst}
                >
                    <button class="page-link" href="#">
                        First
                    </button>
                </li>
                <li
                    class="page-item"
                    disabled={currentPage === 1}
                    onClick={() => handlePageClick(currentPage - 1)}
                >
                    <button class="page-link" href="#">
                        Previous
                    </button>

                </li>
                {middleButtons.map((page) => (
                    <li
                        key={page}
                        className={` page-item  ${page === currentPage ? 'active' : ''}`}
                        onClick={() => handlePageClick(page)}
                    >
                        <button class="page-link" href={page}>
                            {page}
                        </button>

                    </li>
                ))}
                <li
                    className="page-item"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageClick(currentPage + 1)}
                >
                    <button class="page-link" href="#">

                        Next
                    </button>

                </li>
                <li className="page-item" onClick={handleShiftLast}>
                    <button class="page-link" href="#">
                        Last
                    </button>

                </li>
                {/* </div>
                        </div> */}


            </ul>

        </nav>

        </div >

        </div >
    );
}

export default TableWIthCustomPaginations

