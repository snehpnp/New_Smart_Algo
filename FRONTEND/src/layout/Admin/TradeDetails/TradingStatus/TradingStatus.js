// import React from 'react'
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Content from "../../../../Components/Dashboard/Content/Content"
import BasicDataTable from '../../../../Components/ExtraComponents/Datatable/BasicDataTable'
import { Pencil, Trash2 } from 'lucide-react';
import Theme_Content from "../../../../Components/Dashboard/Content/Theme_Content"
import Loader from '../../../../Utils/Loader'
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import FullDataTable from "../../../../Components/ExtraComponents/Datatable/FullDataTable"
import { GET_ALL_CLIENTS } from '../../../../ReduxStore/Slice/Admin/AdminSlice'
import { useDispatch, useSelector } from "react-redux";
import Modal from '../../../../Components/ExtraComponents/Modal';


const TradingStatus = () => {
    const columns = [
        {
            dataField: 'index',
            text: 'S.No.',
            formatter: (cell, row, rowIndex) => rowIndex + 1,

        },
        {
            dataField: 'panel_name',
            text: 'Name'
        },
        {
            dataField: 'panel_name',
            text: 'Username'
        },
        {
            dataField: 'prefix',
            text: 'Mobile Number'
        },
        {
            dataField: 'prefix',
            text: 'Trading On/Off'
        },
    ];

    return (
        <Content Page_title="Signals">
            <BasicDataTable tableData={columns} TableColumns={columns} dropdown={false} />
        </Content>
        )
}


export default TradingStatus;
 

