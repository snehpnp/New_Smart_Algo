/* eslint-disable array-callback-return */
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Formikform from "../../../../Components/ExtraComponents/Form/Formik_form2"
import { useFormik } from 'formik';
import * as  valid_err from "../../../../Utils/Common_Messages"
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import Content from '../../../../Components/Dashboard/Content/Content1';
import { Get_All_Catagory, Service_By_Catagory } from '../../../../ReduxStore/Slice/Admin/AdminSlice'
import toast from 'react-hot-toast';
import { Update_Service_By_Group_Id } from '../../../../ReduxStore/Slice/Admin/GroupServiceSlice';
import ToastButton from "../../../../Components/ExtraComponents/Alert_Toast";
import { Trash2 } from 'lucide-react';
import { Get_Service_By_Group_Id } from '../../../../ReduxStore/Slice/Admin/GroupServiceSlice';




const AddStrategy = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { id } = useParams()


    const AdminToken = JSON.parse(localStorage.getItem('user_details')).token;



    const [SerachService, setSerachService] = useState('');
    const [refresh, setRefresh] = useState(false);

    const [GetAllSgments, setGetAllSgments] = useState({
        loading: true,
        data: [],
    });


    const [allServices, setAllServices] = useState({
        loading: true,
        data: [],
    });

    const [groupServiceInfo, setGroupServiceInfo] = useState({
        loading: true,
        data: [],
    });


    const [selectedServices, setSelectedServices] = useState([]);
    const [GroupQty, setGroupQty] = useState([]);
    const [forShowGroupQty, setforShowGroupQty] = useState([]);




    //  ------------

    //  Get Edit Group Data
    const data2 = async () => {
        let arr = []
        let arr1 = []

        await dispatch(Get_Service_By_Group_Id({ _id: id })).unwrap()
            .then((response) => {
                if (response.status) {
                    response.data && response.data.Service_name_get
                        .map((item1) => {
                            console.log("item1", item1)

                            response.data && response.data.group_name
                                .map((item) => {
                                    arr.push({
                                        group_name: item.name,
                                        name: item1.ServiceResult.name,
                                        segment: item1.catagory.name,
                                        segment_name: item1.catagory.segment,
                                        group_qty: item1.group_qty,
                                        id: item1._id,
                                    })
                                })
                        })

                    response.data && response.data.Service_name_get
                        .map((item1) => {

                            response.data && response.data.group_name
                                .map((item) => {
                                    arr1.push({
                                        service_id: item1.ServiceResult._id,
                                        name: item1.ServiceResult.name,
                                        segment: item1.catagory.name,
                                        group_qty: item1.group_qty,
                                    })
                                })
                        })
                    setSelectedServices(arr1);

                    setGroupServiceInfo({
                        loading: false,
                        data: arr,
                    });
                }
            });

    };

    useEffect(() => {
        data2();
    }, [id]);



    function handleServiceChange(event, id, name, segment) {
        const serviceId = id;
        const isChecked = event.target.checked;

        if (isChecked) {
            // Add the selected service's information to the array
            setSelectedServices((prevInfo) => [...prevInfo, { service_id: serviceId, name: name, segment: segment, group_qty: 0 }]);
        } else {
            // Remove the selected service's information from the array
            setSelectedServices((prevInfo) => prevInfo.filter((info) => info.id !== serviceId));
        }
    }




    const InputGroupQty = (event, id, servicename, segement, qty) => {

        const updatedQty = event.target.value === "" ? qty : event.target.value;

        // Check if the selected service already exists in selectedServices
        const existingServiceIndex = selectedServices.findIndex((item) => item.service_id === id);

        if (existingServiceIndex !== -1) {
            // Update quantity if the service already exists
            const updatedSelectedServices = [...selectedServices];
            updatedSelectedServices[existingServiceIndex].group_qty = parseInt(updatedQty);
            setSelectedServices(updatedSelectedServices);
        } else {
            // Add the new service to selectedServices
            setSelectedServices((prevServices) => [
                ...prevServices,
                { service_id: id, name: servicename, segment: segement, group_qty: parseInt(updatedQty) },
            ]);
        }


    };





    const remoeveService = (id) => {
        console.log("fsfsd111" ,id)
        let test = selectedServices.filter((item) => {
            return item.service_id !== id
        })


        setSelectedServices(test)
    }





    //  -------------------For Show Segment List-----------------


    const getservice = async () => {
        await dispatch(Get_All_Catagory())
            .unwrap()
            .then((response) => {

                if (response.status) {
                    setGetAllSgments({
                        loading: false,
                        data: response.data,
                    });
                }
            });
    };
    useEffect(() => {
        getservice();
    }, []);






    const formik = useFormik({
        initialValues: {
            groupname: '',
            segment: false
        },
        touched: {
            groupname: false,
            email: false,

        },
        validate: (values) => {
            const errors = {};
            if (!values.groupname && formik.touched.groupname) {
                errors.groupname = valid_err.EMPTY_GROUP_NAME_ERR;
            }


            return errors;
        },

        onSubmit: async (values) => {
            console.log("selectedServices", {
                groupdetails: { name: values.groupname  , id: id},
                services_id: selectedServices
            })

// return


            await dispatch(Update_Service_By_Group_Id({
                groupdetails: { name: values.groupname, id: id },
                services_id: selectedServices

            })).then((response) => {

                if (response.payload.status) {
                    toast.success(response.payload.msg);
                    setTimeout(() => {
                        navigate("/admin/groupservices")
                    }, 1000);
                } else {
                    toast.error(response.payload.msg);

                }
            })


        }
    });



    const fields = [
        { name: 'groupname', label: 'Strategy Name', type: 'text', label_size: 12, col_size: 6, disable: false },
        {
            name: 'segment',
            label: 'To Month',
            type: 'select',
            options: GetAllSgments.data && GetAllSgments.data.map((item) => ({ label: item.name, value: item.segment })),
            label_size: 12, col_size: 6, disable: false,
        },
    ];


    //  -------------------For Show Service According to Segment -----------------

    const data = async () => {
        if (formik.values.segment) {
            await dispatch(Service_By_Catagory({ segment: formik.values.segment })).unwrap()
                .then((response) => {
                    if (response.status) {
                        setAllServices({
                            loading: false,
                            data: response.data,
                        });
                    }
                });
        }
    };
    useEffect(() => {
        data();
    }, [formik.values.segment]);




    useEffect(() => {
        if (groupServiceInfo.data[0] !== undefined) {
            formik.setFieldValue('groupname', groupServiceInfo.data && groupServiceInfo.data[0].group_name);
        }
    }, [groupServiceInfo.data]);

    const [state, setstate] = useState([]);



    const filterFunction = async () => {
        const filteredData = allServices.data.filter((item) => {
            return item.name.toLowerCase().includes(SerachService.toLowerCase())
        });


        if (SerachService === "") {
            setstate([])
        } else {
            setstate(filteredData)
        }
    };

    useEffect(() => {
        filterFunction()
    }, [SerachService]);


    const [state1, setstate1] = useState([]);

    const groupedData = {};

    if (forShowGroupQty.length > 0) {

        const uniqueArr = Object.values(
            forShowGroupQty.reduce((acc, cur) => {
                acc[cur.service_id] = cur;
                return acc;
            }, {})
        );

        setstate1(uniqueArr)

        uniqueArr.forEach((item) => {
            if (!groupedData[item.segement]) {
                groupedData[item.segement] = [];
            }
            groupedData[item.segement].push(item);
        });
    }

    useEffect(() => {
        setSerachService('')
    }, [formik.values.segment]);





    return (
        <>
            <Content Page_title="Edit Group" button_title="Back" route="/admin/groupservices"
                additional_field={
                    <div style={{ overflowY: 'scroll', height: '69vh' }} >
                        <h4 className='text-center text-decoration-underline mb-3'>Select Services And Quantity</h4>
                        <table className="table table-responsive-sm col-md-4 " >
                            <thead className="bg-primary">
                                <tr>
                                    <th>#</th>
                                    <th>Segment</th>
                                    <th>Service Name</th>
                                    {/* <th>Qty</th> */}
                                    <th>Remove</th>
                                </tr>
                            </thead>
                            <tbody >
                                {selectedServices && selectedServices.map((item, index) => {
                                    return <>
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.segment}</td>
                                            <td>{item.name}</td>
                                            {/* <td>
                                                <input
                                                type="number"
                                                className="form-control col-md-2"
                                                placeholder="Enter Qty"
                                                onChange={(e) => InputGroupQty(e, item.service_id, item.name, item.segment, item.group_qty)}
                                                min={0}
                                                defaultValue={item.group_qty ? item.group_qty : 0}

                                            />
                                            </td> */}
                                            <td onClick={() => remoeveService(item.service_id)}><Trash2 /></td>

                                        </tr>
                                    </>
                                })


                                }

                            </tbody >
                        </table>
                    </div>
                }

            >
                <Formikform fieldtype={fields.filter(field => !field.showWhen || field.showWhen(formik.values))} formik={formik} btn_name="Add Strategy" title='addstrategy'
                    additional_field={
                        <>
                            {formik.values.segment ?
                                <div className='col-md-11 px-2 ms-2 '>
                                    <input
                                        type="test"
                                        className="form-control"
                                        placeholder="Search ..."
                                        onChange={(e) => { setSerachService(e.target.value) }}
                                        value={SerachService}

                                    />
                                </div>

                                : ""}
                            <div className="col-lg-12" style={{ overflowY: 'scroll', height: '50vh' }}>
                                {state.length > 0 && (
                                    <div className="mb-3 row">
                                        <div className="col-lg-12">
                                            <div className="row mt-4">
                                                :
                                                <>
                                                    <div className="col-md-4 mb-2 ">
                                                        <div className="form-check">
                                                            <input
                                                                type="checkbox"
                                                                className="form-check-input "
                                                                id='selectall'
                                                            // id={`service-${service._id}`}
                                                            // value={service._id}
                                                            // checked={selectedServices.includes(service._id)}
                                                            // onChange={handleServiceChange}
                                                            />
                                                            <label className="form-check-label" htmlFor='selectall'>
                                                                Select All
                                                            </label>
                                                        </div>
                                                    </div>
                                                    {state.map((service) => (
                                                        <div key={service._id} className="col-md-4 mb-2">
                                                            <div className="form-check">
                                                                <input
                                                                    type="checkbox"
                                                                    className="form-check-input"
                                                                    id={`service-${service._id}`}
                                                                    value={service._id}
                                                                    // checked={selectedServices.includes(service._id)}
                                                                    onChange={(e) => handleServiceChange(e, service._id, service.name, service.category.name)}
                                                                />
                                                                <label className="form-check-label" htmlFor={`service-${service._id}`}>
                                                                    {service.name}
                                                                </label>
                                                            </div>

                                                        </div>


                                                    ))}
                                                </>

                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    }
                />



                < ToastButton />
            </Content >
        </>
    )



}


export default AddStrategy


