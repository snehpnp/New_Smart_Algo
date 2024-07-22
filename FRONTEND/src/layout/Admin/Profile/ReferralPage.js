import React, { useState, useEffect } from 'react';
import BasicDataTable from '../../../Components/ExtraComponents/Datatable/BasicDataTable';
import Imag from './Refer.png';
import Modal from '../../../Components/ExtraComponents/Modal';
import Formikform1 from "../../../Components/ExtraComponents/Form/Formik_form1";
import { useFormik } from 'formik';
import { GET_COMPANY_INFOS } from '../../../ReduxStore/Slice/Admin/AdminSlice';
import { useDispatch } from "react-redux";
import { Link } from 'react-router-dom';
import { Update_smtp_details } from '../../../ReduxStore/Slice/Admin/SystemSlice';
import toast from 'react-hot-toast';
import ToastButton from "../../../Components/ExtraComponents/Alert_Toast";
import {
    FacebookShareButton,
    WhatsappShareButton,
    TelegramShareButton,
    FacebookIcon,
    WhatsappIcon,
    TelegramIcon,
    EmailShareButton,
    EmailIcon
} from 'react-share';
import { FaCopy, FaSms, FaInstagram } from 'react-icons/fa';


const ReferralPage = () => {
    const [iframeUrl, setIframeUrl] = useState("http://localhost:3000/#/newsignup");
    const [showModal, setShowModal] = useState(false);
    const [getCompanyName, setCompanyName] = useState({ loading: true, data: [] });
    const dispatch = useDispatch();
    const user_token = JSON.parse(localStorage.getItem('user_details')).token;

    const handleUrlChange = (event) => {
        setIframeUrl(event.target.value);
    };

    const columns = [
        {
            dataField: 'index',
            text: 'Company ID',
            formatter: (cell, row, rowIndex) => rowIndex + 1,
        },
        {
            dataField: 'panel_name',
            text: 'Name'
        },
        {
            dataField: 'panel_short_name',
            text: 'Company Short Name'
        },
        {
            dataField: 'prefix',
            text: 'Version'
        },
        {
            dataField: 'Action',
            text: 'Action',
            formatter: (cell, row) => (
                <div>
                    <span data-toggle="tooltip" data-placement="top" title="Edit">
                        {/* Add edit functionality here */}
                    </span>
                </div>
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
            console.log("values", values)
            console.log("getCompanyName.data", getCompanyName.data[0])

            const req = {
                "id": getCompanyName.data[0]._id,
                data: {
                    "refer_points": values.refer_points,
                }
            }


            await dispatch(Update_smtp_details({ req: req, token: user_token })).unwrap().then((response) => {
                if (response.status === 409) {
                    toast.error(response.data.msg);
                }
                else if (response.status) {
                    toast.success(response.msg);
                    setShowModal(false)

                }
                else if (!response.status) {
                    toast.error(response.msg);
                }
            })
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

    useEffect(() => {
        CompanyName();
    }, []);


    useEffect(() => {
        if (getCompanyName.data && getCompanyName.data[0]) {

            formik.setFieldValue('companyname', getCompanyName.data.length > 0 && getCompanyName.data[0].panel_name);
            formik.setFieldValue('refer_points', getCompanyName.data.length > 0 && getCompanyName.data[0].refer_points);
        }


    }, [getCompanyName.data]);

    const companyReferPoints = getCompanyName.data.length > 0 ? getCompanyName.data[0].refer_points : 0;

    const handleCopyUrl = () => {
        navigator.clipboard.writeText(iframeUrl);
        // alert("URL copied to clipboard!");
    };

    const handleSmsShare = () => {
        window.location.href = `sms:?body=Join us and earn rewards! ${iframeUrl}`;
    };

    const handleEmailShare = () => {
        window.location.href = `mailto:?subject=Join us and earn rewards!&body=Sign up using this link: ${iframeUrl}`;
    };

    const handleInstagramShare = () => {
        alert("Instagram sharing is not supported directly. Please copy the URL and share it on Instagram.");
    };

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

                                    {/* <div className="row">
                                        <div className="col-md-6">
                                            <img src={Imag} alt="Referral" className="img-fluid" />
                                        </div>
                                        <div className="col-md-6">

                                            <div className="card form-card">
                                                <div className="card-body">
                                                    <div className="container">
                                                        <div className="topheadLine mb-3">
                                                            <h2>Refer a Friend</h2>
                                                            <h3>&amp; share more than good times</h3>
                                                        </div>
                                                        <div className="benefit">
                                                            <div className="eran mb-2">
                                                                <span>Earn <b>{companyReferPoints} Points</b> For every referral</span>
                                                            </div>
                                                        </div>

                                                        <div className="iframe-container mb-3 d-flex align-items-center">
                                                            <input
                                                                type="text"
                                                                id="urlInput"
                                                                className="form-control"
                                                                value={iframeUrl}
                                                                onChange={handleUrlChange}
                                                                placeholder="Enter the URL here"
                                                                readOnly
                                                            />
                                                            <FaCopy size={32} onClick={handleCopyUrl} style={{ cursor: 'pointer', marginLeft: '10px' }} />
                                                        </div>

                                                        <div className="share-buttons">
                                                            <h5>Share your referral link:</h5>
                                                            <FacebookShareButton url={iframeUrl} quote="Join us and earn rewards!">
                                                                <FacebookIcon size={32} round />
                                                            </FacebookShareButton>
                                                            <WhatsappShareButton url={iframeUrl} title="Join us and earn rewards!">
                                                                <WhatsappIcon size={32} round />
                                                            </WhatsappShareButton>
                                                            <TelegramShareButton url={iframeUrl} title="Join us and earn rewards!">
                                                                <TelegramIcon size={32} round />
                                                            </TelegramShareButton>
                                                            <EmailShareButton url={iframeUrl} subject="Join us and earn rewards!" body={`Sign up using this link: ${iframeUrl}`}>
                                                                <EmailIcon size={32} round />
                                                            </EmailShareButton>


                                                            <FaSms size={32} onClick={handleSmsShare} />


                                                            <FaInstagram size={32} onClick={handleInstagramShare} />

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>


                                        </div>
                                    </div> */}

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
                                                                    <h3>Referral points <p className='mb-0'>100</p></h3>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-3">
                                                                <div className="rpWrp2">
                                                                    <h3>Total Referrals <p className='mb-0'>7</p></h3>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-3 ">
                                                                <div className="rpWrp3">
                                                                    <h3>In-Process Referrals <p className='mb-0'>7</p></h3>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-3 ">
                                                                <div className="rpWrp4">
                                                                    <h3> Successful Referrals <p className='mb-0'>7</p></h3>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>



                                    <h2 className="mt-5 mb-3">Refer Information</h2>
                                    <BasicDataTable tableData={[]} TableColumns={columns} dropdown={false} />
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
