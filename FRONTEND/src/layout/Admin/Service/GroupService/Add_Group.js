// /* eslint-disable no-use-before-define */
// /* eslint-disable react-hooks/exhaustive-deps */
// import React, { useEffect, useState } from 'react';
// import { useFormik } from 'formik';
// import * as valid_err from '../../../../Utils/Common_Messages';
// // import { Email_regex, Mobile_regex } from '../../../../Utils/Common_regex';
// import { useDispatch } from 'react-redux';
// import Content from '../../../../Components/Dashboard/Content/Content';
// import { Service_By_Catagory, Get_All_Catagory } from '../../../../ReduxStore/Slice/Admin/AdminSlice';
// import { Add_Group } from '../../../../ReduxStore/Slice/Admin/GroupServiceSlice';
// import ToastButton from "../../../../Components/ExtraComponents/Alert_Toast";
// import toast from 'react-hot-toast';
// import { useNavigate } from 'react-router-dom';



// const AddGroup = () => {
//     const navigate = useNavigate();

//     const dispatch = useDispatch();
//     const [selectedServices, setSelectedServices] = useState([]);
//     const [GroupQty, setGroupQty] = useState([]);
//     const [enabledInputs, setEnabledInputs] = useState({});

//     const [allServices, setAllServices] = useState({
//         loading: true,
//         data: [],
//     });
//     const [GetAllSgments, setGetAllSgments] = useState({
//         loading: true,
//         data: [],
//     });





//     function handleServiceChange(event) {
//         const serviceId = event.target.value;
//         const isChecked = event.target.checked;

//         setSelectedServices((prevSelected) => {
//             const updatedSelected = isChecked
//                 ? [...prevSelected, serviceId]
//                 : prevSelected.filter((id) => id !== serviceId);

//             setEnabledInputs((prevInputs) => ({ ...prevInputs, [serviceId]: isChecked, }));

//             return updatedSelected;
//         });
//     }

//     //  -------------------For Show Segment List-----------------


//     const getservice = async () => {
//         await dispatch(Get_All_Catagory())
//             .unwrap()
//             .then((response) => {

//                 if (response.status) {
//                     setGetAllSgments({
//                         loading: false,
//                         data: response.data,
//                     });
//                 }
//             });
//     };
//     useEffect(() => {
//         getservice();
//     }, []);


//     //   For Mange Qty Acco


//     const InputGroupQty = (event, id) => {
//         setGroupQty((prevQtys) => ([
//             ...prevQtys,
//             {
//                 // [id]: id,
//                 group_qty: event.target.value === "" ? "0" : event.target.value,
//                 service_id: id
//             }
//         ]));
//     }


//     //  Form For Submit
//     const formik = useFormik({
//         initialValues: {
//             group_name: '',
//             selectSegment: null,
//             selectedServices: [],
//         },
//         validate: (values) => {
//             const errors = {};
//             if (!values.group_name) {
//                 errors.group_name = valid_err.EMPTY_GROUP_NAME_ERR;
//             }
//             if (!values.selectSegment) {
//                 errors.selectSegment = valid_err.SEGEMENTSELECT_ERROR;
//             }
//             return errors;
//         },
//     });


//     const handleSubmit = async (e) => {
//         e.preventDefault()

//         const uniqueArr = Object.values(
//             GroupQty.reduce((acc, cur) => {
//                 acc[cur.service_id] = cur;
//                 return acc;
//             }, {})
//         );

//         await dispatch(Add_Group({
//             groupdetails: { name: formik.values.group_name },
//             services_id: uniqueArr

//         })).then((response) => {

//             if (response.payload.status) {
//                 toast.success(response.payload.msg);
//                 setTimeout(() => {
//                     navigate("/admin/groupservices")
//                 }, 1000);
//             } else {
//                 toast.error(response.payload.msg);

//             }
//         })
//     }


//     //  -------------------For Show Service According to Segment -----------------

//     const data = async () => {
//         if (formik.values.selectSegment) {
//             await dispatch(Service_By_Catagory({ segment: formik.values.selectSegment })).unwrap()
//                 .then((response) => {
//                     if (response.status) {
//                         setAllServices({
//                             loading: false,
//                             data: response.data,
//                         });
//                     }
//                 });
//         }
//     };
//     useEffect(() => {
//         data();
//     }, [formik.values.selectSegment]);






