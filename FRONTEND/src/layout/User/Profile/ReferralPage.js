import React, { useState, useEffect } from 'react';
import BasicDataTable from '../../../Components/ExtraComponents/Datatable/BasicDataTable';
import Imag from './Refer.png';
import { GET_COMPANY_INFOS, GettAllUSerReferal } from '../../../ReduxStore/Slice/Admin/AdminSlice';
import { REEDEEM_POINTS_USER } from '../../../ReduxStore/Slice/Auth/AuthSlice';
import { useDispatch } from "react-redux";
import ToastButton from "../../../Components/ExtraComponents/Alert_Toast";
import { FacebookShareButton, WhatsappShareButton, TelegramShareButton, FacebookIcon, WhatsappIcon, TelegramIcon, EmailShareButton, EmailIcon } from 'react-share';
import { FaCopy, FaCheck, FaSms, FaInstagram } from 'react-icons/fa';
import * as Config from "../../../Utils/Config";
import { fDateTimeSuffix } from "../../../Utils/Date_formet";
import StatusButton from './Statusbtn';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { REEDEEM_USER_DATA } from '../../../ReduxStore/Slice/Auth/AuthSlice';
import Swal from 'sweetalert2'

const ReferralPage = () => {
    const dispatch = useDispatch();
    const user_details = JSON.parse(localStorage.getItem('user_details'));
    const gotodashboard = JSON.parse(localStorage.getItem("gotodashboard"));
    const GoToDahboard_id = JSON.parse(localStorage.getItem("user_details_goTo"));

    const [iframeUrl, setIframeUrl] = useState(Config.react_domain + "/#/newsignup");
    const [getCompanyName, setCompanyName] = useState({ loading: true, data: [] });
    const [getReferalUsers, setReferalUsers] = useState({ loading: true, data: [], data1: 0 });
    const [copied, setCopied] = useState(false);
    const [getReferalUsersData, setReferalUsersData] = useState({ loading: true, data: [] });




    const handleCopyUrl = () => {
        navigator.clipboard.writeText(iframeUrl).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset the state after 2 seconds
        });
    };

    const handleSmsShare = () => {
        window.location.href = `sms:?body=Join us and earn rewards! ${iframeUrl}`;
    };

    const handleInstagramShare = () => {
        alert("Instagram sharing is not supported directly. Please copy the URL and share it on Instagram.");
    };

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
        await dispatch(GettAllUSerReferal({ Find_Role: "USER", username: gotodashboard ? GoToDahboard_id.UserName : user_details.UserName })).unwrap()
            .then((response) => {
                if (response.status) {
                    setReferalUsers({
                        loading: false,
                        data: response.data,
                        data1: response.data1,

                    });
                }
            });
    };

    const GetAllReedeemData = async () => {
        await dispatch(REEDEEM_USER_DATA({ Role: "USER" , user_id: gotodashboard ? GoToDahboard_id.user_id : user_details.user_id })).unwrap()
            .then((response) => {
                if (response.status) {
                    setReferalUsersData({
                        loading: false,
                        data: response.data,
                    });
                }
            });
    };

    useEffect(() => {
        GetAllReedeemData()
        CompanyName();
        AllReferalUser();
        if (Config.base_url) {
            const redirectUrl = `${Config.base_url.split('backend')[0]}#/newsignup/${user_details.UserName}`;
            setIframeUrl(redirectUrl);
        }
    }, []);


    const companyReferPoints = getCompanyName.data.length > 0 ? getCompanyName.data[0].refer_points : 0;
    const totalReferrals = getReferalUsers.data && getReferalUsers.data.length;
    const inProcessReferrals = getReferalUsers.data && getReferalUsers.data.filter(user => user.ActiveStatus === 1).length;
    const successfulReferrals = getReferalUsers.data && getReferalUsers.data.filter(user => user.ActiveStatus === 2).length;
    const ReferralsPoints = getReferalUsers.data && getReferalUsers.data1


    const columns = [
        { dataField: 'index', text: 'Company ID', formatter: (cell, row, rowIndex) => rowIndex + 1 },
        { dataField: 'UserName', text: 'UserName' },
        { dataField: 'Email', text: 'Email' },
        { dataField: 'refer_code', text: 'Refer Code' },
        { dataField: 'refer_points', text: 'Refer Points' },
        { dataField: 'createdAt', text: 'Created At', formatter: (cell) => fDateTimeSuffix(cell) },
        { dataField: 'ActiveStatus', text: 'Status', formatter: (cell) => <StatusButton status={cell} type={1} /> },
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

    ];

    const handleRedeemPoints = async () => {
        const req = {
            user_id: user_details.user_id,
            reedeem_points: ReferralsPoints && ReferralsPoints
        }

        await dispatch(REEDEEM_POINTS_USER(req)).unwrap()
            .then((response) => {
                if (response.status) {


                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "Your work has been saved",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    window.location.reload();
                }
            })
            .catch((error) => {
                // Handle error case
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: "Error redeeming points",
                    showConfirmButton: false,
                    timer: 1500
                });
             
            });
    };

    return (
        <div className="content-body">
            <div className="container-fluid">

                <div className="row">
                    <div className="col-xl-12">
                        <div className="card form-card">
                            <div className="card-body">
                                <div className="container-fluid">
                                    <div className="row">
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
                                                                // onChange={handleUrlChange}
                                                                placeholder="Enter the URL here"
                                                                readOnly
                                                            />
                                                            {copied ? (
                                                                <FaCheck size={32} style={{ color: 'green', marginLeft: '10px' }} />
                                                            ) : (
                                                                <FaCopy size={32} onClick={handleCopyUrl} style={{ cursor: 'pointer', marginLeft: '10px' }} />
                                                            )}
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
                                    </div>
                                    <div className="row mt-5">
                                        <h4 className=""><b className='font-w500 mb-0'>Referral Earning Dashboard</b></h4>
                                        <div className="col-md-12">
                                            <div className="card form-card">
                                                <div className="card-body">
                                                    <div className="container-fluid pt-3">
                                                        <div className="row">
                                                            <div className="col-md-3">
                                                                <div className="rpWrp2">
                                                                    <h3>Referral points <p className='mb-0'>{ReferralsPoints}</p></h3>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-2">
                                                                <div className="rpWrp2">
                                                                    <h3>Total Referrals <p className='mb-0'>{totalReferrals}</p></h3>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-2">
                                                                <div className="rpWrp3">
                                                                    <h3>In-Process  <p className='mb-0'>{inProcessReferrals}</p></h3>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-2">
                                                                <div className="rpWrp4">
                                                                    <h3>Successful <p className='mb-0'>{successfulReferrals}</p></h3>
                                                                </div>
                                                            </div>

                                                            <div className="col-md-3">
                                                                <div className="rpWrp4">
                                                                    <h3>Redeem points</h3>
                                                                    <p className='mb-0'>

                                                                        {ReferralsPoints && ReferralsPoints ? <button className="btn btn-primary" onClick={handleRedeemPoints}>
                                                                            Redeem Points
                                                                        </button> : ""}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <Tabs
                                        defaultActiveKey="home"
                                        id="justify-tab-example"
                                        className="mb-3"
                                        justify
                                    >
                                        <Tab eventKey="home" title="Refer Information">
                                            <h2 className="mt-5 mb-3 nav1">Refer Information</h2>
                                            <BasicDataTable tableData={getReferalUsers.data} TableColumns={columns} dropdown={false} />
                                        </Tab>
                                        <Tab eventKey="profile" title="Reedeem Request">
                                            <h2 className="mt-5 mb-3 nav1">Reedeem Request</h2>
                                            <BasicDataTable tableData={getReferalUsersData.data} TableColumns={columns1} dropdown={false} />
                                        </Tab>
                                    </Tabs>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastButton />
        </div >
    );
};

export default ReferralPage;
