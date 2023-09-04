/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Content from "../../../../Components/Dashboard/Content/Content"
import Loader from '../../../../Utils/Loader'
import { Pencil, Trash2 } from 'lucide-react';
import FullDataTable from "../../../../Components/ExtraComponents/Datatable/FullDataTable"
import { Get_All_Catagory, Service_By_Catagory } from '../../../../ReduxStore/Slice/Admin/AdminSlice'
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




    const getservice = async () => {
        await dispatch(Get_All_Catagory()).unwrap()
            .then((response) => {
                if (response.status) {
                    setCatagoryData({
                        loading: false,
                        data: response.data
                    });
                }
            })
    }
    useEffect(() => {
        getservice()
    }, [])



    const data = async () => {
        await dispatch(Service_By_Catagory({ segment: first })).unwrap()
            .then((response) => {
                setAllServices({
                    loading: false,
                    data: []
                });
                if (response.status) {
                    setAllServices({
                        loading: false,
                        data: response.data
                    });
                }
            })
    }

    useEffect(() => {
        data()
    }, [first])






    const columns = [
        {
            dataField: "index",
            text: "SR. No.",
            formatter: (cell, row, rowIndex) => rowIndex + 1,
        },
        {
            dataField: 'category.name',
            text: 'Catagory'
        },
        {
            dataField: 'name',
            text: 'Service Name'
        },
        {
            dataField: 'category.segment',
            text: 'Segment'
        },

    ];







    return (
        <>
            {
                AllServices.loading ? <Loader /> :
                    <>
                        <Content Page_title="All Services">
                            <div className="col-lg-6">
                                <div className="mb-3 row">
                                    <div className="col-lg-7">
                                        <select
                                            className="default-select wide form-control"
                                            id="validationCustom05"
                                            onChange={(e) => setfirst(e.target.value)}
                                        >
                                            <option disabled>
                                                Please Select Catagory
                                            </option>
                                            <option selected value="all">
                                                All
                                            </option>
                                            {CatagoryData.data && CatagoryData.data.map((item) => {
                                                return <>
                                                    <option value={item.segment}>{item.name}</option>
                                                </>
                                            })}

                                        </select>

                                    </div>
                                </div>
                            </div>
                            {
                                AllServices.data && AllServices.data.length === 0 ? (
                                    // 'No data found'
                                    <FullDataTable TableColumns={columns} tableData={AllServices.data} />
                                )

                                    :
                                    <>

                                        <FullDataTable TableColumns={columns} tableData={AllServices.data} />
                                    </>


                            }
                        </Content>
                    </>
            }



        </ >
    );
}


export default ServicesList