//     return (
//         <>
//             <Content Page_title="Add Group" button_title="Back" route="/admin/groupservices">
//                 <form onSubmit={handleSubmit} >
//                     <div className="row">
//                         <div className="col-lg-6">
//                             <div className="mb-3 row">
//                                 <label className="col-lg-4 col-form-label" htmlFor="group_name">
//                                     Group Name
//                                     <span className="text-danger">*</span>
//                                 </label>
//                                 <div className="col-lg-7">
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         id="group_name"
//                                         placeholder="Enter group name"
//                                         {...formik.getFieldProps('group_name')}
//                                         required=""
//                                     />
//                                     <div className="invalid-feedback">Please enter a group name</div>
//                                     {formik.errors.group_name && (
//                                         <div style={{ color: 'red' }}>{formik.errors.group_name}</div>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>



//                         <div className="col-lg-6">
//                             <div className="mb-3 row">
//                                 <label className="col-lg-4 col-form-label" htmlFor="selectSegment">
//                                     Select Segment
//                                 </label>
//                                 <div className="col-lg-7">
//                                     <select
//                                         className="form-control"
//                                         id="selectSegment"
//                                         {...formik.getFieldProps('selectSegment')}
//                                     >
//                                         <option value="">Select a segment</option>
//                                         {GetAllSgments.data.map((segment) => (
//                                             <option key={segment.segment} value={segment.segment}>
//                                                 {segment.name}
//                                             </option>
//                                         ))}
//                                     </select>
//                                     {formik.errors.selectSegment && (
//                                         <div style={{ color: 'red' }}>{formik.errors.selectSegment}</div>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>






//                     <div className="col-lg-12" style={{ overflowY: 'scroll', height: '40vh' }}>
//                         {allServices.data.length > 0 && (
//                             <div className="mb-3 row">
//                                 <div className="col-lg-12">
//                                     <div className="row">
//                                         {allServices.data.length === 0 ?
//                                             <p>Segment Is Empty </p> :

//                                             allServices.data.map((service) => (
//                                                 <div key={service._id} className="col-md-3 mb-2">
//                                                     <div className="form-check">
//                                                         <input
//                                                             type="checkbox"
//                                                             className="form-check-input"
//                                                             id={`service-${service._id}`}
//                                                             value={service._id}
//                                                             checked={selectedServices.includes(service._id)}
//                                                             onChange={handleServiceChange}
//                                                         />
//                                                         <label className="form-check-label" htmlFor={`service-${service._id}`}>
//                                                             {service.name}
//                                                         </label>
//                                                     </div>


//                                                     <input
//                                                         type="number"
//                                                         className="form-control my-2"
//                                                         placeholder="Enter Group Qty"
//                                                         onChange={(e) => InputGroupQty(e, service._id)}
//                                                         min={0}
//                                                         defaultValue="0"
//                                                         disabled={!enabledInputs[service._id]}
//                                                     />
//                                                 </div>
//                                             ))}
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                     <button type="submit" className="btn btn-primary" >
//                         Add Group
//                     </button>
//                 </form>
//                 <ToastButton />

//             </Content >
//         </>
//     );
// };

// export default AddGroup;






/* eslint-disable react/jsx-pascal-case */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Formikform from "../../../../Components/ExtraComponents/Form/Formik_form2"
import { useFormik } from 'formik';
import * as  valid_err from "../../../../Utils/Common_Messages"
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Content from '../../../../Components/Dashboard/Content/Content1';
import { Get_All_Catagory, Service_By_Catagory } from '../../../../ReduxStore/Slice/Admin/AdminSlice'
import toast from 'react-hot-toast';
import { Add_Group } from '../../../../ReduxStore/Slice/Admin/GroupServiceSlice';
import ToastButton from "../../../../Components/ExtraComponents/Alert_Toast";
import { Trash2 } from 'lucide-react';



