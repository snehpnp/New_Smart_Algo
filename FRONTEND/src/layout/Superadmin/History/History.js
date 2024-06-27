import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
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

    const [getfiltervalue, setfiltervalue] = useState("");

    const [searchInput, setSearchInput] = useState('');
    const [monthFilter, setMonthFilter] = useState('');
    const [AllData, setAllData] = useState({ loading: true, data: [] });
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
            formatter: (cell, row, rowIndex) => <div>{cell == null ? "-" : cell}</div>
        },
        {
            dataField: 'msg',
            text: 'Message'
        },
        {
            dataField: "createdAt",
            text: "Date & Time",
            formatter: (cell, row, rowIndex) => <div>{fDateTimeSuffix(cell)}</div>,
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
    }, [searchInput, monthFilter, licAdd]);

    const filterData = () => {
        let filtered = AllData.data;

        if (licAdd) {
            filtered = filtered.filter(obj => obj.msg.includes("License Add"));
        }

        if (searchInput) {
            filtered = filtered.filter(item => {
                const matchSearch = searchInput === '' ||
                    item.panal_name.toLowerCase().includes(searchInput.toLowerCase()) ||
                    item.superadmin_name.toLowerCase().includes(searchInput.toLowerCase()) ||
                    item.msg.toLowerCase().includes(searchInput.toLowerCase());

                return matchSearch;
            });
        }

        if (monthFilter) {
            filtered = filtered.filter(obj => dateFormate(obj.createdAt).split(" ")[0].substring(0, 7) === monthFilter);
        }

        if (getfiltervalue) {
            filtered = filtered.filter(obj => dateFormate(obj.createdAt).split(" ")[0].substring(0, 10) === getfiltervalue);
        }
        console.log("==", filtered.filter(obj => dateFormate(obj.createdAt).split(" ")[0].substring(0, 10)))
        setFilteredData(filtered);
    };

    return (
        <Theme_Content Page_title="History" button_status={false}>
            <div className='mb-4' style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ marginRight: '10px' }}>
                    <h6>Search here something</h6>
                    <input
                        type="text"
                        style={{ height: '2rem' }}
                        placeholder='search...'
                        className='p-2 rounded'
                        onChange={(e) => setSearchInput(e.target.value)}
                        value={searchInput}
                    />
                </div>
                <div>
                    <input
                        style={{ position: "absolute", top: "15px", right: "300px" }}
                        ref={dayRef}
                        type="date"

                        onChange={(data) => {
                            setfiltervalue(data.target.value)
                            setMonthFilter("")
                            monthRef.current.value = ""
                        }
                        }
                    />
                    <input
                        ref={monthRef}
                        type="month"
                        style={{ position: "absolute", top: "15px", right: "150px" }}
                        onChange={(e) => {
                            setMonthFilter(e.target.value);
                            setfiltervalue("");
                            dayRef.current.value = ""

                        }}
                    />
                </div>
                <Form.Check
                    type="switch"
                    onClick={() => setLicAdd(!licAdd)}
                    style={{ position: "absolute", right: "100px", top: "15px" }}
                />
            </div>

            {AllData.loading ? <Loader /> : <FullDataTable TableColumns={columns} tableData={filteredData} />}
        </Theme_Content>
    );
};

export default History;
