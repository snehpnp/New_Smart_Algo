import React, { useState, useEffect } from 'react';
import BasicDataTable from '../../../Components/ExtraComponents/Datatable/BasicDataTable';
import Imag from './Refer.png';
import { GET_COMPANY_INFOS, GettAllUSerReferal } from '../../../ReduxStore/Slice/Admin/AdminSlice';
import { useDispatch } from "react-redux";
import ToastButton from "../../../Components/ExtraComponents/Alert_Toast";
import { FacebookShareButton, WhatsappShareButton, TelegramShareButton, FacebookIcon, WhatsappIcon, TelegramIcon, EmailShareButton, EmailIcon } from 'react-share';
import { FaCopy, FaCheck, FaSms, FaInstagram } from 'react-icons/fa';
import * as Config from "../../../Utils/Config";
import { fDateTimeSuffix } from "../../../Utils/Date_formet";
import StatusButton from './Statusbtn';

const ReferralPage = () => {
    const dispatch = useDispatch();
    const user_token = JSON.parse(localStorage.getItem('user_details')).token;
    const user_details = JSON.parse(localStorage.getItem('user_details'));
    const [iframeUrl, setIframeUrl] = useState("http://localhost:3000/#/newsignup");
    const [getCompanyName, setCompanyName] = useState({ loading: true, data: [] });
    const [getReferalUsers, setReferalUsers] = useState({ loading: true, data: [] });
    const [copied, setCopied] = useState(false);

    const handleUrlChange = (event) => {
        setIframeUrl(event.target.value);
    };

    const handleCopyUrl = () => {
        navigator.clipboard.writeText(iframeUrl).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset the state after 2 seconds
        });
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
        await dispatch(GettAllUSerReferal({ Find_Role: "USER", username: user_details.UserName })).unwrap()
            .then((response) => {
                if (response.status) {
                    setReferalUsers({
                        loading: false,
                        data: response.data,
                    });
                }
            });
    };

    useEffect(() => {
        CompanyName();
        AllReferalUser();
        if (Config.base_url) {
            const redirectUrl = `${Config.base_url.split('backend')[0]}newsignup/${user_details.UserName}`;
            setIframeUrl(redirectUrl);
        }
    }, []);

    const companyReferPoints = getCompanyName.data.length > 0 ? getCompanyName.data[0].refer_points : 0;

    const totalReferrals = getReferalUsers.data && getReferalUsers.data.length;
    const inProcessReferrals = getReferalUsers.data && getReferalUsers.data.filter(user => user.ActiveStatus === 1).length;
    const successfulReferrals = getReferalUsers.data && getReferalUsers.data.filter(user => user.ActiveStatus === 2).length;
    const ReferralsPoints = getReferalUsers.data && getReferalUsers.data
        .filter(user => user.refer_points)
        .reduce((sum, user) => sum + user.refer_points, 0);

    const columns = [
        { dataField: 'index', text: 'Company ID', formatter: (cell, row, rowIndex) => rowIndex + 1 },
        { dataField: 'UserName', text: 'UserName' },
        { dataField: 'Email', text: 'Email' },
        { dataField: 'refer_code', text: 'Refer Code' },
        { dataField: 'refer_points', text: 'Refer Points' },
        { dataField: 'createdAt', text: 'Created At', formatter: (cell) => fDateTimeSuffix(cell) },
        { dataField: 'ActiveStatus', text: 'Status', formatter: (cell) => <StatusButton status={cell} /> },
    ];

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
                    </ol>
                </div>
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
                                                                onChange={handleUrlChange}
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
                                                            <div className="col-md-3">
                                                                <div className="rpWrp2">
                                                                    <h3>Total Referrals <p className='mb-0'>{totalReferrals}</p></h3>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-3">
                                                                <div className="rpWrp3">
                                                                    <h3>In-Process Referrals <p className='mb-0'>{inProcessReferrals}</p></h3>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-3">
                                                                <div className="rpWrp4">
                                                                    <h3>Successful Referrals <p className='mb-0'>{successfulReferrals}</p></h3>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <h2 className="mt-5 mb-3">Refer Information</h2>
                                    <BasicDataTable tableData={getReferalUsers.data} TableColumns={columns} dropdown={false} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastButton />
        </div>
    );
};

export default ReferralPage;
