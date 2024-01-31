
import React, { useEffect, useState } from 'react'
import Content from "../../../../Components/Dashboard/Content/Content"
import Loader from '../../../../Utils/Loader'

import FullDataTable from "../../../../Components/ExtraComponents/Datatable/FullDataTable"
import { GET_HELPS } from '../../../../ReduxStore/Slice/Admin/AdminHelpSlice'
import { useDispatch, useSelector } from "react-redux";
import Modal from '../../../../Components/ExtraComponents/Modal';


const HelpCenter = () => {

    const dispatch = useDispatch()



    const user_id = JSON.parse(localStorage.getItem("user_details")).user_id
    const token = JSON.parse(localStorage.getItem("user_details")).token


    const [first, setfirst] = useState('all')
    const [showModal, setshowModal] = useState(false)

    const [getAllClients, setAllClients] = useState({
        loading: true,
        data: []
    });

 

    const data = async () => {
        await dispatch(GET_HELPS({user_id :user_id , token : token})).unwrap()
            .then((response) => {
                if (response.status) {
                    setAllClients({
                        loading: false,
                        data: response.data
                    });
                }else{
                    setAllClients({
                        loading: false,
                        data: response.data
                    });
                }
            })
    }
    useEffect(() => {
        data()
    }, [])

    const columns = [
        {
            dataField: "index",
            text: "SR. No.",
            formatter: (cell, row, rowIndex) => rowIndex + 1,
        },
        {
            dataField: 'username',
            text: 'User Name'
        },
        {
            dataField: 'email',
            text: 'Email'
        },
        {
            dataField: 'mobile',
            text: 'Phone Number'
        },
        {
            dataField: 'help_msg',
            text: 'Help Message'
        },
        {
            dataField: 'createdAt',
            text: 'Date',
            formatter: (cell, row) => (
                        <><div>{cell.split('T')[0] +"   "+cell.split('T')[1].split('.')[0]}</div> </>
                        // <><div>{cell.split('.')[0]}</div> </>

        
        
                    ),
        },
        // {
        //     dataField: 'ActiveStatus',
        //     text: 'Status',
        //     formatter: (cell, row) => (
        //         <>
        //             <label class="switch" >
        //                 <input type="checkbox" className="bg-primary" checked={row.ActiveStatus == "1" ? true : false} />
        //                 <span class="slider round"></span>
        //             </label>

        //         </>


        //     ),
        // },
        // {
        //     dataField: 'actions',
        //     text: 'Actions',
        //     formatter: (cell, row) => (
        //         <div>
        //             <span data-toggle="tooltip" data-placement="top" title="Edit">
        //                 <Pencil size={20} color="#198754" strokeWidth={2} className="mx-1" />
        //             </span>
        //             <span data-toggle="tooltip" data-placement="top" title="Delete">
        //                 <Trash2 size={20} color="#d83131" strokeWidth={2} className="mx-1" />
        //             </span>

        //         </div>
        //     ),
        // },
    ];
    return (
        <>
            {
                getAllClients.loading ? <Loader /> :
                    <>
                        <Content Page_title="Help Center" button_status={false}>

                                        <FullDataTable TableColumns={columns} tableData={getAllClients.data} />
                           
                            {
                                showModal ?
                                    <>
                                        < Modal isOpen={showModal} backdrop="static" size="sm" title="Verify OTP" btn_name="Verify"
                                        //  handleClose={setshowModal(false)}
                                        >
                                        </Modal >
                                    </>
                                    : ""
                            }
                        </Content>
                    </>
            }



        </ >
    )

}


export default HelpCenter
