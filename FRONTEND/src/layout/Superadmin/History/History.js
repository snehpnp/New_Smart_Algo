import React from 'react';
import Content from "../../../Components/Dashboard/Content/Content";
import BasicDataTable from '../../../Components/ExtraComponents/Datatable/BasicDataTable';
import { useDispatch } from 'react-redux';

// import { Pencil, Trash2 } from 'lucide-react';
import Theme_Content from "../../../Components/Dashboard/Content/Theme_Content"
import { useEffect, useState } from 'react';
import { fa_time, fDateTimeSuffix } from "../../../Utils/Date_formet";
 

import { Get_Panel_History} from '../../../ReduxStore/Slice/Superadmin/SuperAdminSlice'
import FullDataTable from "../../../Components/ExtraComponents/Datatable/FullDataTable"


const History = () => {
    const dispatch = useDispatch();
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
            formatter: (cell, row, rowIndex) => <div>{ cell == null ? "-"  : cell}</div>
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
              setAllData({
                    loading: false,
                    data: response.data
                });
            })
    }


    useEffect(() => {
        data()
    }, [])

    return (
        <Theme_Content Page_title="History"  button_status={false}>
            <FullDataTable TableColumns={columns} tableData={AllData.data} />
        </Theme_Content>
        )
}


export default History
