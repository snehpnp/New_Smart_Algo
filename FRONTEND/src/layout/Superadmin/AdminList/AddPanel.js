import React, { useEffect, useState } from "react";
import Loader from "../../..//Utils/Loader";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import Content from "../../../Components/Dashboard/Content/Content";
import Formikform from "../../../Components/ExtraComponents/Form/Formik_form1";
import * as valid_err from "../../../Utils/Common_Messages";


import { useFormik } from "formik";
import { Add_Panel_data } from "../../..//ReduxStore/Slice/Superadmin/SuperAdminSlice";
import { useDispatch, useSelector } from "react-redux";
import { Get_All_Theme_Name } from '../../../ReduxStore/Slice/ThemeSlice';
import { All_Brokers } from '../../../ReduxStore/Slice/Superadmin/SuperAdminSlice'

import toast, { Toaster } from "react-hot-toast";

import ToastButton from "../../../Components/ExtraComponents/Alert_Toast";

const Add_Panel = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const user_token = JSON.parse(localStorage.getItem("user_details")).token;
    const Role = JSON.parse(localStorage.getItem("user_details")).Role;
    const user_id = JSON.parse(localStorage.getItem("user_details")).user_id;

    const [getAllThemeName, setAllThemeName] = useState([]);
    const [getGetAllBrokerName, setGetAllBrokerName] = useState([]);


    const [Addsubadmin, setAddsubadmin] = useState({
        loading: false,
        data: [],
    });


    const [state1, setstate1] = useState([]);



    const formik = useFormik({
        initialValues: {
            panel_name: "",
            domain: "",
            port: "",
            key: "",
            ip_address: "",
            is_active: 1,
            is_expired: 0,
            theme_id: "",
            db_url: "",
            db_name: "",
            broker_id: [],
            Create_Strategy: false,
            Option_chain: false,
            Strategy_plan: false,
            backend_rul:""

        },

        validate: (values) => {
            const errors = {};


            if (!values.panel_name && formik.touched.panel_name) {
                errors.panel_name = valid_err.PANEL_NAME_ERROR;
            }

            if (!values.domain) {
                errors.domain = valid_err.DOMAIN_ERROR;
            }

            if (!values.port) {
                errors.port = valid_err.PORT_ERROR;
            }

            if (!values.key) {
                errors.key = valid_err.KEY_ERROR;
            }

            if (!values.db_url) {
                errors.db_url = valid_err.DBURL_ERROR;
            }

            if (!values.db_name) {
                errors.db_name = valid_err.DBNAME_ERROR;
            }

            if (!values.backend_rul) {
                errors.backend_rul = valid_err.DBNAME_ERROR;
            }


            return errors;
        },
        onSubmit: async (values) => {

            const req = {
                panel_name: values.panel_name,
                domain: values.domain,
                port: values.port,
                key: values.key,
                ip_address: values.ip_address,
                theme_id: values.theme_id,
                db_url: values.db_url,
                db_name: values.db_name,
                broker_id: state1,
                Create_Strategy: values.Create_Strategy && values.Create_Strategy ? 1 : 0,
                Option_chain: values.Option_chain && values.Option_chain ? 1 : 0,
                Strategy_plan: values.Strategy_plan && values.Strategy_plan ? 1 : 0,
                backend_rul:values.backend_rul
            };

          
            await dispatch(Add_Panel_data({ req: req, token: user_token }))
                .unwrap()
                .then((response) => {
                    if (response.status === 409) {
                        toast.error(response.data.msg);
                    } else if (response.status) {
                        toast.success(response.msg);

                        setTimeout(() => {
                            navigate("/super/alladmins");
                        }, 1000);
                    } else if (!response.status) {
                        toast.error(response.msg);
                    }
                });
        },
    });





    const fields = [
        {
            name: "panel_name",
            label: "Panel Name",
            type: "text",
            label_size: 12,
            col_size: 6,
        },
        {
            name: "domain",
            label: "Domain",
            type: "text",
            label_size: 12,
            col_size: 6,
        },
        {
            name: "port",
            label: "Port",
            type: "text",
            label_size: 12,
            col_size: 6,
        },
        {
            name: "key",
            label: "key",
            type: "text",
            label_size: 12,
            col_size: 6,
        },
        {
            name: "ip_address",
            label: "Ip Address",
            type: "text",
            label_size: 12,
            col_size: 6,
        },

        {
            name: 'theme_id',
            label: 'Theme Id',
            type: 'select',
            options: getAllThemeName && getAllThemeName.map((item) => ({ label: item.theme_name, value: item._id })),
            // showWhen: values => values.licence === '2'
            // , label_size: 12, col_size: 6, disable: false, isSelected: true
        },
        {
            name: "db_url",
            label: "Database Url",
            type: "text",
            label_size: 12,
            col_size: 6,
        },
      
        {
            name: "db_name",
            label: "Database Name",
            type: "text",
            label_size: 12,
            col_size: 6,
        },

        {
            name: "backend_rul",
            label: "Backend Url",
            type: "text",
            label_size: 12,
            col_size: 12,
        },
        {
            name: "Create_Strategy",
            label: "Create Strategy",
            type: "checkbox",
            label_size: 12,
            col_size: 3,
            check_box_true:
                formik.values.Create_Strategy ? true : false,
        },
        {
            name: "Option_chain",
            label: "Option Chain",
            type: "checkbox",
            label_size: 12,
            col_size: 3,
            check_box_true:
                formik.values.Option_chain ? true : false,
        },
        {
            name: "Strategy_plan",
            label: "Strategy Plan",
            type: "checkbox",
            label_size: 12,
            col_size: 3,
            check_box_true:
                formik.values.Strategy_plan ? true : false,
        },

    ];

    const data = async () => {

        await dispatch(Get_All_Theme_Name()).unwrap()
            .then((response) => {
                setAllThemeName(response && response.data);
            })

        await dispatch(All_Brokers()).unwrap()
            .then((response) => {
                setGetAllBrokerName(
                    response.data
                );
            })


    };

    useEffect(() => {
        data();
    }, []);





    const handleSBrokerChange = (event, broker) => {
        const BrokerId = event.target.value;
        if (event.target.checked) {
            setstate1([...state1, { id: broker.broker_id, name: broker.title }]);
        } else {
            // Remove the strategyId from the state array
            setstate1(state1.filter((data) => data.id !== BrokerId));
        }
    };



    useEffect(() => {
        if (state1.length > 1) {
            formik.setFieldValue("broker_id", "");
        }
    }, [state1]);


    return (
        <>
            {Addsubadmin.loading ? (
                <Loader />
            ) : (
                <>
                    <Content
                        Page_title="Add Panel"
                        button_title="Back"
                        route="/super/alladmins"
                    >
                        <Formikform
                            fieldtype={fields.filter((field) => !field.showWhen)}
                            formik={formik}
                            btn_name="Add Panel"
                            additional_field={
                                <>
                                    <h6>All Brokers</h6>
                                    {getGetAllBrokerName.map((broker) => (
                                        <div className={`col-lg-2 mt-2`} key={broker.broker_id}>
                                            <div className="row ">
                                                <div className="col-lg-12 ">
                                                    <div class="form-check custom-checkbox mb-3">
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            name={broker.title}
                                                            value={broker.broker_id}
                                                            onChange={(e) => handleSBrokerChange(e, broker)}

                                                        />
                                                        <label
                                                            className="form-check-label"
                                                            for={broker.title}
                                                        >
                                                            {broker.title}
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {formik.errors.title && (
                                        <div style={{ color: "red" }}>
                                            {formik.errors.title}
                                        </div>
                                    )}
                                </>
                            }
                        />

                        <ToastButton />
                    </Content>
                </>
            )}
        </>
    );
};

export default Add_Panel;
