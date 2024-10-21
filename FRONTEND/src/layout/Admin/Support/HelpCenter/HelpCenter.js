
import React, { useEffect, useState } from 'react'
import Content from "../../../../Components/Dashboard/Content/Content"
import Loader from '../../../../Utils/Loader'

import FullDataTable from "../../../../Components/ExtraComponents/Datatable/FullDataTable"
import { GET_HELPS } from '../../../../ReduxStore/Slice/Admin/AdminHelpSlice'
import { useDispatch } from "react-redux";
import Modal from '../../../../Components/ExtraComponents/Modal';
import {fDateTime} from '../../../../Utils/Date_formet'

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
                        <><div>{cell ? fDateTime(cell) :"-"}</div> </>
                       

        
        
                    ),
        },
      
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
