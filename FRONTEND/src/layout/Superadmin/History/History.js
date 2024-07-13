import React, { useRef, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Theme_Content from "../../../Components/Dashboard/Content/Theme_Content";
import { fDateTimeSuffix, dateFormate } from "../../../Utils/Date_formet";
import { Get_Panel_History } from '../../../ReduxStore/Slice/Superadmin/SuperAdminSlice';
import FullDataTable from "../../../Components/ExtraComponents/Datatable/FullDataTable";
import Loader from '../../../Utils/Loader';
import { Form } from "react-bootstrap";

const History = () => {
    const dispatch = useDispatch();
    const monthRef = useRef("");
    const dayRef = useRef("");

    const [getFilterValue, setFilterValue] = useState("");
    const [searchInput, setSearchInput] = useState('');
    const [monthFilter, setMonthFilter] = useState('');
    const [allData, setAllData] = useState({ loading: true, data: [] });
    const [filteredData, setFilteredData] = useState([]);
    const [licAdd, setLicAdd] = useState(false);

    const columns = [
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
        }
    ];

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
                
                <Form.Check
                    type="switch"
                    onClick={() => setLicAdd(!licAdd)}
                    style={{ marginLeft: 'auto',width: '100px' }}
                />
            </div>

            {allData.loading ? <Loader /> : <FullDataTable TableColumns={columns} tableData={filteredData} />}
        </Theme_Content>
    );
};

export default History;
