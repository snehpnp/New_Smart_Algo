import React from 'react';
import Content from "../../../Components/Dashboard/Content/Content";
import BasicDataTable from '../../../Components/ExtraComponents/Datatable/BasicDataTable';

// import { Pencil, Trash2 } from 'lucide-react';
import Theme_Content from "../../../Components/Dashboard/Content/Theme_Content"


const History = () => {
    const columns = [
        {
            dataField: 'index',
            text: 'S.No.',
            formatter: (cell, row, rowIndex) => rowIndex + 1,

        },
        {
          dataField: 'SuperAdmin Name',
          text: 'SuperAdmin Name'
      },
        {
            dataField: 'panel_name',
            text: 'panel_name'
        },
        {
            dataField: 'Client_name',
            text: 'Client_name'
        },
        {
            dataField: 'msg',
            text: 'msg'
        },
        {
          dataField: 'Time',
          text: 'Time'
      },
  
    ];

    return (
        <Theme_Content Page_title="History"  button_status={false}>
            <BasicDataTable tableData={columns} TableColumns={columns} dropdown={false} />
        </Theme_Content>
        )
}


export default History
