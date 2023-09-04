import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as valid_err from '../../../../Utils/Common_Messages';
import { Email_regex, Mobile_regex } from '../../../../Utils/Common_regex';
import { useDispatch } from 'react-redux';
import Content from '../../../../Components/Dashboard/Content/Content';
import { Service_By_Catagory, Get_All_Catagory } from '../../../../ReduxStore/Slice/Admin/AdminSlice';
import { useLocation } from 'react-router-dom';


const EditGroup = () => {

    const location = useLocation()

    // console.log("location", location.state);
    const dispatch = useDispatch();
    const [selectedServices, setSelectedServices] = useState([]);
    const [GroupQty, setGroupQty] = useState([]);




    const [enabledInputs, setEnabledInputs] = useState({});


    // console.log("selectedServices", selectedServices);
    // console.log("GroupQty", GroupQty);


    const [allServices, setAllServices] = useState({
        loading: true,
        data: [],
    });


    // console.log("allServices" ,allServices);
    const [GetAllSgments, setGetAllSgments] = useState({
        loading: true,
        data: [],
    });

    const formik = useFormik({
        initialValues: {
            group_name: location.state.name,
            selectSegment: location.state._id ? location.state._id :null,
            selectedServices: [],
        },
        validate: (values) => {
            const errors = {};
            if (!values.group_name) {
                errors.group_name = valid_err.USERNAME_ERROR;
            }

            return errors;
        },
        handleSubmit: async (values) => {
        },
    });

    // console.log("selectSegment" ,formik.values);

    const data = async () => {
        if (formik.values.selectSegment) {
            await dispatch(Service_By_Catagory({ segment: formik.values.selectSegment })).unwrap()
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
    }, [formik.values.selectSegment]);

    const handleServiceChange = (event) => {
        const serviceId = event.target.value;
        const isChecked = event.target.checked;

        setSelectedServices((prevSelected) => {
            const updatedSelected = isChecked
                ? [...prevSelected, serviceId]
                : prevSelected.filter((id) => id !== serviceId);

            setEnabledInputs((prevInputs) => ({ ...prevInputs, [serviceId]: isChecked, }));

            return updatedSelected;
        });
    };

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



    const InputGroupQty = (event, id) => {

        setGroupQty((prevQtys) => ([
            ...prevQtys,
            {
                group_qty: event.target.value === "" ? "0" : event.target.value,
                service_id: id
            }
        ]));

    }


    const handleSubmit = (e) => {
        e.preventDefault()

        const uniqueArr = Object.values(
            GroupQty.reduce((acc, cur) => {
                acc[cur.service_id] = cur;
                return acc;
            }, {})
        );
        // console.log("uniqueArr", uniqueArr);

    }








    return (
        <>
            <Content Page_title="Add Group" button_title="Back" route="/admin/groupservices">
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="mb-3 row">
                                <label className="col-lg-4 col-form-label" htmlFor="group_name">
                                    Group Name
                                    <span className="text-danger">*</span>
                                </label>
                                <div className="col-lg-7">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="group_name"
                                        placeholder="Enter group name"
                                        {...formik.getFieldProps('group_name')}
                                        required=""
                                    />
                                    <div className="invalid-feedback">Please enter a group name</div>
                                    {formik.errors.group_name && (
                                        <div style={{ color: 'red' }}>{formik.errors.group_name}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="mb-3 row">
                                <label className="col-lg-4 col-form-label" htmlFor="selectSegment">
                                    Select Segment
                                </label>
                                <div className="col-lg-7">
                                    <select
                                        className="form-control"
                                        id="selectSegment"
                                        {...formik.getFieldProps('selectSegment')}
                                    >
                                        <option value="">Select a segment</option>
                                        {GetAllSgments.data.map((segment) => (
                                            <option key={segment.segment} value={segment.segment}>
                                                {segment.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="col-lg-12" style={{ overflowY: 'scroll', height: '40vh' }}>
                        {allServices.data.length > 0 && (
                            <div className="mb-3 row">
                                <div className="col-lg-12">
                                    <div className="row">
                                        {allServices.data.map((service) => (
                                            <div key={service._id} className="col-md-3 mb-2">
                                                <div className="form-check">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        id={`service-${service._id}`}
                                                        value={service._id}
                                                        checked={selectedServices.includes(service._id)}
                                                        onChange={handleServiceChange}
                                                    />
                                                    <label className="form-check-label" htmlFor={`service-${service._id}`}>
                                                        {service.name}
                                                    </label>
                                                </div>
                                                <input
                                                    type="number"
                                                    className="form-input my-2"
                                                    placeholder="Enter Group Qty"
                                                    onChange={(e) => InputGroupQty(e, service._id)}
                                                    min={0}
                                                    defaultValue="0"
                                                    disabled={!enabledInputs[service._id]}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <button type="submit" className="btn btn-primary" >
                        Add Group
                    </button>
                </form>
            </Content>
        </>
    );
};

export default EditGroup
    ;
