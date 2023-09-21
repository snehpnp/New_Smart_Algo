/* eslint-disable react-hooks/exhaustive-deps */
// import React from 'react'

import React, { useEffect, useState } from 'react'
import Loader from '../../../../Utils/Loader'
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import Content from "../../../../Components/Dashboard/Content/Content"
import Formikform from "../../../../Components/ExtraComponents/Form/Formik_form1"
import * as  valid_err from "../../../../Utils/Common_Messages"
import { Email_regex, Mobile_regex } from "../../../../Utils/Common_regex"

import { useFormik } from 'formik';
import { Get_All_SUBADMIN } from '../../../../ReduxStore/Slice/Subadmin/Subadminslice'
import { useDispatch, useSelector } from "react-redux";
import { Get_All_Service_for_Client } from '../../../../ReduxStore/Slice/Common/commoSlice'
import { GET_ALL_GROUP_SERVICES } from '../../../../ReduxStore/Slice/Admin/AdminSlice';


const AllSubadmin = () => {

    const dispatch = useDispatch()

    const user_token = JSON.parse(localStorage.getItem("user_details")).token
    const Role = JSON.parse(localStorage.getItem("user_details")).Role
    const user_id = JSON.parse(localStorage.getItem("user_details")).user_id


    const [first, setfirst] = useState('all')
    const [showModal, setshowModal] = useState(false)

    const [ShowAllStratagy, setShowAllStratagy] = useState(false)

    const [selectedStrategies, setSelectedStrategies] = useState([]);
    const [SelectedGroupServices, setSelectedGroupServices] = useState([]);



    const [Addsubadmin, setAddsubadmin] = useState({
        loading: false,
        data: []
    });


    const [AllGroupServices, setAllGroupServices] = useState({
        loading: true,
        data: []
    });

    const [AllStrategy, setAllStrategy] = useState({
        loading: true,
        data: []
    });



    const isValidEmail = (email) => {
        return Email_regex(email)
    }
    const isValidContact = (mobile) => {
        return Mobile_regex(mobile)
    }



    const formik = useFormik({
        initialValues: {
            FullName: "",
            username: '',
            email: '',
            mobile: '',
            password: '',
            Strategy: false,
            select_strategy: [],
            gotodashboard: false,
            licence: false,
            all: false,
            editclient: false,
            addclient: false,
            tradehistory: false,
            groupservice: false,
            select_group_services: [],
            group: false,
        },
        validate: (values) => {

            const errors = {};
            if (!values.username) {
                errors.username = valid_err.USERNAME_ERROR;
            }
            if (!values.FullName) {
                errors.FullName = valid_err.FULLNAME_ERROR;
            }
            if (!values.password) {
                errors.password = valid_err.PASSWORD_ERROR;
            }

            if (!values.mobile) {
                errors.mobile = valid_err.CONTACT_ERROR;
            } else if (!isValidContact(values.mobile)) {
                errors.mobile = valid_err.INVALID_CONTACT_ERROR;
            }
            if (!values.email) {
                errors.email = valid_err.EMPTY_EMAIL_ERROR;
            } else if (!isValidEmail(values.email)) {
                errors.email = valid_err.INVALID_EMAIL_ERROR;
            }

            if (!values.password) {
                errors.password = valid_err.PASSWORD_ERROR;
            }


            return errors;
        },
        onSubmit: async (values) => {
            const req = {
                "FullName": values.FullName,
                "UserName": "0",
                "Email": values.email,
                "PhoneNo": values.mobile,
                "password": values.mobile,
                "Role": "SUBADMIN",
                "parent_role": Role,
                "parent_id": user_id,
                "Subadmin_permision_data": {
                    "all_permission": values.all ? '1' : '0',
                    "addclient": values.addclient ? '1' : values.all ? '1' : '0',
                    "editclient": values.editclient ? '1' : values.all ? '1' : '0',
                    "licence": values.licence ? '1' : values.all ? '1' : '0',
                    "group": values.group ? '1' : values.all ? '1' : '0',
                    "groupservice": values.groupservice ? '1' : values.all ? '1' : '0',
                    "Strategy": values.Strategy ? '1' : values.all ? '1' : '0',
                    "select_strategy": selectedStrategies,
                    "select_group_services": SelectedGroupServices,
                    "go_To_Dashboard": values.gotodashboard ? '1' : values.all ? '1' : '0',
                    "trade_history_old": values.tradehistory ? '1' : values.all ? '1' : '0',

                }
            }

            console.log("req" ,req)
        }
    });

    const fields = [

        // { name: 'username', label: 'Username', type: 'text', label_size: 12, col_size: 6, disable: true },
        { name: 'fullName', label: 'FullName', type: 'text', label_size: 12, col_size: 6, },
        { name: 'mobile', label: 'Mobile', type: 'text', label_size: 12, col_size: 6 },
        { name: 'email', label: 'Email', type: 'text', label_size: 12, col_size: 6, },
        { name: 'password', label: 'Password', type: 'password', label_size: 12, col_size: 6, },
        { name: 'all', label: 'All Permission', type: 'checkbox', label_size: 12, col_size: 3, },
        {
            name: 'addclient', label: 'Add Client', type: 'checkbox', label_size: 12, col_size: 3,
            check_box_true: formik.values.all || formik.values.addclient ? true : false,
        },
        {
            name: 'editclient', label: 'Edit Client', type: 'checkbox', label_size: 12, col_size: 3,
            check_box_true: formik.values.all || formik.values.editclient ? true : false,
        },
        {
            name: 'licence', label: 'Licence  Permission', type: 'checkbox', label_size: 12, col_size: 3,
            check_box_true: formik.values.all || formik.values.licence ? true : false,
        },
        {
            name: 'gotodashboard', label: 'Go To Dashboard', type: 'checkbox', label_size: 12, col_size: 3,
            check_box_true: formik.values.all || formik.values.gotodashboard ? true : false,
        },
        {
            name: 'tradehistory', label: 'Trade History', type: 'checkbox', label_size: 12, col_size: 3,
            check_box_true: formik.values.all || formik.values.tradehistory ? true : false,
        },

        // {
        //     name: 'group', label: 'Group Permission', type: 'checkbox', label_size: 12, col_size: 3,
        //     check_box_true: formik.values.all || formik.values.group ? true : false,
        // },
        {
            name: 'groupservice', label: 'Group Service Permission', type: 'checkbox',
            check_box_true: formik.values.all || formik.values.groupservice ? true : false,
            label_size: 12, col_size: 3,
        },
        {
            name: 'Strategy', label: 'Strategy Permission', type: 'checkbox', label_size: 12, col_size: 3,
            check_box_true: formik.values.all || formik.values.Strategy ? true : false,
        },


    ]

    const data = async () => {

        await dispatch(Get_All_Service_for_Client({
            req: {
            }, token: user_token
        })).unwrap().then((response) => {
            if (response.status) {
                setAllStrategy({
                    loading: false,
                    data: response.data
                });
            }
        })

        await dispatch(GET_ALL_GROUP_SERVICES()).unwrap()
            .then((response) => {


                if (response.status) {
                    setAllGroupServices({
                        loading: false,
                        data: response.data
                    });
                }
            })

    }


    useEffect(() => {
        data()
    }, [])



    useEffect(() => {
        if (formik.values.all) {
            formik.setFieldValue('editclient', true);
            formik.setFieldValue('gotodashboard', true);
            formik.setFieldValue('licence', true);
            formik.setFieldValue('group', true);
            formik.setFieldValue('groupservice', true);
            formik.setFieldValue('Strategy', true);
        }
        else {
            formik.setFieldValue('editclient', false);
            formik.setFieldValue('gotodashboard', false);
            formik.setFieldValue('licence', false);
            formik.setFieldValue('group', false);
            formik.setFieldValue('groupservice', false);
            formik.setFieldValue('Strategy', false);

        }


    }, [formik.values.all]);




    const handleStrategyChange = (event) => {
        const strategyId = event.target.value;


        const strategyName = event.target.name; // Assuming the label contains the strategy name

        if (event.target.checked) {
            // Add the selected strategy to the array
            setSelectedStrategies([...selectedStrategies, { id: strategyId, name: strategyName }]);
        } else {
            // Remove the deselected strategy from the array
            setSelectedStrategies(selectedStrategies.filter((strategy) => strategy.id !== strategyId));
        }
    };

    const handleGroupChange = (event) => {
        const strategyId = event.target.value;


        const strategyName = event.target.name; // Assuming the label contains the strategy name

        if (event.target.checked) {
            // Add the selected strategy to the array
            setSelectedGroupServices([...SelectedGroupServices, { id: strategyId, name: strategyName }]);
        } else {
            // Remove the deselected strategy from the array
            setSelectedGroupServices(SelectedGroupServices.filter((strategy) => strategy.id !== strategyId));
        }
    };



    return (
        <>
            {
                Addsubadmin.loading ? <Loader /> :
                    <>
                        <Content Page_title="Add Sub-Admin" button_title="Back" route="/admin/allsubadmins">
                            <Formikform fieldtype={fields.filter(field => !field.showWhen)} formik={formik} btn_name="Add Sub-Admin"
                                additional_field={
                                    <>

                                        {formik.values.groupservice ? <>
                                            <h6>All Group Service</h6>
                                            {AllGroupServices.data.map((strategy) => (
                                                <div className={`col-lg-2 mt-2`} key={strategy._id}>
                                                    <div className="row ">
                                                        <div className="col-lg-12 ">
                                                            <div class="form-check custom-checkbox mb-3">
                                                                <input type='checkbox' className="form-check-input" name={strategy.name}
                                                                    value={strategy._id}
                                                                    onChange={(e) => handleGroupChange(e)}
                                                                />
                                                                <label className="form-check-label" for={strategy.name}>{strategy.name}</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </> : ""}

                                        {formik.values.Strategy ? <>
                                            <h6>All Strategy</h6>
                                            <label class="toggle mt-3">
                                                <input class="toggle-checkbox bg-primary" type="checkbox" onChange={(e) => {
                                                    setShowAllStratagy(e.target.checked)
                                                }}
                                                    defaultChecked={formik.values.all}
                                                />
                                                <div class={`toggle-switch ${ShowAllStratagy ? 'bg-primary' : "bg-secondary"}`}></div>
                                                <span class="toggle-label">Show Strategy</span>
                                            </label>
                                        </> : ""}

                                        {/*  For Show All Strategy */}
                                        {ShowAllStratagy || formik.values.all ? <>
                                            {AllStrategy.data.map((strategy) => (
                                                <div className={`col-lg-2 mt-2`} key={strategy._id}>
                                                    <div className="row ">
                                                        <div className="col-lg-12 ">
                                                            <div class="form-check custom-checkbox mb-3">
                                                                <input type='checkbox' className="form-check-input" name={strategy.strategy_name}
                                                                    value={strategy._id}
                                                                    onChange={(e) => handleStrategyChange(e)}
                                                                />
                                                                <label className="form-check-label" for={strategy.strategy_name}>{strategy.strategy_name}</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </> : ""}

                                    </>
                                } />

                        </Content>
                    </>
            }



        </ >
    )
}


export default AllSubadmin
