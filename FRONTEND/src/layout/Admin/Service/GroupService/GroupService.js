/* eslint-disable react/jsx-pascal-case */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Theme_Content from "../../../../Components/Dashboard/Content/Theme_Content"
import Loader from '../../../../Utils/Loader'
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

// import { Pencil, Trash2 } from 'lucide-react';
import FullDataTable from "../../../../Components/ExtraComponents/Datatable/FullDataTable"
import { Get_All_Service, Get_All_Catagory, Service_By_Catagory } from '../../../../ReduxStore/Slice/Admin/AdminSlice'
import { useDispatch, useSelector } from "react-redux";

const ServicesList = () => {

    const dispatch = useDispatch()

    const [first, setfirst] = useState('all')

    const [AllServices, setAllServices] = useState({
        loading: true,
        data: []
    });


    const [CatagoryData, setCatagoryData] = useState({
        loading: true,
        data: []
    });






    useEffect(async () => {
        await dispatch(Get_All_Catagory()).unwrap()
            .then((response) => {
                if (response.status) {
                    setAllServices({
                        loading: false,
                        data: response.data
                    });
                }
            })
    }, [])




    const columns = [
        {
            dataField: "index",
            text: "SR. No.",
            formatter: (cell, row, rowIndex) => rowIndex + 1,
        },
        {
            dataField: 'name',
            text: 'Catagory'
        },
        {
            dataField: 'categoryResult.name',
            text: 'Service Name'
        },
        {
            dataField: 'categoryResult.segment',
            text: 'Segment'
        },

    ];






    return (
        <>
            {
                AllServices.loading ? <Loader /> :
                    <>
                        <Theme_Content Page_title="Group Service" button_title="Add Grouop" route="/admin/groupservices/add">

                            {
                                AllServices.data && AllServices.data.length === 0 ? (
                                    'No data found') :
                                    <>

                                        <FullDataTable TableColumns={columns} tableData={AllServices.data} />
                                    </>


                            }
                        </Theme_Content>
                    </>
            }



            {/*
            <Content Page_title="Company Theme">
                {AllServices.loading ? (
                    <Loader />
                ) : AllServices.data && AllServices.data.length === 0 ? (
                    'No data found'
                ) : (
                    <FullDataTable TableColumns={columns} tableData={AllServices.data} />
                )}
            </Content>
 */}

            {/*
<Content Page_title="Company Theme">
            {AllServices.loading ? (
                <Loader />
            ) : AllServices.data && AllServices.data.length === 0 ? (
                'No data found'
            ) : (
                <FullDataTable TableColumns={columns} tableData={AllServices.data} />
            )}
        </Content>
 */}

        </ >
    );
}


export default ServicesList
