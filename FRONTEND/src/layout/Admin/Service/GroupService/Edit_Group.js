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
import { Get_Service_By_Group_Id_For_Edit_Update } from '../../../../ReduxStore/Slice/Admin/GroupServiceSlice';
import { No_Negetive_Input_regex } from '../../../../Utils/Common_regex';




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


    // for Select All BOx
    const [selectAllFiltered, setSelectAllFiltered] = useState(false);



    //  ------------

    //  Get Edit Group Data
    const data2 = async () => {
        let arr = []
        let arr1 = []

        await dispatch(Get_Service_By_Group_Id_For_Edit_Update({ _id: id })).unwrap()
            .then((response) => {
                if (response.status) {
                    response.data && response.data.Service_name_get
                        .map((item1) => {

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
                                        lotsize: item1.ServiceResult.lotsize,

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



    function handleServiceChange(event, id, name, segment, lotsize) {
        const serviceId = id;
        const isChecked = event.target.checked;
        if (isChecked) {
            // Add the selected service's information to the array
            setSelectedServices((prevInfo) => [...prevInfo, { service_id: serviceId, name: name, segment: segment, group_qty: 0, lotsize: lotsize }]);
        } else {
            // Remove the selected service's information from the array
            setSelectedServices((prevInfo) => prevInfo.filter((info) => info.id !== serviceId));
        }
    }



    //  For Select All 
    const handleSelectAllFilteredChange = () => {
        setSelectAllFiltered((prevChecked) => !prevChecked);

        if (!selectAllFiltered) {
            // Filtered services ko select karo aur additional information store karo.
            const updatedServices = state.map((service) => ({
                service_id: service._id,
                name: service.name,
                segment: service.category.name,
                group_qty: 0,
                lotsize: service.lotsize
            }));

            // Set all filtered checkboxes to checked
            state.forEach((service) => {
                const checkboxes = document.querySelectorAll(`#service-${service._id}`);
                checkboxes.forEach((checkbox) => {
                    checkbox.checked = true;
                });
            });

            setSelectedServices((prevInfo) => [...prevInfo, ...updatedServices]);
        } else {
            // Filtered services ko deselect karo aur unka data hatao.
            const filteredServiceIds = state.map((service) => service._id);
            setSelectedServices((prevInfo) =>
                prevInfo.filter((info) => !filteredServiceIds.includes(info.service_id))
            );

            // Set all filtered checkboxes to unchecked
            state.forEach((service) => {
                const checkboxes = document.querySelectorAll(`#service-${service._id}`);
                checkboxes.forEach((checkbox) => {
                    checkbox.checked = false;
                });
            });
        }
    };



    const InputGroupQty = (event, id, servicename, segement, qty, lotsize) => {

        const numericValue = event.target.value.replace(/[^0-9]/g, '');


        if (parseInt(event.target.value) < 0) {
            alert("no negetive allow")
            event.target.value = 0
            return
        } else {


            // if (parseInt(event.target.value) < 0) {

            const updatedQty = event.target.value === "" ? qty : numericValue;

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
                    { service_id: id, name: servicename, segment: segement, group_qty: parseInt(updatedQty), test: event.target.value },
                ]);
            }


        }

        // }
        // else {
        //     alert("Negetive/Decimal/Character/Empty Field Not Allow")
        //     // event.target.value = ''
        //     return
        //     // }
        // }



    };





    const remoeveService = (id) => {

        if (window.confirm("Do you want to delete")) {
            let test = selectedServices.filter((item) => {
                return item.service_id !== id
            })

            let checkboxes = document.querySelectorAll(`#service-${id}`);
            checkboxes.forEach((checkbox) => {
                checkbox.checked = false;
            });


            setSelectedServices(test)
        }

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
            let checkValid = true

            selectedServices && selectedServices.map((item) => {
                // console.log("parseInt(item.lotsize)", parseInt(item.lotsize))
                console.log("item", item)
                if (item.lotsize !== 1) {
                    if ((item.group_qty) % (item.lotsize) !== 0) {
                        alert(`Please Enter Valid Lot Size Inside ${item.name}`)
                        checkValid = false
                        return
                    }
                    return
                }
               
                return
            })



            // return
            if (checkValid) {
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

        }
    });



    const fields = [
        { name: 'groupname', label: 'Group Name', type: 'text', label_size: 12, col_size: 6, disable: false },
        {
            name: 'segment',
            label: 'Segment',
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



    useEffect(() => {
        setSerachService('')
        setSelectAllFiltered(false)
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
                                    <th>lotsize</th>
                                    <th>Qty</th>
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
                                            <td>{item.lotsize}</td>

                                            <td>
                                                <input
                                                    type="number"
                                                    className="form-control col-md-2"
                                                    placeholder="Enter Qty"
                                                    onChange={(e) => InputGroupQty(e, item.service_id, item.name, item.segment, item.group_qty, item.lotsize)}
                                                    min={0}
                                                    defaultValue={item.group_qty ? item.group_qty : 0}

                                                />
                                            </td>
                                            <td onClick={() => remoeveService(item.service_id)} className='text-danger'><Trash2 /></td>

                                        </tr>
                                    </>
                                })


                                }

                            </tbody >
                        </table>
                    </div>
                }

            >
                <Formikform fieldtype={fields.filter(field => !field.showWhen || field.showWhen(formik.values))} formik={formik} btn_name="Edit Group" title='addstrategy'
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
                                                    <div className="col-md-4 mb-2">
                                                        <div className="form-check">
                                                            <input
                                                                type="checkbox"
                                                                className="form-check-input"
                                                                id='selectall'
                                                                checked={selectAllFiltered}
                                                                onChange={() => handleSelectAllFilteredChange()}
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
                                                                    onChange={(e) => handleServiceChange(e, service._id, service.name, service.category.name, service.lotsize)}
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


