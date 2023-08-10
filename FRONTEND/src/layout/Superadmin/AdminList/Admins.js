/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Content from "../../../Components/Dashboard/Content/Content"
import Loader from '../../../Utils/Loader'
import FullDataTable from "../../../Components/ExtraComponents/Datatable/FullDataTable"
import { Get_All_Theme, getthemedata } from '../../../ReduxStore/Slice/ThemeSlice'
import { useDispatch, useSelector } from "react-redux";

const AdminsList = () => {

    const dispatch = useDispatch()
    const theme_list = useSelector(getthemedata && getthemedata)

    const [themeData, setThemeData] = useState({
        loading: true,
        data: []
    });


    useEffect(() => {
        dispatch(Get_All_Theme())
    }, [dispatch])



    useEffect(() => {
        if (theme_list !== undefined) {
            if (theme_list && theme_list.gettheme) {
                setThemeData({
                    loading: false,
                    data: theme_list.gettheme
                });
            }
            if (theme_list !== undefined && theme_list.gettheme.message === "Network Error") {
                alert(theme_list.gettheme.message);
            }
        }
    }, [theme_list]);




    const columns = [
        {
            dataField: "index",
            text: "SR. No.",
            formatter: (cell, row, rowIndex) => rowIndex + 1,
        },
        {
            dataField: 'theme_name',
            text: 'Theme Name'
        },
        {
            dataField: 'price',
            text: 'Product Name'
        },
        {
            dataField: 'price',
            text: 'Product Name'
        },
        {
            dataField: 'price',
            text: 'Product Name'
        },
        {
            dataField: 'price',
            text: 'Product Name'
        },
    ];


    return (
        <Content Page_title="Company Theme">
            {themeData.loading ? (
                <Loader />
            ) : themeData.data && themeData.data.length === 0 ? (
                'No data found'
            ) : (
                <FullDataTable TableColumns={columns} tableData={themeData.data.data} />
            )}
        </Content>
    );
}


export default AdminsList
