import React, { useRef, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Theme_Content from "../../../Components/Dashboard/Content/Theme_Content";
import { fDateTimeSuffix, dateFormate } from "../../../Utils/Date_formet";
import { Get_Panel_History } from '../../../ReduxStore/Slice/Superadmin/SuperAdminSlice';
import FullDataTable from "../../../Components/ExtraComponents/Datatable/FullDataTable";
import Loader from '../../../Utils/Loader';
import { Form } from "react-bootstrap";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import axios from 'axios';
import * as Config from "../../../Utils/Config";
import Swal from 'sweetalert2';


const History = () => {
    const dispatch = useDispatch();
    const monthRef = useRef("");
    const dayRef = useRef("");
    const user_details = JSON.parse(localStorage.getItem("user_details"));

    const [getFilterValue, setFilterValue] = useState("");
    const [searchInput, setSearchInput] = useState('');
    const [monthFilter, setMonthFilter] = useState('');
    const [allData, setAllData] = useState({ loading: true, data: [] });
    const [filteredData, setFilteredData] = useState([]);
    const [licAdd, setLicAdd] = useState(false);

    let columns = [
        {
            dataField: "index",
            text: "SR. No.",
            formatter: (cell, row, rowIndex) => rowIndex + 1,
        },
        {
            dataField: 'panal_name',
            text: 'Panel Name'
        },
        {
            dataField: 'superadmin_name',
            text: 'Super Admin Name'
        },
        {
            dataField: 'client_id',
            text: 'Client Id',
            formatter: (cell) => <div>{cell == null ? "-" : cell}</div>
        },
        {
            dataField: 'msg',
            text: 'Message'
        },
        {
            dataField: "createdAt",
            text: "Date & Time",
            formatter: (cell) => <div>{fDateTimeSuffix(cell)}</div>,
            sort: true,
        },
       
    ];

    if (user_details.Email === "superadmin@gmail.com") {
        columns.push({
            dataField: "Delete",
            text: "Delete",
            formatter: (cell, row, rowIndex) => (
                <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(row, rowIndex)}
                >
                    <i className="fa fa-trash" /> Delete
                </button>
            ),
            sort: false, // No need to sort on delete column
        });
    }
    
    const handleDelete = (row, rowIndex) => {
    
        console.log("Row to be deleted:", row);
   
        axios.post( `${Config.base_url}delete/history`, {id: row._id})
        .then((res) => {
            console.log(res);
            if (res.data.status) {
           
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'History deleted successfully',
                    showConfirmButton: false,
                    timer: 1500
                });

                fetchData();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Failed',
                    text: 'Failed to delete history',
                    showConfirmButton: false,
                    timer: 1500
                });
            
            }
        })
        .catch((err) => {
            console.log(err);
            alert("Failed to delete history");
        });



    };
    
    const fetchData = async () => {
        const response = await dispatch(Get_Panel_History()).unwrap();
        if (response.status) {
            setAllData({ loading: false, data: response.data });
            setFilteredData(response.data);
        } else {
            setAllData({ loading: false, data: [] });
            setFilteredData([]);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        filterData();
    }, [searchInput, monthFilter, licAdd, getFilterValue]);

    const filterData = () => {
        let filtered = allData.data;

        if (licAdd) {
            filtered = filtered.filter(obj => obj.msg.includes("License Add"));
        }

        if (searchInput) {
            const lowerCaseSearchInput = searchInput.toLowerCase();
            filtered = filtered.filter(item => 
                item.panal_name?.toLowerCase().includes(lowerCaseSearchInput) ||
                item.superadmin_name?.toLowerCase().includes(lowerCaseSearchInput) ||
                item.msg?.toLowerCase().includes(lowerCaseSearchInput)
            );
        }

        if (monthFilter) {
            filtered = filtered.filter(obj => 
                dateFormate(obj.createdAt).split(" ")[0].substring(0, 7) === monthFilter
            );
        }

        if (getFilterValue) {
            filtered = filtered.filter(obj => 
                dateFormate(obj.createdAt).split(" ")[0].substring(0, 10) === getFilterValue
            );
        }

        setFilteredData(filtered);
    };

    const exportToCSV = () => {
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = '.xlsx';

        const dataToExport = filteredData.map((item, index) => ({
            "SR. No.": index + 1,
            "Panel Name": item.panal_name,
            "Super Admin Name": item.superadmin_name,
            "Client Id": item.client_id == null ? "-" : item.client_id,
            "Message": item.msg,
            "Date & Time": fDateTimeSuffix(item.createdAt)
        }));

        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, "History" + fileExtension);
    };

    return (
        <Theme_Content Page_title="History" button_status={false}>
            <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '1rem', gap: '10px', alignItems: 'center' }}>
                <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column' }}>
                    <input
                        type="text"
                        placeholder="Search..."
                        style={{ height: '2rem', padding: '0.5rem', borderRadius: '4px', width: '100%' }}
                        onChange={(e) => setSearchInput(e.target.value)}
                        value={searchInput}
                    />
                </div>
                <div style={{ flex: '1 1 300px', display: 'flex', gap: '10px' }}>
                    <input
                        ref={dayRef}
                        type="date"
                        style={{ height: '2rem', padding: '0.5rem', borderRadius: '4px', width: '100%' }}
                        onChange={(e) => {
                            setFilterValue(e.target.value);
                            setMonthFilter("");
                            monthRef.current.value = "";
                        }}
                    />
                    <input
                        ref={monthRef}
                        type="month"
                        style={{ height: '2rem', padding: '0.5rem', borderRadius: '4px', width: '100%' }}
                        onChange={(e) => {
                            setMonthFilter(e.target.value);
                            setFilterValue("");
                            dayRef.current.value = "";
                        }}
                    />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
                    <Form.Check
                        type="switch"
                        label="License Add"
                        checked={licAdd}
                        onChange={() => setLicAdd(!licAdd)}
                        style={{ width: '100px', marginRight: '10px' }}
                    />
                    <button
                        onClick={exportToCSV}
                        style={{
                            backgroundColor: "blue",
                            color: "white",
                            padding: "5px 10px",
                            border: "none",
                            cursor: "pointer",
                            marginLeft: 'auto'
                        }}
                    >
                        Export Data
                    </button>
                </div>
            </div>

            {allData.loading ? <Loader /> : <FullDataTable TableColumns={columns} tableData={filteredData} />}
        </Theme_Content>
    );
};

export default History;
