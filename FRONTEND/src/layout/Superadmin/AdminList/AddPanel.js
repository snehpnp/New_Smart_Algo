import React, { useEffect, useState } from "react";
import Loader from "../../../Utils/Loader";
import { useNavigate } from "react-router-dom";
import Content from "../../../Components/Dashboard/Content/Content";
import Formikform from "../../../Components/ExtraComponents/Form/Formik_form1";
import * as valid_err from "../../../Utils/Common_Messages";
import { useFormik } from "formik";
import { Add_Panel_data } from "../../../ReduxStore/Slice/Superadmin/SuperAdminSlice";
import { useDispatch, useSelector } from "react-redux";
import { Get_All_Theme_Name } from '../../../ReduxStore/Slice/ThemeSlice';
import { All_Brokers } from '../../../ReduxStore/Slice/Superadmin/SuperAdminSlice';
import ToastButton from "../../../Components/ExtraComponents/Alert_Toast";
import toast, { Toaster } from "react-hot-toast";

const Add_Panel = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user_token = JSON.parse(localStorage.getItem("user_details")).token;
    const Role = JSON.parse(localStorage.getItem("user_details")).Role;
    const user_id = JSON.parse(localStorage.getItem("user_details")).user_id;
    const UserName = JSON.parse(localStorage.getItem("user_details")).UserName;
    const [getAllThemeName, setAllThemeName] = useState([]);
    const [getGetAllBrokerName, setGetAllBrokerName] = useState([]);
    const [Addsubadmin, setAddsubadmin] = useState({ loading: false, data: [] });
    const [state1, setstate1] = useState([]);

    useEffect(() => {
        data();
    }, []);

    useEffect(() => {
        if (state1.length > 1) {
            formik.setFieldValue("broker_id", "");
        }
    }, [state1]);




    const formik = useFormik({
        initialValues: {
            panel_name: "",
            domain: "",
            port: "7700",
            key: "",
            ip_address: "",
            is_active: 1,
            is_expired: 0,
            theme_id: "",
            db_url: "",
            db_name: "test",
            broker_id: [],
            Create_Strategy: false,
            Option_chain: false,
            Strategy_plan: false,
            backend_rul: ""
        },
        validate: (values) => {
            const errors = {};
    
            // Check if panel_name is empty
            if (!values.panel_name) {
                errors.panel_name = valid_err.PANEL_NAME_ERROR;
            }
    
            // Check if domain is empty
            if (!values.domain) {
                errors.domain = valid_err.DOMAIN_ERROR;
            }
    
            // Check if port is empty
            if (!values.port) {
                errors.port = "Port is required";
            }
    
            // Check if key is empty
            if (!values.key) {
                errors.key = valid_err.KEY_ERROR;
            }
    
            // Check if ip_address is empty
            if (!values.ip_address) {
                errors.ip_address = "IP Address is required";
            }
    
            // Check if theme_id is empty
            if (!values.theme_id) {
                errors.theme_id = "Please select a theme";
            }
    
            // Check if db_url is empty
            if (!values.db_url) {
                errors.db_url = valid_err.DBURL_ERROR;
            }
    
            // Check if db_name is empty
            if (!values.db_name) {
                errors.db_name = "Database name is required";
            }
    
            return errors;
        },
        onSubmit: async (values) => {
            const trimmedValues = {
                panel_name: values.panel_name.trim(),
                domain: values.domain.trim(),
                port: values.port.trim(),
                key: values.key.trim(),
                ip_address: values.ip_address.trim(),
                theme_id: values.theme_id.trim(),
                db_url: values.db_url.trim(),
                db_name: values.db_name.trim(),
                broker_id: state1,
                Create_Strategy: values.Create_Strategy ? 1 : 0,
                Option_chain: values.Option_chain ? 1 : 0,
                Strategy_plan: values.Strategy_plan ? 1 : 0,
                backend_rul: values.domain.trim() + '/backend/',
                UserName: UserName.trim()
            };
    
            await dispatch(Add_Panel_data({ req: trimmedValues, token: user_token }))
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
            type: "placeholder",
            label_size: 12,
            col_size: 6,
            placeholderdata: "Pandpinfotech"
        },
        {
            name: "domain",
            label: "Domain",
            type: "placeholder",
            label_size: 12,
            col_size: 6,
            placeholderdata: "https://newpenal.pandpinfotech.com"
        },
        {
            name: "key",
            label: "Key",
            type: "placeholder",
            label_size: 12,
            col_size: 6,
            placeholderdata: "SNE132023"
        },
        {
            name: "ip_address",
            label: "Ip Address",
            type: "placeholder",
            label_size: 12,
            col_size: 6,
            placeholderdata: "193.239.237.136"
        },
        {
            name: 'theme_id',
            label: 'Theme Id',
            type: 'select',
            options: getAllThemeName && getAllThemeName.map((item) => ({ label: item.theme_name, value: item._id })),
            label_size: 12,
        },
        {
            name: "db_url",
            label: "Database Url",
            type: "placeholder",
            label_size: 12,
            col_size: 6,
            placeholderdata: "mongodb://pnpinfotech:p%26k56%267GsRy%26vnd%26@193.239.237.136:27017/"
        },
        {
            name: "Create_Strategy",
            label: "Create Strategy",
            type: "checkbox",
            label_size: 12,
            col_size: 3,
            check_box_true: formik.values.Create_Strategy ? true : false,
        },
        {
            name: "Option_chain",
            label: "Option Chain",
            type: "checkbox",
            label_size: 12,
            col_size: 3,
            check_box_true: formik.values.Option_chain ? true : false,
        },
        {
            name: "Strategy_plan",
            label: "Strategy Plan",
            type: "checkbox",
            label_size: 12,
            col_size: 3,
            check_box_true: formik.values.Strategy_plan ? true : false,
        },
    ];

    const data = async () => {
        await dispatch(Get_All_Theme_Name()).unwrap()
            .then((response) => {
                setAllThemeName(response && response.data);
            });

        await dispatch(All_Brokers()).unwrap()
            .then((response) => {
                setGetAllBrokerName(response.data);
            });
    };



    const handleSBrokerChange = (event, broker) => {
        const BrokerId = event.target.value;
        if (event.target.checked) {
            setstate1([...state1, { id: broker.broker_id, name: broker.title }]);
        } else {
            setstate1(state1.filter((data) => data.id !== BrokerId));
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {

            const allBrokers = getGetAllBrokerName.map(broker => ({
                id: broker.broker_id,
                name: broker.title
            }));
            setstate1(allBrokers);
        } else {
            setstate1([]);
        }
    };



  

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

                                    <div className={`col-lg-2 mt-2`} >
                                        <div className="row ">
                                            <div className="col-lg-12 ">
                                                <div className="form-check custom-checkbox mb-3">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        name={"Select All"}
                                                        onClick={(e) => handleSelectAll(e)}
                                                    />
                                                    <label
                                                        className="form-check-label"
                                                        htmlFor="Select All"
                                                    >
                                                        Select All
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {getGetAllBrokerName.map((broker) => (
                                        <div className={`col-lg-2 mt-2`} key={broker.broker_id}>
                                            <div className="row ">
                                                <div className="col-lg-12 ">
                                                    <div className="form-check custom-checkbox mb-3">
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            name={broker.title}
                                                            value={broker.broker_id}
                                                            checked={state1.some(item => item.id === broker.broker_id)}
                                                            onChange={(e) => handleSBrokerChange(e, broker)}
                                                        />
                                                        <label
                                                            className="form-check-label"
                                                            htmlFor={broker.title}
                                                        >
                                                            {broker.title}
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
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
