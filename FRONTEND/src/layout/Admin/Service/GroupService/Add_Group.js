/* eslint-disable react/jsx-pascal-case */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Formikform from "../../../../Components/ExtraComponents/Form/Formik_form"
import { useFormik } from 'formik';
import * as  valid_err from "../../../../Utils/Common_Messages"
// import { toast } from "react-toastify";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Email_regex, Mobile_regex } from "../../../../Utils/Common_regex"
import { useDispatch, useSelector } from "react-redux";
import Content from '../../../../Components/Dashboard/Content/Content';
import Theme_Content from '../../../../Components/Dashboard/Content/Theme_Content';
// import "../../../component/admin/admin-assets/css/style.css"
import { Service_By_Catagory, Get_All_Catagory } from '../../../../ReduxStore/Slice/Admin/AdminSlice'

import { ArrowLeft } from 'lucide-react';


// import { AddClients } from "../../../ReduxStore/Slice/AdminMasters"



const AddGroup = () => {


    const navigate = useNavigate()
    const dispatch = useDispatch()


    // const AdminToken = JSON.parse(localStorage.getItem('user_details')).accessToken;
    // const userid = JSON.parse(localStorage.getItem('user_details')).id;
    // const roleId = JSON.parse(localStorage.getItem('user_details')).roleId;
    // const admin_id = JSON.parse(localStorage.getItem('user_details')).admin_id;
    // const RoleId = JSON.parse(localStorage.getItem('user_details')).roles;




    const [showLoader, setshowLoader] = useState(false)



    const [SegmentName, setSegmentName] = useState('all')


    const [allServices, setAllServices] = useState({
        loading: true,
        data: []
    })
    const [GetAllSgments, setGetAllSgments] = useState({
        loading: true,
        data: []
    })

    console.log("allServices", allServices);






    const isValidEmail = (email) => {
        return Email_regex(email)
    }
    const isValidContact = (mobile) => {
        return Mobile_regex(mobile)
    }





    const formik = useFormik({
        initialValues: {
            selectSegment: null,
            // selectedServices :null ,
            selectedServices: []


        },
        validate: (values) => {
            const errors = {};
            if (!values.group_name) {
                errors.group_name = valid_err.USERNAME_ERROR;
            }
            if (!values.fullName) {
                errors.fullName = valid_err.FULLNAME_ERROR;
            }
            if (!values.mobile) {
                errors.mobile = valid_err.CONTACT_ERROR;
            } else if (!isValidContact(values.mobile)) {
                errors.mobile = valid_err.INVALID_CONTACT_ERROR;
            }
            // if (!values.licencetype) {
            //   errors.licence = valid_err.LICENCE_TYPE_ERROR;
            // }
            // if (!values.tomonth) {
            //   errors.tomonth = valid_err.LICENCE_ERROR;
            // }
            if (!values.broker) {
                errors.broker = valid_err.BROKER_ERROR;
            }
            // if (!values.apisecret) {
            //   errors.apisecret = valid_err.APISECRET_ERROR;
            // }
            // if (!values.apikey) {
            //   errors.apikey = valid_err.APIKEY_ERROR;
            // }
            // if (!values.apiid) {
            //   errors.apiid = valid_err.APIID_ERROR;
            // }

            if (!values.email) {
                errors.email = valid_err.EMPTY_EMAIL_ERROR;
            } else if (!isValidEmail(values.email)) {
                errors.email = valid_err.INVALID_EMAIL_ERROR;
            }

            return errors;
        },
        onSubmit: async (values) => {

            const req = {
                // "fullname": values.fullName,
                // "username": values.username,
                // "email": values.email,
                // "phone_number": values.mobile,
                // "license_type": "1",
                // "licence": "0",
                // "roleId": "3",
                // "roles": RoleId,
                // "master_id": "0",
                // "parent_admin_id": userid,
                // "parent_role_id": setRoleId(RoleId),
                // // "parent_role_id": roleId,
                // "broker": values.broker,
                // "api_secret": values.api_secret,
                // "app_id": values.app_id,
                // "client_code": values.client_code,
                // "api_key": values.api_key,
                // "app_key": values.app_key,
                // "api_type": values.api_type,

                // "demat_userid": values.demat_userid
            }

            // console.log("res", req);
            // return

            //   await dispatch(AddClients({ req: req, AdminToken: AdminToken })).then((res) => {


            //     if (res.meta.requestStatus === "fulfilled") {
            //       if (res.payload === "Failed! Username is already in use!") {
            //         toast.error(res.payload)
            //       } else {
            //         toast.success(res.payload.data)
            //         // setshowLoader(false)
            //         // setshowLoader(false)
            //         setTimeout(() => {
            //           navigate("/admin/masters")
            //         }, 2000);
            //       }
            //     }

            //   })
        }
    });



    //  Get All Segments

    const getservice = async () => {
        await dispatch(Get_All_Catagory()).unwrap()
            .then((response) => {
                console.log(response);
                if (response.status) {
                    setGetAllSgments({
                        loading: false,
                        data: response.data
                    });
                }
            })
    }
    useEffect(() => {
        getservice()
    }, [])


    //  Get Service By Segments

    const data = async () => {
        if (formik.values.selectSegment) {
            await dispatch(Service_By_Catagory({ segment: formik.values.selectSegment })).unwrap()
                .then((response) => {

                    if (response.status) {
                        setAllServices({
                            loading: false,
                            data: response.data
                        });
                    }
                })
        }

    }

    useEffect(() => {
        data()
    }, [formik.values.selectSegment])



    // console.log("formik.values", formik.values);

    const [selectedServices, setSelectedServices] = useState([]);

    const handleServiceChange = (event) => {
        const serviceId = event.target.value;
        if (event.target.checked) {
            setSelectedServices(prevSelected => [...prevSelected, serviceId]);
        } else {
            setSelectedServices(prevSelected => prevSelected.filter(id => id !== serviceId));
        }
    };

    console.log("selectedServices" ,formik.values);

    const fields = [
        { name: 'group_name', label: ' Group Name', type: 'text' },
        {
            name: 'selectSegment',
            label: 'Segments',
            type: 'select',
            options: GetAllSgments.data && GetAllSgments.data.map((item) => ({ label: item.name, value: item.segment }))
        },
        {
            name: 'selectedServices',
            label: 'Select Services',
            type: 'checkbox',
            options: allServices.data ? allServices.data.map((service) => ({ label: service.name, value: service._id })) : "no data",
            showWhen: (values) => values.subadmin !== '',
            onChange: handleServiceChange,
            value: selectedServices,
        }

    ];

    return (
        <>
            <Content Page_title="Add Group" button_title="Back" route="/admin/groupservices">
                <Formikform fieldtype={fields.filter(field => !field.showWhen || field.showWhen(formik.values))} formik={formik} btn_name="Add Group" title="addgroup" />
            </Content >

        </>
    )
}


export default AddGroup





