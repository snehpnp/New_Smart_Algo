import React, { useEffect, useState } from "react";
import axios from "axios";
import Form from 'react-bootstrap/Form';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Dropdown from 'react-bootstrap/Dropdown';
import { Row, Col } from 'react-bootstrap';
import Select from 'react-select'
import Content from "../../../Components/Dashboard/Content/Content";
import BasicDataTable from "../../../Components/ExtraComponents/Datatable/BasicDataTable";
import FullDataTable from "../../../Components/ExtraComponents/Datatable/FullDataTable";
import Loader from "../../../Utils/Loader";
import { fa_time, fDateTimeSuffix } from "../../../Utils/Date_formet";
import { Pencil, Trash2, GanttChartSquare } from "lucide-react";
import { Get_All_Signals } from "../../../ReduxStore/Slice/Admin/SignalsSlice";
import { useDispatch, useSelector } from "react-redux";
import { Get_All_Strategy } from "../../../ReduxStore/Slice/Admin/StrategySlice";
import { get_time_frame, get_source, get_comparators, Add_Make_Strategy, get_all_make_strategy, delete_make_strategy, delete_make_strategy_selected } from "../../../ReduxStore/Slice/Common/make_strategy_slice";
import { CandlestickChart } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import ToastButton from "../../../Components/ExtraComponents/Alert_Toast";
import { Link, useNavigate } from "react-router-dom";
import Chart from "./Chart"




