
import React, { useEffect, useState } from 'react'
import Content from "../../../Components/Dashboard/Content/Content"
import Loader from '../../../Utils/Loader'

import FullDataTable from "../../../Components/ExtraComponents/Datatable/FullDataTable"
import { GetAllSignal, Update_Price, DeleteSignal } from '../../../ReduxStore/Slice/Superadmin/SuperAdminSlice'
import { useDispatch, useSelector } from "react-redux";
import Modal from '../../../Components/ExtraComponents/Modal';
import { fa_time, fDateTimeSuffix, today } from "../../../Utils/Date_formet";
import { useLocation, useNavigate } from 'react-router-dom';
import { Trash2, Pencil } from 'lucide-react';
import ToastButton from "../../../Components/ExtraComponents/Alert_Toast";
import toast from 'react-hot-toast';




const AdminHelps = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    let location = useLocation();
    let admin_details = location.state
    const user_id = JSON.parse(localStorage.getItem("user_details")).user_id
    const token = JSON.parse(localStorage.getItem("user_details")).token
    const [showModal, setShowmodal] = useState(false)
    const [showModal1, setShowmodal1] = useState(false)
    const [entryPrice, setEntryPrice] = useState('')
    const [exitPrice, setExitPrice] = useState('')
    const [entryPriceId, setEntryPriceId] = useState('')
    const [exitPriceId, setExitPriceId] = useState('')
    const [deleteSignalId, setDeleteSignalId] = useState('')


    const [signalId, setSignalId] = useState('')
    const [refresh, setRefresh] = useState(false)


    const [getAllSignals, setAllSignals] = useState({
        loading: true,
        data: []
    });


    const updatePrice = async () => {
        const data = { id: entryPriceId, price: entryPrice, signalId: signalId, entryPriceID: 1 }
        await dispatch(Update_Price(data)).unwrap()
            .then((response) => {
                if (response.status) {
                    setRefresh(!refresh)
                    setShowmodal(false)
                    setEntryPriceId('')
                    setSignalId('')
                }
            })
            .catch((err) => {
                console.log("error in updation the entry price", err)
            })
    }


    const updateExitPrice = async () => {
        const data = { id: exitPriceId, price: exitPrice, signalId: signalId, entryPriceID: 2 }
        await dispatch(Update_Price(data)).unwrap()
            .then((response) => {
                if (response.status) {
                    setRefresh(!refresh)
                    setShowmodal1(false)
                    setExitPriceId('')
                    setSignalId('')
                }
            })
            .catch((err) => {
                console.log("error in updation the entry price", err)
            })
    }



    const data = async () => {
        await dispatch(GetAllSignal()).unwrap()
            .then((response) => {
                if (response.status) {
                    setAllSignals({
                        loading: false,
                        data: response.data
                    });
                } else {
                    setAllSignals({
                        loading: false,
                        data: []
                    });
                }
            })
    }
    useEffect(() => {
        data()
    }, [refresh])

    const handleDelete = async (id) => {
        const data = { id: id }
        await dispatch(DeleteSignal(data)).unwrap()
            .then((response) => {
                if (response.status) {
                    toast.success("User deleted successfully")
                    setRefresh(!refresh)

                }
                else {
                    toast.error("some error finds")
                }
            }).catch((err) => {
                console.log("Error is found in deleting the signal", err)
            })


    }





    const columns = [

        {
            dataField: "index",
            text: "SR. No.",
            formatter: (cell, row, rowIndex) => rowIndex + 1,
        },
        {
            dataField: 'symbol',
            text: 'Symbol'
        },
        {
            dataField: 'strategy',
            text: 'Strategy'
        },
        {
            dataField: 'entry_type',
            text: 'Entry Type'
        },
        {
            dataField: 'entry_price',
            text: 'Entry Price',
            formatter: (cell, row) => (
                <span onClick={() => { setShowmodal(true); setEntryPrice(cell); setEntryPriceId(row._id); setSignalId(row.signals_id) }} >
                    {cell ? cell : "-"}
                </span>
            )
        },
        {
            dataField: 'exit_price',
            text: 'Exit Price',
            formatter: (cell, row) => (
                <span onClick={() => { setShowmodal1(true); setExitPrice(cell); setExitPriceId(row._id); setSignalId(row.signals_id) }} >
                    {cell ? cell : "-"}
                </span>
            )
        },
        {
            dataField: 'entry_qty',
            text: 'Entry Quantity'
        },
        {
            dataField: 'createdAt',
            text: 'Date',
            formatter: (cell, row) => (
                <><div>{cell.split('T')[0] + "   " + cell.split('T')[1].split('.')[0]}</div> </>
            ),
        },
        {
            dataField: '',
            text: 'Action',
            formatter: (cell, row) => (
                <>
                    <Trash2 onClick={() => handleDelete(row._id)} />
                </>
            ),
        },

    ];

    const handleBackupBtn =()=>{
        navigate('/super/backupsignal')

    }

    return (
        <>
            {
                getAllSignals.loading ? <Loader /> :
                    <>
                        <Content Page_title="Signal" button_status={true} button_title='Back' route='/super/permitions'>
                            <div>
                                <button className='btn btn-primary mb-3' onClick={handleBackupBtn}>backup Signal</button>
                            </div>
                            <FullDataTable TableColumns={columns} tableData={getAllSignals.data} pagination1={true} />
                        </Content>
                    </>
            }

            {showModal &&
                <div className="modal custom-modal d-block" id="add_vendor" role="dialog">
                    <div className="modal-dialog modal-dialog-centered modal-md">
                        <div className="modal-content">
                            <div className="modal-header border-0 pb-0">
                                <div className="form-header modal-header-title text-start mb-0">
                                    <h4 className="mb-0">Update Price</h4>
                                </div>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                    onClick={() => { setShowmodal(false); setEntryPriceId(''); setSignalId('') }}
                                >
                                </button>
                            </div>
                            <div>
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-lg-12 col-sm-12">
                                            <div className="input-block mb-3">
                                                <label>Entry Price</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    placeholder="Enter entry price"
                                                    onChange={(e) => setEntryPrice(e.target.value)}
                                                    value={entryPrice}
                                                />
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        data-bs-dismiss="modal"
                                        className="btn btn-back cancel-btn me-2"
                                        onClick={(e) => { setShowmodal(false); setEntryPriceId(''); setSignalId('') }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        data-bs-dismiss="modal"
                                        className="btn btn-primary paid-continue-btn"
                                        onClick={() => updatePrice()}
                                    >
                                        Update
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            }


            {showModal1 &&
                <div className="modal custom-modal d-block" id="add_vendor" role="dialog">
                    <div className="modal-dialog modal-dialog-centered modal-md">
                        <div className="modal-content">
                            <div className="modal-header border-0 pb-0">
                                <div className="form-header modal-header-title text-start mb-0">
                                    <h4 className="mb-0">Update Price</h4>
                                </div>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                    onClick={() => { setShowmodal1(false); setExitPriceId(''); setSignalId('') }}
                                >
                                </button>
                            </div>
                            <div>
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-lg-12 col-sm-12">
                                            <div className="input-block mb-3">
                                                <label>Entry Price</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    placeholder="Enter entry price"
                                                    onChange={(e) => setExitPrice(e.target.value)}
                                                    value={exitPrice}
                                                />
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        data-bs-dismiss="modal"
                                        className="btn btn-back cancel-btn me-2"
                                        onClick={(e) => { setShowmodal1(false); setExitPriceId(''); setSignalId('') }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        data-bs-dismiss="modal"
                                        className="btn btn-primary paid-continue-btn"
                                        onClick={() => updateExitPrice()}
                                    >
                                        Update
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            }
        </ >
    )
}


export default AdminHelps
