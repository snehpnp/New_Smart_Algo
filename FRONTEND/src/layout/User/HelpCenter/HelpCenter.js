import React, { useEffect, useState } from 'react';
import Content from "../../../Components/Dashboard/Content/Content";
import Formikform1 from "../../../Components/ExtraComponents/Form/Formik_form1";
import { useFormik } from 'formik';
import * as valid_err from "../../../Utils/Common_Messages";
import { useNavigate,useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { User_Profile,GET_MESSAGE_BRODS } from "../../../ReduxStore/Slice/Common/commoSlice.js";
import { Create_Help} from "../../../ReduxStore/Slice/Users/ClientHelpSlice";
import toast, { Toaster } from 'react-hot-toast';
import { Tab, Tabs } from 'react-bootstrap'; 
import { Get_USER_HELP } from '../../../ReduxStore/Slice/Users/DashboardSlice.js'; 
import { fDateTimeSuffix } from '../../../Utils/Date_formet.js';

const ApiCreateInfo = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const user_details = JSON.parse(localStorage.getItem("user_details"));
    const gotodashboard = JSON.parse(localStorage.getItem('user_details_goTo'));
    const isgotodashboard = JSON.parse(localStorage.getItem('gotodashboard'));
    const [refresh, setRefresh] = useState(false);
    const [UserDetails, setUserDetails] = useState({ loading: true, data: [] });
    const [helpData, setHelpData] = useState([]); // State for help requests
    const [broadcastData, setBroadcastData] = useState([]); // State for admin broadcasts
    const [activeTab, setActiveTab] = useState("form"); // State for the active tab



    useEffect(() => {
        if(location.state?.status == 2){
            setActiveTab("broadcast");
        }
    }, [location.state?.status]);


    const formik = useFormik({
        initialValues: {
            username: null,
            fullName: null,
            mobile: null,
            email: null,
            msg: null,
            admin_id: null,
        },
        validate: (values) => {
            const errors = {};
            if (!values.msg) {
                errors.msg = valid_err.EMPTY_MSG_ERROR;
            }
            return errors;
        },
        onSubmit: async (values) => {
            const req = {
                username: values.fullName,
                fullname: values.username,
                email: values.email,
                mobile: values.mobile,
                helpmsg: values.msg,
                admin_id: values.admin_id,
                user_id: user_details.user_id,
            };

            await dispatch(Create_Help({ req: req, token: user_details.token }))
                .unwrap()
                .then((response) => {
                    if (response.status === 409) {
                        toast.error(response.data.msg);
                    } else if (response.status) {
                        setRefresh(!refresh);
                        toast.success(response.msg);
                        setTimeout(() => {
                            navigate("/client/helpcenter");
                        }, 1000);
                    } else if (!response.status) {
                        toast.error(response.msg);
                    }
                });
        },
    });

    const fields = [
        { name: 'username', label: 'Username', type: 'text', label_size: 12, col_size: 3, disable: true },
        { name: 'fullName', label: 'FullName', type: 'text', label_size: 12, col_size: 3, disable: true },
        { name: 'mobile', label: 'Mobile', type: 'text', label_size: 12, col_size: 3, disable: true },
        { name: 'email', label: 'Email', type: 'text', label_size: 12, col_size: 3, disable: true },
        { name: 'msg', label: 'Your Message', type: 'msgbox', label_size: 12, col_size: 12, row_size: '4' },
    ];

    const data = async () => {
        const userId = isgotodashboard ? gotodashboard.user_id : user_details.user_id;
        const token = isgotodashboard ? gotodashboard.token : user_details.token;


if(activeTab == "form") {
        await dispatch(User_Profile({ id: userId, token: token }))
            .unwrap()
            .then((response) => {
                if (response.status) {
                    setUserDetails({
                        loading: false,
                        data: response.data,
                    });
                }
            });
        }else if(activeTab == "history") {

        await dispatch(Get_USER_HELP({ user_id: userId, token: token }))
            .unwrap()
            .then((response) => {
                if (response.status) {
                    setHelpData(response.data);
                }
            });
        }else if(activeTab == "broadcast") {

        await dispatch(GET_MESSAGE_BRODS({ id:userId  ,token: token }))
            .unwrap()
            .then((response) => {
             
                if (response.status) {
                    setBroadcastData(response.data);
                }
            });

}
    };

    useEffect(() => {
        data();
    }, [refresh,activeTab]);

    useEffect(() => {
        formik.setFieldValue('username', UserDetails.data.UserName);
        formik.setFieldValue('fullName', UserDetails.data.FullName);
        formik.setFieldValue('mobile', UserDetails.data.PhoneNo);
        formik.setFieldValue('email', UserDetails.data.Email);
        formik.setFieldValue('admin_id', UserDetails.data.parent_id);
    }, [UserDetails]);

    const handleTabChange = (key) => {
        setActiveTab(key);
        // toast.success(`Tab changed to: ${key}`);
    };


    return (
        <>
            <Content Page_title="Help Center" button_status={false}>
                <Tabs activeKey={activeTab} onSelect={handleTabChange} id="help-center-tabs">
                    <Tab eventKey="form" title="Submit Help Request">
                        <Formikform1
                            fieldtype={fields.filter(field => !field.showWhen || field.showWhen(formik.values))}
                            formik={formik}
                            btn_name="Send"
                            hidebtn={isgotodashboard}
                        />
                    </Tab>
                    <Tab eventKey="history" title="Help Request History">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Message</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {helpData.map((help, index) => (
                                    <tr key={help._id}>
                                        <td>{index + 1}</td>
                                        <td>{help.help_msg}</td>
                                        <td>{help.createdAt ? fDateTimeSuffix(help.createdAt) : "-"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Tab>
                    <Tab eventKey="broadcast" title="Admin Broadcast">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Message</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {broadcastData.map((broadcast, index) => (
                                    <tr key={broadcast._id}>
                                        <td>{index + 1}</td>
                                        <td>{broadcast.Message}</td>
                                        <td>{broadcast.createdAt ? fDateTimeSuffix(broadcast.createdAt) : "-"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Tab>
                </Tabs>
            </Content>
            <Toaster />
        </>
    );
};

export default ApiCreateInfo;