const AddStrategy = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

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


    const [selectedServices, setSelectedServices] = useState([]);
    const [enabledInputs, setEnabledInputs] = useState({});
    const [GroupQty, setGroupQty] = useState([]);
    const [forShowGroupQty, setforShowGroupQty] = useState([]);



    function removeServiceFromSelected(serviceId) {
        setSelectedServices((prevSelected) => prevSelected.filter((id) => id !== serviceId));
    }

    function handleServiceChange(event, id, name, segment) {
        const serviceId = id;
        const isChecked = event.target.checked;

        if (isChecked) {
            // Add the selected service's information to the array with a default qty of 0
            setSelectedServices((prevInfo) => [...prevInfo, { service_id: serviceId, name: name, segment: segment, group_qty: 0 }]);
        } else {
            // Remove the selected service's information from the array
            setSelectedServices((prevInfo) => prevInfo.filter((info) => info.service_id !== serviceId));
        }
    }




    const InputGroupQty = (event, id, servicename, segement) => {
        const updatedQty = event.target.value === "" ? 0 : parseInt(event.target.value);

        // Update the quantity for the selected service
        setSelectedServices((prevInfo) =>
            prevInfo.map((info) =>
                info.service_id === id
                    ? {
                        ...info,
                        group_qty: updatedQty,
                    }
                    : info
            )
        );

        // Update the quantity in the GroupQty array
        setGroupQty((prevQtys) => ([
            ...prevQtys.filter((qtyInfo) => qtyInfo.service_id !== id),
            {
                service_id: id,
                segment: segement,
                name: servicename,
                group_qty: updatedQty,
            }
        ]));

    }




    const remoeveService = (id) => {
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
        validate: (values) => {
            const errors = {};
            if (!values.groupname) {
                errors.groupname = valid_err.EMPTY_GROUP_NAME_ERR;
            }
            if (!values.segment) {
                errors.segment = valid_err.SEGEMENTSELECT_ERROR;
            }

            return errors;
        },
        onSubmit: async (values) => {

            await dispatch(Add_Group({
                groupdetails: { name: values.groupname },
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
            <Content Page_title="Add Group" button_title="Back" route="/admin/groupservices"
                additional_field={
                    <div style={{ overflowY: 'scroll', height: '65vh' }}>
                        <h4 className='text-center text-decoration-underline mb-3'>Select Services And Quantity</h4>
                        <table className="table table-responsive-sm col-md-3 " >
                            <thead className="bg-primary">
                                <tr>
                                    <th>#</th>
                                    <th>Segment</th>
                                    <th>Service Name</th>
                                    {/* <th>Qty</th> */}
                                    <th>Remove</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedServices && selectedServices.map((item, index) => {
                                    return <>
                                        <tr key={index + 1}>
                                            <td>{index + 1}</td>
                                            <td>{item.segment}</td>
                                            <td>{item.name}</td>
                                            {/* <td>
                                                <input
                                                type="number"
                                                className="form-control col-md-1"
                                                placeholder="Enter Qty"
                                                onChange={(e) => InputGroupQty(e, item.id, item.name, item.segment)}
                                                min={0}
                                                defaultValue="0"

                                            />
                                            </td> */}
                                            <td onClick={() => {
                                                remoeveService(item.service_id);
                                                removeServiceFromSelected(item.service_id);
                                            }
                                            }><Trash2 /></td>

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
                                                                    defaultChecked={selectedServices.includes(service._id)}
                                                                    onChange={(e) => handleServiceChange(e, service._id, service.name, service.category.name)}
                                                                />
                                                                <label className="form-check-label" htmlFor={`service-${service._id}`}>
                                                                    {service.name}
                                                                </label>
                                                            </div>


                                                            {/* <input
                                                                type="number"
                                                                className="form-control col-md-1 my-2"
                                                                placeholder="Enter Qty"
                                                                onChange={(e) => InputGroupQty(e, service._id, service.category.name, service.name)}
                                                                min={0}

                                                                defaultValue="0"
                                                                style={{ background: !enabledInputs[service._id] ? '#eeeeee' : "" }}
                                                                readOnly={!enabledInputs[service._id]}
                                                            /> */}
                                                        </div>


                                                    ))}
                                                </>

                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* <table className="table table-responsive-sm ">
                                <thead className="bg-primary">
                                    <tr>
                                        <th>#</th>
                                        <th>Segment</th>
                                        <th>Service Name</th>
                                        <th>Qty</th>
                                        <th>Remove</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedServices && selectedServices.map((item, index) => {
                                        return <>
                                            <tr key={index + 1}>
                                                <td>{index + 1}</td>
                                                <td>{item.segment}</td>
                                                <td>{item.name}</td>
                                                <td><input
                                                    type="number"
                                                    className="form-control col-md-1"
                                                    placeholder="Enter Qty"
                                                    // onChange={(e) => InputGroupQty(e, service._id, service.category.name, service.name)}
                                                    min={0}
                                                    defaultValue="0"
                                                // style={{ background: !enabledInputs[service._id] ? '#eeeeee' : "" }}
                                                // readOnly={!enabledInputs[service._id]}
                                                />
                                                </td>
                                                <td onClick={() => remoeveService(item.id)}><Trash2 /></td>

                                            </tr>
                                        </>
                                    })


                                    }

                                </tbody >
                            </table> */}


                        </>
                    }
                />



                < ToastButton />
            </Content >
        </>
    )



}


export default AddStrategy


