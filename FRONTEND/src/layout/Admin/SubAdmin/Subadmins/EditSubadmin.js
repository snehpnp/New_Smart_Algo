/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Loader from '../../../../Utils/Loader'
import { useNavigate, useParams } from "react-router-dom";
import Content from "../../../../Components/Dashboard/Content/Content"
import Formikform from "../../../../Components/ExtraComponents/Form/Formik_form1"
import * as  valid_err from "../../../../Utils/Common_Messages"
import { Mobile_regex } from "../../../../Utils/Common_regex"

import { useFormik } from 'formik';

import { useDispatch } from "react-redux";
import { Get_All_Service_for_Client } from '../../../../ReduxStore/Slice/Common/commoSlice'
import { GET_ALL_GROUP_SERVICES } from '../../../../ReduxStore/Slice/Admin/AdminSlice';
import { Find_One_Subadmin, Edit_Subadmin } from '../../../../ReduxStore/Slice/Admin/CreateSubadminSlice'

import toast from 'react-hot-toast';

import ToastButton from "../../../../Components/ExtraComponents/Alert_Toast";

const AllSubadmin = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { id } = useParams()

    const user_token = JSON.parse(localStorage.getItem("user_details")).token
    const Role = JSON.parse(localStorage.getItem("user_details")).Role
    const user_id = JSON.parse(localStorage.getItem("user_details")).user_id
    const token = JSON.parse(localStorage.getItem("user_details")).token


    const [checkedStrategies, setCheckedStrategies] = useState([]);
    const [checkedGroupServices, setCheckedGroupServices] = useState([]);

    const [selectedStrategyIds, setSelectedStrategyIds] = useState([]);
    const [selectedGroupIds, setSelectedGroupIds] = useState([]);



    const [state, setstate] = useState([]);
    const [state1, setstate1] = useState([]);



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


    const [UserData, setUserData] = useState({
        loading: true,
        data: []
    });

    const isValidContact = (mobile) => {
        return Mobile_regex(mobile)
    }


    // GET USER DETAILS
    const data_1 = async () => {
        await dispatch(Find_One_Subadmin({ 'id': id, token: token })).unwrap()
            .then((response) => {
                if (response.status) {
                    setUserData({
                        loading: false,
                        data: response
                    });
                }
            })
    }
    useEffect(() => {
        data_1()
    }, [])

    const formik = useFormik({
        initialValues: {
            FullName: null,
            email: null,
            mobile: 'null',
            password: 'null',
            Strategy: false,
            select_strategy: [],
            gotodashboard: false,
            licence: false,
            detailsinfo: false,
            all: false,
            editclient: false,
            addclient: false,
            tradehistory: false,
            groupservice: false,
            updateapikeys: false,
            select_group_services: [],
            grouper_servcice: "",
            strateg_servcice: ""
        },
        touched: {
            FullName: false,
            email: false,
            mobile: false,
            password: false,
        },
        validate: (values) => {
            const errors = {};

            if (!values.password) {
                errors.password = valid_err.PASSWORD_ERROR;
            }
            if (!values.mobile && formik.touched.mobile) {
                errors.mobile = valid_err.CONTACT_ERROR;
            } else if (!isValidContact(values.mobile) && formik.touched.mobile) {
                errors.mobile = valid_err.INVALID_CONTACT_ERROR;
            }


            if (values.Strategy) {
                if (!values.addclient && !values.editclient) {
                    errors.addclient = "select Add Client Also";
                    errors.editclient = "select Edit Client Also";
                }
            }
            if (values.groupservice) {
                if (!values.addclient && !values.editclient) {
                    errors.addclient = "select Add Client Also";
                    errors.editclient = "select Edit Client Also";
                }
            }

            if ((values.addclient || values.editclient) && values.groupservice && selectedGroupIds.length === 0) {
                errors.grouper_servcice = "You must select a Group Service from the list";
            }
            if ((values.addclient || values.editclient) && values.Strategy && selectedStrategyIds.length === 0) {
                errors.strateg_servcice = "You must select a Strategy from the list";
            }

            return errors;
        },
        onSubmit: async (values) => {

            const req = {
                "FullName": values.FullName,
                "Email": values.email,
                "PhoneNo": values.mobile,
                "password": values.password,
                "Role": "SUBADMIN",
                "parent_role": Role,
                "parent_id": user_id,
                "id": id,
                "Subadmin_permision_data": {
                    "client_add": values.addclient ? '1' : values.all ? '1' : '0',
                    "client_edit": values.editclient ? '1' : values.all ? '1' : '0',
                    "license_permision": values.licence ? '1' : values.all ? '1' : '0',
                    "go_To_Dashboard": values.gotodashboard ? '1' : values.all ? '1' : '0',
                    "trade_history_old": values.tradehistory ? '1' : values.all ? '1' : '0',
                    "detailsinfo": values.detailsinfo ? '1' : values.all ? '1' : '0',
                    'strategy': selectedStrategyIds,
                    'Update_Api_Key': values.updateapikeys ? '1' :  '0',
                    'group_services': selectedGroupIds,
                }
            }


            await dispatch(Edit_Subadmin({ req: req, token: user_token })).unwrap().then((response) => {
                if (response.status === 409) {
                    toast.error(response.data.msg);
                }
                else if (response.status) {
                    toast.success(response.msg);

                    setTimeout(() => {
                        navigate("/admin/allsubadmins")
                    }, 1000);
                }
                else if (!response.status) {
                    toast.error(response.msg);
                }

            })
        }
    });


    //  SET INTIAL VALUE


    // console.log("UserData.data.data :", UserData.data.data)
    useEffect(() => {
        if (UserData.data.data !== undefined) {
            let userStrategyIds = UserData.data.data !== undefined && UserData.data.data[0].subadmin_permissions[0]
            formik.setFieldValue('FullName', UserData.data.data !== undefined && UserData.data.data[0].FullName);
            formik.setFieldValue('email', UserData.data.data !== undefined && UserData.data.data[0].Email);
            formik.setFieldValue('mobile', UserData.data.data !== undefined && UserData.data.data[0].PhoneNo);
            formik.setFieldValue('password', UserData.data.data !== undefined && UserData.data.data[0].Otp);
            formik.setFieldValue('addclient', userStrategyIds.client_add === 1 ? true : false);
            formik.setFieldValue('editclient', userStrategyIds.client_edit === 1 ? true : false);
            formik.setFieldValue('detailsinfo', userStrategyIds.detailsinfo === 1 ? true : false);
            formik.setFieldValue('gotodashboard', userStrategyIds.go_To_Dashboard === 1 ? true : false);
            formik.setFieldValue('licence', userStrategyIds.license_permision === 1 ? true : false);
            formik.setFieldValue('updateapikeys', userStrategyIds.Update_Api_Key === 1 ? true : false);
            formik.setFieldValue('tradehistory', userStrategyIds.trade_history_old === 1 ? true : false);
            formik.setFieldValue('Strategy', userStrategyIds.strategy && userStrategyIds.strategy.length > 0 ? true : false);
            formik.setFieldValue('groupservice', userStrategyIds.group_services && userStrategyIds.group_services.length !== 0 ? true : false);
        }
    }, [UserData.data.data]);

    console.log("UserData.data.data :", UserData.data.data)




    useEffect(() => {
        if (formik.values.updateapikeys) {
            formik.setFieldValue("all", false);
            formik.setFieldValue("addclient", false);
            formik.setFieldValue('detailsinfo', false);
            formik.setFieldValue("editclient", false);
            formik.setFieldValue("gotodashboard", false);
            formik.setFieldValue("licence", false);
            formik.setFieldValue("group", false);
            formik.setFieldValue("groupservice", false);
            formik.setFieldValue("Strategy", false);
            formik.setFieldValue("tradehistory", false);
        }
    }, [formik.values.updateapikeys]);
   




    useEffect(() => {

        if ((formik.values.addclient) || (formik.values.editclient) || (formik.values.Strategy) || (formik.values.groupservice) || (formik.values.detailsinfo) || (formik.values.tradehistory) || (formik.values.gotodashboard)) {
            formik.setFieldValue("updateapikeys", false);
            setstate([])
            setstate1([])
            return
        }

        if (formik.values.Strategy) {
            formik.setFieldValue("Strategy", true);
            return
        }

        if (formik.values.groupservice) {
            formik.setFieldValue("groupservice", true);
            return
        }
        if ((formik.values.addclient) || (formik.values.editclient)) {
            formik.setFieldValue("groupservice", true);
            formik.setFieldValue("Strategy", true);
            setstate([])
            setstate1([])
            return
        } else if (!formik.values.addclient) {
            formik.setFieldValue("groupservice", false);
            formik.setFieldValue("Strategy", false);
            formik.setFieldValue("strateg_servcice", '');
            formik.setFieldValue("grouper_servcice", '');
            setstate([])
            setstate1([])
        }
        else {
            formik.setFieldValue("groupservice", false);
            formik.setFieldValue("Strategy", false);
            setstate([])
            setstate1([])
            return
        }
    }, [formik.values.editclient, formik.values.addclient, formik.values.detailsinfo, formik.values.tradehistory, formik.values.gotodashboard, formik.values.Strategy, formik.values.groupservice]);


    useEffect(() => {
        if (formik.values.all) {
            formik.setFieldValue('editclient', true);
            formik.setFieldValue('gotodashboard', true);
            formik.setFieldValue('licence', true);
          
            formik.setFieldValue('groupservice', true);
            formik.setFieldValue('Strategy', true);
        
        }
        else {
            formik.setFieldValue('editclient', false);
            formik.setFieldValue('updateapikeys', false);
            formik.setFieldValue('gotodashboard', false);
            formik.setFieldValue('licence', false);
     
            formik.setFieldValue('groupservice', false);
            formik.setFieldValue('Strategy', false);
        }
    }, [formik.values.all]);


    const fields = [
        { name: 'FullName', label: 'FullName', type: 'text', label_size: 12, col_size: 6, disable: true },
        { name: 'mobile', label: 'Mobile', type: 'text', label_size: 12, col_size: 6, disable: false },
        { name: 'email', label: 'Email', type: 'text', label_size: 12, col_size: 6, disable: true },
        { name: 'password', label: 'Password', type: 'password', label_size: 12, col_size: 6, disable: false },
        {
            name: 'all', label: 'All Permissions', type: 'checkbox', label_size: 12, col_size: 3,
            check_box_true: formik.values.all ? true : false,
        },
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
        {
            name: 'detailsinfo', label: 'Full Info View', type: 'checkbox', label_size: 12, col_size: 3,
            check_box_true: formik.values.all || formik.values.detailsinfo ? true : false,
        },
        {
            name: 'groupservice', label: 'Group Service Permission', type: 'checkbox',
            check_box_true: formik.values.all || formik.values.groupservice ? true : false,
            label_size: 12, col_size: 3,
        },
        {
            name: 'Strategy', label: 'Strategy Permission', type: 'checkbox', label_size: 12, col_size: 3,
            check_box_true: formik.values.all || formik.values.Strategy ? true : false,
        },
        {
            name: "updateapikeys",
            label: "Update Client API Key",
            type: "checkbox",
            label_size: 12,
            col_size: 3,
            check_box_true: formik.values.updateapikeys ? true : false,
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
        if (UserData.data.data !== undefined && UserData.data.data.length > 0) {
            const userStrategyIds = UserData.data.data[0].subadmin_permissions[0].strategy;
            setSelectedStrategyIds(userStrategyIds);
            const usergropupyIds = UserData.data.data[0].subadmin_permissions[0].group_services;
            setSelectedGroupIds(usergropupyIds);
        }
    }, [UserData.data]);

    //  For Select Strategy Change


    useEffect(() => {
        if (UserData.data.data !== undefined && UserData.data.data.length > 0) {
            const userStrategyIds = UserData.data.data !== undefined && UserData.data.data[0].subadmin_permissions[0].strategy
            const initialCheckedStrategies = AllStrategy.data.map((strategy) => {
                return {
                    id: strategy._id,
                    name: strategy.strategy_name,
                    checked: userStrategyIds.includes(strategy._id),
                };
            });
            setCheckedStrategies(initialCheckedStrategies);
        }
    }, [UserData.data, AllStrategy.data]);


    const handleStrategyChange = (event) => {
        var strategyId = event.target.value
        setCheckedStrategies((prevStrategies) => {
            return prevStrategies.map((strategy) => {
                if (strategy.id === strategyId) {
                    return { ...strategy, checked: !strategy.checked };
                }
                return strategy;
            });
        });
        setSelectedStrategyIds((prevIds) => {
            if (prevIds.includes(strategyId)) {
                let abc = prevIds.filter((id) => id !== strategyId);
                return abc
            } else {
                return [...prevIds, strategyId];
            }
        });
    };

    //  For Select Group Change Change
    useEffect(() => {
        if (UserData.data.data !== undefined && UserData.data.data.length > 0) {
            const userStrategyIds = UserData.data.data !== undefined && UserData.data.data[0].subadmin_permissions[0].group_services
            const initialCheckedStrategies = AllGroupServices.data && AllGroupServices.data.map((strategy) => {
                return {
                    id: strategy._id,
                    name: strategy.name,
                    checked: userStrategyIds.includes(strategy._id),
                };
            });
            setCheckedGroupServices(initialCheckedStrategies);
        }
    }, [UserData.data, AllGroupServices.data]);


    const handleStrategyChange1 = (event) => {
        const strategyId = event.target.value;
        setCheckedGroupServices((prevStrategies) => {
            return prevStrategies.map((strategy) => {
                if (strategy.id === strategyId) {
                    return { ...strategy, checked: !strategy.checked };
                }
                return strategy;
            });
        });


        setSelectedGroupIds((prevIds) => {
            if (prevIds.includes(strategyId)) {
                return prevIds.filter((id) => id !== strategyId);
            } else {
                return [...prevIds, strategyId];
            }
        });
    };




    return (
        <>
            {
                Addsubadmin.loading ? <Loader /> :
                    <>
                        <Content Page_title="Edit Sub-Admin" button_title="Back" route="/admin/allsubadmins">
                            <Formikform fieldtype={fields.filter(field => !field.showWhen)} formik={formik} btn_name="Update"
                                additional_field={
                                    <>
                                        {formik.values.groupservice ? <>
                                            <h6 className='fw-bold mt-3 text-decoration-underline'>All Group Service</h6>
                                            {checkedGroupServices.map((strategy) => (
                                                <div className={`col-lg-2 mt-2 `} key={strategy.id}>
                                                    <div className="row">
                                                        <div className="col-lg-12">
                                                            <div className="form-check custom-checkbox mb-3">
                                                                <input
                                                                    type="checkbox"
                                                                    className="form-check-input"
                                                                    name={strategy.id}
                                                                    value={strategy.id}
                                                                    onChange={(e) => handleStrategyChange1(e)}
                                                                    checked={strategy.checked}
                                                                />
                                                                <label className="form-check-label" htmlFor={strategy.id}>
                                                                    {strategy.name}
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {formik.errors.grouper_servcice && (
                                                <div style={{ color: "red" }}>
                                                    {formik.errors.grouper_servcice}
                                                </div>
                                            )}
                                        </> : ""
                                        }
                                        {
                                            formik.values.Strategy ? <>
                                                <h6 className='fw-bold mt-3 text-decoration-underline'>All Strategy</h6>
                                                {checkedStrategies.map((strategy) => (
                                                    <div className={`col-lg-2 mt-2`} key={strategy.id}>
                                                        <div className="row">
                                                            <div className="col-lg-12">
                                                                <div className="form-check custom-checkbox mb-3">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="form-check-input "
                                                                        name={strategy.id}
                                                                        value={strategy.id}
                                                                        onChange={(e) => handleStrategyChange(e)}
                                                                        checked={strategy.checked}
                                                                    />
                                                                    <label className="form-check-label" htmlFor={strategy.id}>
                                                                        {strategy.name}
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                {formik.errors.strateg_servcice && (
                                                    <div style={{ color: "red" }}>
                                                        {formik.errors.strateg_servcice}
                                                    </div>
                                                )}
                                            </> : ""}
                                    </>
                                } />
                            <ToastButton />
                        </Content>
                    </ >
            }
        </>

    )
}


export default AllSubadmin
