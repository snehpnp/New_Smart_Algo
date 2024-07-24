import React, { useState, useEffect } from 'react';
import BasicDataTable from '../../../Components/ExtraComponents/Datatable/BasicDataTable';
import Modal from '../../../Components/ExtraComponents/Modal';
import Formikform1 from "../../../Components/ExtraComponents/Form/Formik_form1";
import { useFormik } from 'formik';
import { GET_COMPANY_INFOS, GettAllUSerReferal } from '../../../ReduxStore/Slice/Admin/AdminSlice';
import { useDispatch } from "react-redux";
import { Link } from 'react-router-dom';
import { Update_smtp_details } from '../../../ReduxStore/Slice/Admin/SystemSlice';
import toast from 'react-hot-toast';
import ToastButton from "../../../Components/ExtraComponents/Alert_Toast";
import { fDateTimeSuffix } from "../../../Utils/Date_formet";
import { FaCopy, FaSms, FaEnvelope, FaInstagram, FaTelegram } from 'react-icons/fa';
import StatusButton from './Statusbtn';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { REEDEEM_USER_DATA ,UPDATE_REEDEEM} from '../../../ReduxStore/Slice/Auth/AuthSlice';


const ReferralPage = () => {
    const [iframeUrl, setIframeUrl] = useState("http://localhost:3000/#/newsignup");
    const [showModal, setShowModal] = useState(false);
    const [getCompanyName, setCompanyName] = useState({ loading: true, data: [] });
    const [getReferalUsers, setReferalUsers] = useState({ loading: true, data: [] });
    const [getReferalUsersData, setReferalUsersData] = useState({ loading: true, data: [] });

    const dispatch = useDispatch();
    const user_details = JSON.parse(localStorage.getItem('user_details'));

    const handleCopyUrl = () => {
        navigator.clipboard.writeText(iframeUrl);
        toast.success("URL copied to clipboard!");
    };

    const shareUrl = (platform) => {
        const encodedUrl = encodeURIComponent(iframeUrl);
        const encodedMessage = encodeURIComponent("Join using my referral link: ");
        let url;

        switch (platform) {
            case 'sms':
                url = `sms:?body=${encodedMessage}${encodedUrl}`;
                break;
            case 'email':
                url = `mailto:?subject=Referral&body=${encodedMessage}${encodedUrl}`;
                break;
            case 'instagram':
                url = `https://www.instagram.com/direct/new/?text=${encodedMessage}${encodedUrl}`;
                break;
            case 'telegram':
                url = `https://telegram.me/share/url?url=${encodedUrl}&text=${encodedMessage}`;
                break;
            default:
                return;
        }

        window.open(url, '_blank');
    };

    const columns = [
        {
            dataField: 'index',
            text: 'Company ID',
            formatter: (cell, row, rowIndex) => rowIndex + 1,
        },
        {
            dataField: 'UserName',
            text: 'UserName'
        },
        {
            dataField: 'Email',
            text: 'Email'
        },
        {
            dataField: 'refer_code',
            text: 'Refer Code'
        },
        {
            dataField: 'refer_points',
            text: 'Refer Points'
        },
        {
            dataField: 'createdAt',
            text: 'Created At',
            formatter: (cell, row, rowIndex) => fDateTimeSuffix(cell),
        },
        {
            dataField: 'ActiveStatus',
            text: 'Status',
            formatter: (cell, row, rowIndex) => (
                <StatusButton status={cell} type={1} />
            ),
        },
    ];

    const columns1 = [
        {
            dataField: 'index',
            text: 'Company ID',
            formatter: (cell, row, rowIndex) => rowIndex + 1,
        },
        {
            dataField: 'UserName',
            text: 'UserName'
        },
        {
            dataField: 'reedeem_points',
            text: 'reedeem_points'
        },

        {
            dataField: 'createdAt',
            text: 'Created At',
            formatter: (cell, row, rowIndex) => fDateTimeSuffix(cell),
        },
        {
            dataField: 'ActiveStatus',
            text: 'Status',
            formatter: (cell, row, rowIndex) => (
                <StatusButton status={cell} type={2} />
            ),
        },
        {
            dataField: 'Action',
            text: 'Action',
            formatter: (cell, row, rowIndex) => (
                <>
                    {row.ActiveStatus == 0 ?
                        <>
                            <button
                                onclick="approvePayment(1)"
                                style={{
                                    backgroundColor: "green",
                                    color: "white",
                                    padding: "5px 10px",
                                    border: "none",
                                    cursor: "pointer"
                                }}
                            >
                                Approve
                            </button>
                            <button
                                onclick="rejectPayment(1)"
                                style={{
                                    backgroundColor: "red",
                                    color: "white",
                                    padding: "5px 10px",
                                    border: "none",
                                    cursor: "pointer"
                                }}
                            >
                                Reject
                            </button>
                        </>
                        : null}

                </>
            ),
        },
    ];

    const fields = [
        { name: 'companyname', label: 'Company Name', type: 'text', label_size: 12, col_size: 6, disable: true },
        { name: 'refer_points', label: 'Refer Points', type: 'text', label_size: 12, col_size: 6, disable: false },
    ];

    const formik = useFormik({
        initialValues: {
            companyname: getCompanyName.data.length ? getCompanyName.data[0].panel_name : '',
            refer_points: getCompanyName.data.length ? getCompanyName.data[0].refer_points : '',
        },
        validate: (values) => {
            const errors = {};
            // Add validation logic here if needed
            return errors;
        },
        onSubmit: async (values) => {
            console.log("values", values);
            console.log("getCompanyName.data", getCompanyName.data[0]);

            const req = {
                id: getCompanyName.data[0]._id,
                data: {
                    refer_points: values.refer_points,
                }
            };

            await dispatch(Update_smtp_details({ req, token: user_details.token })).unwrap().then((response) => {
                if (response.status === 409) {
                    toast.error(response.data.msg);
                } else if (response.status) {
                    toast.success(response.msg);
                    setShowModal(false);
                } else if (!response.status) {
                    toast.error(response.msg);
                }
            });
        },
    });

    const CompanyName = async () => {
        await dispatch(GET_COMPANY_INFOS()).unwrap()
            .then((response) => {
                if (response.status) {
                    setCompanyName({
                        loading: false,
                        data: response.data,
                    });
                }
            });
    };

    const AllReferalUser = async () => {
        await dispatch(GettAllUSerReferal({ Find_Role: "ADMIN", username: "sneh" })).unwrap()
            .then((response) => {
                if (response.status) {
                    console.log("response", response);
                    setReferalUsers({
                        loading: false,
                        data: response.data,
                    });
                }
            });
    };

    const GetAllReedeemData = async () => {
        await dispatch(REEDEEM_USER_DATA({ Role: "ADMIN" })).unwrap()
            .then((response) => {
                if (response.status) {
                    console.log("response", response);
                    setReferalUsersData({
                        loading: false,
                        data: response.data,
                    });
                }
            });
    };

    useEffect(() => {
        GetAllReedeemData()
        AllReferalUser();
        CompanyName();
    }, []);

    useEffect(() => {
        if (getCompanyName.data && getCompanyName.data[0]) {
            formik.setFieldValue('companyname', getCompanyName.data.length > 0 && getCompanyName.data[0].panel_name);
            formik.setFieldValue('refer_points', getCompanyName.data.length > 0 && getCompanyName.data[0].refer_points);
        }
    }, [getCompanyName.data]);


    const totalReferrals = getReferalUsers.data && getReferalUsers.data.length;
    const inProcessReferrals = getReferalUsers.data && getReferalUsers.data.filter(user => user.ActiveStatus == 1).length;
    const successfulReferrals = getReferalUsers.data && getReferalUsers.data.filter(user => user.ActiveStatus == 2).length;
    const ReferralsPoints = getReferalUsers.data && getReferalUsers.data
        .filter(user => user.refer_points)
        .reduce((sum, user) => sum + user.refer_points, 0);






    return (
        <div className="content-body">
            <div className="container-fluid">
                <div className="row page-titles">
                    <div className="row mb-3">
                        <div className="col-lg-6"></div>
                    </div>
                    <ol className="breadcrumb">
                        <div className="col-lg-6">
                            <li className="breadcrumb-item">
                                <h4 className="font-w500 mb-0">Referral Program</h4>
                            </li>
                        </div>
                        <div className="col-lg-6">
                            <Link to={""} className='btn btn-primary float-lg-end' style={{ padding: '10px !important' }} onClick={() => setShowModal(true)}>
                                <i className={`fa-solid fa-plus`}></i> Add
                            </Link>
                        </div>
                    </ol>
                </div>

                <div className="row">
                    <div className="col-xl-12">
                        <div className="card form-card">
                            <div className="card-body">
                                <div className="container-fluid">
                                    <div className="row">
                                        <h4 className="">
                                            <b className='font-w500 mb-0'>Referral Earning Dashboard</b>
                                        </h4>
                                        <div className="col-md-12">
                                            <div className="card form-card">
                                                <div className="card-body">
                                                    <div className="container-fluid pt-3">
                                                        <div className="row">
                                                            <div className="col-md-3">
                                                                <div className="rpWrp2">
                                                                    <h3>Referral points <p className='mb-0'>{ReferralsPoints && ReferralsPoints}</p></h3>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-3">
                                                                <div className="rpWrp2">
                                                                    <h3>Total Referrals <p className='mb-0'>{totalReferrals && totalReferrals}</p></h3>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-3 ">
                                                                <div className="rpWrp3">
                                                                    <h3>In-Process Referrals <p className='mb-0'>{inProcessReferrals && inProcessReferrals}</p></h3>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-3 ">
                                                                <div className="rpWrp4">
                                                                    <h3> Successful Referrals <p className='mb-0'>{successfulReferrals && successfulReferrals}</p></h3>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>



                                </div>



                                <Tabs
                                    defaultActiveKey="profile"
                                    id="justify-tab-example"
                                    className="mb-3"
                                    justify
                                >
                                    <Tab eventKey="home" title="Refer Information">

                                        <h2 className="mt-5 mb-3">Refer Information</h2>
                                        <BasicDataTable tableData={getReferalUsers.data} TableColumns={columns} dropdown={false} />

                                    </Tab>
                                    <Tab eventKey="profile" title="Reedeem Request">


                                        <h2 className="mt-5 mb-3">Reedeem Request</h2>
                                        <BasicDataTable tableData={getReferalUsersData.data} TableColumns={columns1} dropdown={false} />
                                    </Tab>

                                </Tabs>


                                <div className="iframe-container mb-3 d-flex align-items-center">
                                    <input
                                        type="text"
                                        id="urlInput"
                                        className="form-control"
                                        value={iframeUrl}
                                        readOnly
                                    />
                                    <FaCopy size={32} onClick={handleCopyUrl} style={{ cursor: 'pointer', marginLeft: '10px' }} />
                                    <FaSms size={32} onClick={() => shareUrl('sms')} style={{ cursor: 'pointer', marginLeft: '10px' }} />
                                    <FaEnvelope size={32} onClick={() => shareUrl('email')} style={{ cursor: 'pointer', marginLeft: '10px' }} />
                                    <FaInstagram size={32} onClick={() => shareUrl('instagram')} style={{ cursor: 'pointer', marginLeft: '10px' }} />
                                    <FaTelegram size={32} onClick={() => shareUrl('telegram')} style={{ cursor: 'pointer', marginLeft: '10px' }} />
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal isOpen={showModal} size="lg" title="Set Refer Point" hideBtn={true} handleClose={() => setShowModal(false)}>
                <Formikform1 fieldtype={fields.filter(field => !field.showWhen || field.showWhen(formik.values))} formik={formik} btn_name="Update" />
            </Modal>

            <ToastButton />
        </div>
    );
};

export default ReferralPage;
