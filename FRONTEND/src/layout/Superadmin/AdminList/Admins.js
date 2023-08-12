/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Content from "../../../Components/Dashboard/Content/Content"
import Loader from '../../../Utils/Loader'
import { Pencil, Trash2 } from 'lucide-react';
import FullDataTable from "../../../Components/ExtraComponents/Datatable/FullDataTable"
import { All_Panel_List, panellist } from '../../../ReduxStore/Slice/Superadmin/SuperAdminSlice'
import { useDispatch, useSelector } from "react-redux";

const AdminsList = () => {

    const dispatch = useDispatch()
    const theme_list = useSelector(panellist && panellist)

    console.log("theme_list", theme_list);
    const [themeData, setThemeData] = useState({
        loading: true,
        data: []
    });


    useEffect(async () => {
        await dispatch(All_Panel_List()).unwrap()
            .then((response) => {
                console.log("rest", response.data);
                setThemeData({
                    loading: false,
                    data: response.data
                });
            })
    }, [])








    const columns = [
        {
            dataField: "index",
            text: "SR. No.",
            formatter: (cell, row, rowIndex) => rowIndex + 1,
        },
        {
            dataField: 'domain',
            text: 'Domain Name'
        },
        {
            dataField: 'panel_name',
            text: 'Panel Name'
        },
        {
            dataField: 'port',
            text: 'Port No'
        },
        {
            dataField: 'key',
            text: 'Key'
        },
        {
            dataField: 'is_active',
            text: 'Active'
        },
        {
            dataField: 'is_expired',
            text: 'Expired'
        },
        {
            dataField: 'ip_address',
            text: 'IP Address'
        },
        {
            dataField: 'actions',
            text: 'Actions',
            formatter: (cell, row) => (
                <div>
                    <button type="button" class="btn btn-secondary" data-toggle="tooltip" data-placement="top" title="Tooltip on top">
                        <Pencil size={20} color="#198754" strokeWidth={2} className="mx-1" />
                        Tooltip on top
                    </button>

                    <Trash2 size={20} color="#d83131" strokeWidth={2} className="mx-1" />
                </div>
            ),
        },
    ];


    return (
        <>
            {
                themeData.loading ? <Loader /> :
                    <>
                        <Content Page_title="Company Theme">
                            {
                                themeData.data && themeData.data.length === 0 ? (
                                    'No data found') :
                                    <FullDataTable TableColumns={columns} tableData={themeData.data} />


                            }
                        </Content>
                    </>
            }



            {/*
            <Content Page_title="Company Theme">
                {themeData.loading ? (
                    <Loader />
                ) : themeData.data && themeData.data.length === 0 ? (
                    'No data found'
                ) : (
                    <FullDataTable TableColumns={columns} tableData={themeData.data} />
                )}
            </Content>
 */}

            {/*
<Content Page_title="Company Theme">
            {themeData.loading ? (
                <Loader />
            ) : themeData.data && themeData.data.length === 0 ? (
                'No data found'
            ) : (
                <FullDataTable TableColumns={columns} tableData={themeData.data} />
            )}
        </Content>
 */}

        </ >
    );
}


export default AdminsList