const AllMakeStrategy = () => {
    const AdminToken = JSON.parse(localStorage.getItem("user_details")).token;

    const dispatch = useDispatch()
    const navigate = useNavigate()


    const [first, setfirst] = useState('all')
    const [showModal, setshowModal] = useState(false)
    const [showModaluser, setshowModaluser] = useState(false)
    const [originalData, setOriginalData] = useState([]);

    //  For Mnage Multipfiter
    const [searchInput, setSearchInput] = useState("");
    const [test, settest] = useState(false)
    const [refresh, setrefresh] = useState(false)
    const [getServicesName, setServicesName] = useState({
        loading: true,
        data: []
    })
    const [getServicesuserName, setServicesuserName] = useState([])
    const [showChartModal, setshowChartModal] = useState(false)
    const [showChart1, setshowChart1] = useState(false)

    const [SelectedRowData, setSelectedRowData] = useState("")


    const [AllMakeStrategy, setAllMakeStrategy] = useState({
        loading: false,
        data: []
    });



    const columns = [
        {
            dataField: "index",
            text: "SR. No.",
            sort: true,
            formatter: (cell, row, rowIndex) => rowIndex + 1,
        },
        {
            dataField: 'show_strategy',
            text: 'Strategy Name',
            sort: true,

        },
        {
            dataField: 'strategy_name',
            text: 'Strategy Tag',
            sort: true,

        },
        {
            dataField: 'symbol_name',
            text: 'Script Name',
            sort: true,

        },
        {
            dataField: 'type',
            text: 'Transaction Type',
            sort: true,


        },
        {
            dataField: 'type',
            text: 'Candle Chart',
            sort: true,
            formatter: (cell, row) => (
                <div><CandlestickChart
                    onClick={() => {
                        setshowChartModal(true)

                        setSelectedRowData(row)
                    }
                    } />
                </div>
            ),
        },
        {
            dataField: 'actions',
            text: 'Actions',
            sort: true,

            formatter: (cell, row) => (
                <div>

                    <Link to={`/admin/MakeStrategy/edit/${row._id}`} data-toggle="tooltip" data-placement="top" title="Edit">
                        < Pencil size={20} color="#198754" strokeWidth={2} className="mx-1" />
                    </Link>
                    <span data-toggle="tooltip" data-placement="top" title=" Delete">
                        <Trash2 size={20} color="#d83131" strokeWidth={2} className="mx-1" onClick={(e) => DeleteGroup(row)} />
                    </span>

                </div>
            ),
        },
    ];







    // DELETE GROUP
    const DeleteGroup = async (row) => {
        // alert("okk")
        if (window.confirm("Do You Really Want To Delete ?")) {

            await dispatch(delete_make_strategy(
                {
                    req: {
                        page: "1",
                        limit: "100",
                        id: row._id
                    },
                    token: AdminToken,
                }
            )).unwrap()
                .then((response) => {
                  
                    if (response.status) {
                        toast.success(response.msg)
                        setrefresh(!refresh)
                        // window.location.reload()
                    } else {

                        toast.error(response.msg)
                    }
                })
        }
    }

    // GET ALL GROUP SERVICES NAME
    const data = async () => {

        await dispatch(get_all_make_strategy(
            {
                req: {
                    page: "1",
                    limit: "100",
                },
                token: AdminToken,
            }
        )).unwrap()
            .then((response) => {
                if (response.status) {
                    setAllMakeStrategy({
                        loading: false,
                        data: response.data
                    });


                } else {
                    setAllMakeStrategy({
                        loading: false,
                        data: response.data
                    });
                }
                setOriginalData(response.data);
            })
            
    }

    useEffect(() => {
        data();
    }, [refresh])




 
    //  MANAGE MULTIFILTER
    useEffect(() => {
        const filteredData = originalData.filter((item) => {
            return (
                item.name.toLowerCase().includes(searchInput.toLowerCase())
            );
        });
        setAllMakeStrategy({
            loading: false,
            data: searchInput ? filteredData : originalData,
        });
    }, [searchInput, originalData]);



    const ResetDate = (e) => {
        e.preventDefault();
        setSearchInput("");
    };




    const [selected, setSelected] = useState([]);
    const [selected1, setSelected1] = useState([]);

    const handleOnSelect = (row, isSelect) => {
        
        if (isSelect) {
            setSelected([...selected, row._id]);
            setSelected1([...selected1, row]);
        } else {
            setSelected(selected.filter(x => x !== row._id));
            setSelected1(selected1.filter(x => x._id !== row._id));
        }

    }


    const handleOnSelectAll = (isSelect, rows) => {
        const ids = rows.map(r => r._id);
        if (isSelect) {
            setSelected(ids);
            setSelected1(rows);
        } else {
            setSelected([]);
            setSelected1([]);
        }
    }

    const selectRow = {
        mode: 'checkbox',
        clickToSelect: true,
        selected: selected,
        onSelect: handleOnSelect,
        onSelectAll: handleOnSelectAll
    };




    const SelectedAllDelete = async (e) => {
        
        if (selected.length > 0) {
            // alert("okk");
            if (window.confirm("Do You Really Want To Delete Selected Row ?")) {
                await dispatch(delete_make_strategy_selected(
                    {
                        req: {
                            ids_array: selected
                        },
                        token: AdminToken,
                    }
                )).unwrap()
                    .then((response) => {
                    
                        if (response.status) {
                            toast.success(response.msg)
                            setrefresh(!refresh)
                            // window.location.reload()
                        } else {

                            toast.error(response.msg)
                        }
                    })
            }
        }

    }


    return (
        <>
            {
                AllMakeStrategy.loading ? <Loader /> :
                    <>
                        <Content Page_title="All Make strategies" button_title="Create Strategy" route="/admin/createstrategy">

                            <div className="row">
                                <div className="col-lg-4">
                                    <div class="mb-3">
                                        <label for="exampleFormControlInput1" class="form-label">
                                            Search Something Here
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Search..."
                                            value={searchInput}
                                            onChange={(e) => setSearchInput(e.target.value)}
                                            class="form-control"
                                            id="exampleFormControlInput1"
                                        />
                                    </div>
                                </div>

                                {/* <div className="col-lg-2 mt-3">
                                    <button
                                        className="btn btn-primary mt-2"
                                        onClick={(e) => ResetDate(e)}
                                    >
                                        Reset
                                    </button>
                                </div> */}

                                {
                                    AllMakeStrategy.data.length > 0 ?
                                        <div className="col-lg-2 mt-3">
                                            <button className='btn btn-primary mt-2' disabled={selected == "" ? true : false} onClick={SelectedAllDelete}>Deleted</button>
                                        </div>
                                        : ""
                                }


                            </div>

                            <FullDataTable
                                keyField="_id"
                                TableColumns={columns}
                                tableData={AllMakeStrategy.data}
                                pagination1={true}
                                selectRow={selectRow}

                            />

                            {
                                showModal ?
                                    <>
                                        <Modal isOpen={showModal} backdrop="static" size="ms-5" title="Services" hideBtn={true}
                                            // onHide={handleClose}
                                            handleClose={() => setshowModal(false)}
                                        >
                                            <BasicDataTable TableColumns={[
                                                {
                                                    dataField: "index",
                                                    text: "SR. No.",
                                                    formatter: (cell, row, rowIndex) => rowIndex + 1,
                                                },
                                                {
                                                    dataField: 'data.name',
                                                    text: 'Services Name'
                                                },
                                                {
                                                    dataField: 'data1.group_qty',
                                                    text: 'group_qty'
                                                },
                                            ]} tableData={getServicesName && getServicesName.data} />

                                        </Modal >
                                    </>
                                    : ""
                            }



                            {
                                test ?
                                    <>
                                        <Modal isOpen={test} backdrop="static" size="ms-5" title="Clients Using" hideBtn={true}
                                            // onHide={handleClose}
                                            handleClose={() => settest(false)}
                                        >
                                            <BasicDataTable TableColumns={[
                                                {
                                                    dataField: "index",
                                                    text: "SR. No.",
                                                    formatter: (cell, row, rowIndex) => rowIndex + 1,
                                                },
                                                {
                                                    dataField: 'user.FullName',
                                                    text: 'Services Name'
                                                },
                                                {
                                                    dataField: 'user.TradingStatus',
                                                    text: 'Go To Dashboard',
                                                    formatter: (cell, row, rowIndex) =>
                                                        <>
                                                             
                                                            <button
                                                                className={`btn  ${row.user.AppLoginStatus == '1' || row.user.WebLoginStatus == '1' ? "btn-success" : "btn-danger"} btn-new-block`}


                                                                disabled={row.user.AppLoginStatus === '0' && row.user.WebLoginStatus === '0'}

                                                            > click</button>
                                                        </>
                                                },
                                                {
                                                    dataField: 'user.license_type',
                                                    text: 'Services Name',
                                                    formatter: (cell, row, rowIndex) => cell === '2' ? "Live" : cell === '1' ? "Demo" : "2 Days Only"
                                                },
                                            ]} tableData={getServicesuserName && getServicesuserName.data} />
                                        </Modal >
                                    </>
                                    : ""
                            }

                            <Chart List={SelectedRowData} data1111={() => setSelected([])
                            } showModal={showChartModal} setshowModal={() => setshowChartModal(false)} />


                        </Content>


                        <ToastButton />
                    </>
            }



        </ >
    );
}


export default AllMakeStrategy
