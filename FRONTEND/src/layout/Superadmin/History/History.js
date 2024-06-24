import React from 'react';
import { useDispatch } from 'react-redux';

import Theme_Content from "../../../Components/Dashboard/Content/Theme_Content"
import { useEffect, useState } from 'react';
import { fDateTimeSuffix } from "../../../Utils/Date_formet";

import { Get_Panel_History } from '../../../ReduxStore/Slice/Superadmin/SuperAdminSlice'
import FullDataTable from "../../../Components/ExtraComponents/Datatable/FullDataTable"
import Loader from '../../../Utils/Loader'

const History = () => {
    const dispatch = useDispatch();
    const [searchInput, setSearchInput] = useState('')
    const [AllData, setAllData] = useState({
        loading: true,
        data: []
    });



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
            text: 'Massage'
        },
        {
            dataField: "createdAt",
            text: "Date & Time",
            formatter: (cell, row, rowIndex) => <div>{fDateTimeSuffix(cell)}</div>,
            sort: true,

        }
    ];




    const data = async () => {
        await dispatch(Get_Panel_History()).unwrap()
            .then((response) => {
                if (response.status) {

                    const filterData = response && response.data.filter((item) => {
                        const matchSearch =
                            searchInput == '' ||
                            item.panal_name.toLowerCase().includes(searchInput.toLowerCase()) ||
                            item.superadmin_name.toLowerCase().includes(searchInput.toLowerCase())
                        item.msg.toLowerCase().includes(searchInput.toLowerCase())

                        return matchSearch
                    })

                    setAllData({
                        loading: false,
                        data: searchInput ? filterData : response.data
                    });
                } else {
                    setAllData({
                        loading: false,
                        data: []
                    });
                }
            })
    }




    useEffect(() => {
        data()
    }, [searchInput])

    return (
        <Theme_Content Page_title="History" button_status={false}>
            <div className='mb-4'>
                <h6>Search here something</h6>
                <input type="text"
                    style={{ height: '2rem' }}
                    placeholder='search...'
                    className='p-2 rounded'
                    onChange={(e) => { setSearchInput(e.target.value) }}
                    value={searchInput} />
            </div>
            {AllData.loading ? <Loader /> : <FullDataTable TableColumns={columns} tableData={AllData.data} />}

        </Theme_Content>
    )
}


export default History
