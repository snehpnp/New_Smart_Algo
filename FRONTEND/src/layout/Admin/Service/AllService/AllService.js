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

    const [first, setfirst] = useState('CF')

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
            sort: true,

            formatter: (cell, row, rowIndex) => rowIndex + 1,
        },
        {
            dataField: 'category.name',
            text: 'Catagory',
            sort: true,


        },
        {
            dataField: 'name',
            text: 'Service Name',
            sort: true,
        },
        {
            dataField: 'category.segment',
            text: 'Segment',
            sort: true,
        },
        // {
        //     dataField: 'category.name',
        //     text: 'Segment',
        //     formatter: (cell, row , index) => (
        //         <>
        //             <input type="text" className="form-control" placeholder="Enter Quantity" aria-label="Username" aria-describedby="basic-addon1" name={row.name} onChange={(e) => EditQty(e, cell , index)} />

        //         </>
        //     )

        // },

    ];

    const [QtyValue, setQtyValue] = useState([])
    const [first2, setfirst2] = useState([])

    const EditQty = (e, rowdata , index) => {
        let value = e.target.value
        let name = e.target.name

        console.log("index" ,index);

        const newData = {
            serviceName: name,
            setqty: value,
        };
        setQtyValue((prevSelected) => {
            prevSelected.filter((id) => id.serviceName !== newData.serviceName);
        });

        setQtyValue((prevQtys) => ([
            ...prevQtys,
            newData
        ]));

    }


    const UpdateQuantity = (e) => {

        e.preventDefault()

        // let unique = QtyValue.reduce(function (acc, curr) {
        //     if (!acc.includes(curr.serviceName))
        //         acc.push(curr);
        //     return acc;
        // }, []);
        console.log("removeDuplicates", QtyValue);

    }




    return (
        <>
            {
                AllServices.loading ? <Loader /> :
                    <>
                        <Content Page_title="All Services" button_status={false}>
                            <div className='d-flex'>

                                <div className="col-lg-6">
                                    <div className="mb-3 row">
                                        <div className="col-lg-7">
                                            <select
                                                className="default-select wide form-control"
                                                id="validationCustom05"
                                                onChange={(e) => setfirst(e.target.value)}
                                                value={first}
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
                                <div className="col-lg-6 ">
                                    {/* <button className='btn float-end btn-primary' onClick={(e) => UpdateQuantity(e)}>updateQty</button> */}
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
