/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/role-supports-aria-props */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useRef } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { admin_sidebar, supper_admin_sidebar, sub_admin_sidebar, Client } from './Nav_Config'
import { Signal, Users, Wrench, Frame, CandlestickChart, Activity, WalletCards, HelpingHand, FolderClock, LayoutDashboard, Building2, Copyright, Repeat2, ArrowRightLeft, ScatterChart, Rocket } from 'lucide-react';
import Test from "../../../test"
import html2canvas from 'html2canvas';



const Sidebar = ({ ShowSidebar }) => {

    const location = useLocation()


    const roles = JSON.parse(localStorage.getItem('user_role'))


    return (
        <div>

            <div className="deznav" >
                <div className="deznav-scroll">
                    <div className=" dropdown header-bx">

                        <a
                            className="nav-link header-profile2 position-relative"
                            role="button"
                            data-bs-toggle="dropdown"
                        >
                            <div className="header-img position-relative">
                                <img src="../assets/images/header-img/pic-1.jpg" alt="header-img" />
                                <svg
                                    className="header-circle"
                                    width={130}
                                    height={130}
                                    viewBox="0 0 130 130"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M130 65C130 100.899 100.899 130 65 130C29.1015 130 0 100.899 0 65C0 29.1015 29.1015 0 65 0C100.899 0 130 29.1015 130 65ZM4.99306 65C4.99306 98.1409 31.8591 125.007 65 125.007C98.1409 125.007 125.007 98.1409 125.007 65C125.007 31.8591 98.1409 4.99306 65 4.99306C31.8591 4.99306 4.99306 31.8591 4.99306 65Z"
                                        fill="#FFD482"
                                    />
                                    <path
                                        d="M65 2.49653C65 1.11774 66.1182 -0.00500592 67.496 0.0479365C76.3746 0.389105 85.0984 2.54751 93.1247 6.39966C101.902 10.6123 109.621 16.7428 115.711 24.3385C121.802 31.9341 126.108 40.8009 128.312 50.284C130.516 59.7671 130.562 69.6242 128.446 79.1274C126.33 88.6305 122.106 97.5369 116.087 105.189C110.067 112.841 102.406 119.043 93.6677 123.337C84.9299 127.631 75.3391 129.907 65.6037 129.997C56.7012 130.08 47.8858 128.333 39.7012 124.875C38.4312 124.338 37.895 122.847 38.48 121.598C39.065 120.35 40.5495 119.817 41.8213 120.35C49.3273 123.493 57.4027 125.08 65.5573 125.004C74.5449 124.921 83.399 122.819 91.4656 118.855C99.5322 114.891 106.605 109.166 112.162 102.102C117.72 95.0375 121.619 86.8153 123.572 78.0421C125.526 69.269 125.484 60.1691 123.449 51.4145C121.414 42.6598 117.438 34.4741 111.816 27.4619C106.193 20.4497 99.0674 14.7901 90.9643 10.9011C83.6123 7.3726 75.6263 5.38343 67.4958 5.04499C66.1182 4.98764 65 3.87533 65 2.49653Z"
                                        fill="var(--primary)"
                                    />
                                </svg>
                                <div className="header-edit position-absolute ">
                                    <svg
                                        width={20}
                                        height={20}
                                        viewBox="0 0 20 20"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M3.02526 12.5567L7.44727 16.9762L16.2481 8.17043L11.8261 3.75092L3.02526 12.5567Z"
                                            fill="#fff"
                                        />
                                        <path
                                            d="M19.6341 3.01762L16.9827 0.366211C16.7401 0.123594 16.4227 0.00160156 16.1051 0H16.0919C15.7743 0.00160156 15.4573 0.123594 15.2153 0.366211L13.4453 2.13383L17.8665 6.55262L19.6342 4.785C19.8768 4.54238 19.9988 4.22539 20.0004 3.90781V3.89461C19.9987 3.57719 19.8767 3.2602 19.6341 3.01762Z"
                                            fill="#fff"
                                        />
                                        <path
                                            d="M0 20L5.745 18.6738L1.32379 14.255L0 20Z"
                                            fill="#fff"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <div className="header-content">
                                <h2 className="font-w500">Alex Geovanny</h2>
                                <span className="font-w400">demo@mail.com</span>
                            </div>
                        </a>
                    </div>
                    <ul className="metismenu" id="menu">
                        {
                            roles === 'ADMIN' ? admin_sidebar && admin_sidebar.map((item) => {


                                return <>
                                    <li className={`${location.pathname ===item.route &&  item.route ? 'mm-active' : ""}`}>
                                        {item.Data.length > 0 ? <>
                                            <a
                                                // className="has-arrow "
                                                href="javascript:void()"
                                                aria-expanded="false"
                                                className={`has-arrow `}
                                            >
                                                <IconComponent key={item.id} icon={item.Icon} className='mx-2' />
                                                <span className="nav-text">{item.name}</span>
                                            </a>
                                        </> : ""}
                                        <ul aria-expanded="false">
                                            {item.Data.length > 0 ?
                                                item.Data.map((nested_item) => {
                                                    return <>
                                                        <li className={`${location.pathname ===item.route &&  item.route ? 'mm-active' : ""}`}>
                                                            <Link href="javascript:void()" to={nested_item.route}>{nested_item.name}</Link>
                                                        </li>
                                                    </>
                                                })
                                                : ""}
                                        </ul>
                                    </li>
                                    {item.Data.length === 0 ? <>

                                        <li className={`${location.pathname ===item.route &&  item.route ? 'mm-active' : ""}`}>
                                            <Link to={item.route} className="" aria-expanded="false">
                                                <IconComponent key={item.id} icon={item.Icon} />
                                                <span className="nav-text">{item.name}</span>
                                            </Link>
                                        </li>
                                    </> : ""}


                                </>
                            }) : roles === 'SUPERADMIN' ? supper_admin_sidebar && supper_admin_sidebar.map((item) => {
                                return <>
                                    <li className={`${location.pathname ===item.route &&  item.route ? 'mm-active' : ""}`}>
                                        {item.Data.length > 0 ? <>

                                            <Link
                                                className="has-arrow "
                                                href="javascript:void()"
                                                aria-expanded="false"
                                                to={item.route}
                                            >
                                                <IconComponent key={item.id} icon={item.Icon} className='mx-2' />
                                                <span className="nav-text mx-2 mm-active">{item.name}</span>
                                            </Link>
                                        </> : ""}
                                        <ul aria-expanded="false" >
                                            {item.Data.length > 0 ?
                                                item.Data.map((nested_item) => {
                                                    return <>
                                                        <li className={`${location.pathname ===item.route &&  item.route ? 'mm-active' : ""}`}>
                                                            <Link  to={nested_item.route}>{nested_item.name}</Link>
                                                        </li>
                                                    </>
                                                })
                                                : ""}
                                        </ul>
                                    </li>
                                    {item.Data.length === 0 ? <>
                                        <li className={`${location.pathname ===item.route &&  item.route ? 'mm-active' : ""}`}>
                                            <Link to={item.route} className="" aria-expanded="false">
                                                <IconComponent key={item.id} icon={item.Icon} />

                                                <span className="nav-text mx-2">{item.name}</span>
                                            </Link>
                                        </li>
                                    </> : ""}


                                </>
                            }) :
                                roles === 'SUBADMIN' ? sub_admin_sidebar && sub_admin_sidebar.map((item) => {
                                    return <>
                                        <li className={`${location.pathname ===item.route &&  item.route ? 'mm-active' : ""}`}>
                                            {item.Data.length > 0 ? <>

                                                <Link
                                                    className="has-arrow "
                                                    // href="javascript:void()"
                                                    aria-expanded="false"
                                                >
                                                    <IconComponent key={item.id} icon={item.Icon} />

                                                    <span className="nav-text  mx-2">{item.name}</span>
                                                </Link>
                                            </> : ""}
                                            <ul aria-expanded="false">
                                                {item.Data.length > 0 ?
                                                    item.Data.map((nested_item) => {
                                                        return <>
                                                            <li className={`${location.pathname ===item.route &&  item.route ? 'mm-active' : ""}`}>
                                                                <Link to={nested_item.route}>{nested_item.name}</Link>
                                                            </li>
                                                        </>
                                                    })
                                                    : ""}
                                            </ul>
                                        </li>
                                        {item.Data.length === 0 ? <>
                                            <li className={`${location.pathname ===item.route &&  item.route ? 'mm-active' : ""}`}>
                                                <Link to={item.route} className="" aria-expanded="false">
                                                    <IconComponent key={item.id} icon={item.Icon} />
                                                    {/* <i className="flaticon-013-checkmark" /> */}
                                                    <span className="nav-text mx-2">{item.name}</span>
                                                </Link>
                                            </li>
                                        </> : ""}


                                    </>
                                }) :
                                    roles === 'CLIENT' ? Client && Client.map((item) => {
                                        return <>
                                            <li className={`${location.pathname ===item.route &&  item.route ? 'mm-active' : ""}`}>
                                                {item.Data.length > 0 ? <>

                                                    <Link
                                                        className="has-arrow "
                                                        // href="javascript:void()"
                                                        aria-expanded="false"
                                                    >
                                                        <IconComponent key={item.id} icon={item.Icon} />

                                                        <span className="nav-text mx-2">{item.name}</span>
                                                    </Link>
                                                </> : ""}
                                                <ul aria-expanded="false">
                                                    {item.Data.length > 0 ?
                                                        item.Data.map((nested_item) => {
                                                            return <>
                                                                <li className={`${location.pathname ===item.route &&  item.route ? 'mm-active' : ""}`}>
                                                                    <Link to={nested_item.route}>{nested_item.name}</Link>
                                                                </li>
                                                            </>
                                                        })
                                                        : ""}
                                                </ul>
                                            </li>
                                            {item.Data.length === 0 ? <>
                                                <li className={`${location.pathname ===item.route &&  item.route ? 'mm-active' : ""}`}>
                                                    <Link to={item.route} className="" aria-expanded="false">
                                                        <IconComponent key={item.id} icon={item.Icon} />

                                                        <span className="nav-text mx-2">{item.name}</span>
                                                    </Link>
                                                </li>
                                            </> : ""}


                                        </>
                                    })
                                        : ""
                        }



                    </ul>
                </div>
            </div>
        </div>

    )
}

export default Sidebar






const IconComponent = ({ icon }) => {
    // Render the icon based on the provided icon name
    const renderIcon = () => {
        switch (icon) {
            case 'Signal':
                return <Signal className='me-3' />;
            case 'Users':
                return <Users className='me-3' />;
            case 'Wrench':
                return <Wrench className='me-3' />;

            case 'Frame':
                return <Frame className='me-3' />;

            case 'CandlestickChart':
                return <CandlestickChart className='me-3' />;
            case 'Activity':
                return <Activity className='me-3' />;
            case 'WalletCards':
                return <WalletCards className='me-3' />;
            case 'HelpingHand':
                return <HelpingHand className='me-3' />;
            case 'FolderClock':
                return <FolderClock className='me-3' />;
            case 'LayoutDashboard':
                return <LayoutDashboard className='me-3' />;
            case 'Building2':
                return <Building2 className='me-3' />;
            case 'Copyright':
                return <Copyright className='me-3' />;
            case 'Repeat2':
                return <Repeat2 className='me-3' />;
            case 'Rocket':
                return <Rocket className='me-3' />;
            case 'ArrowRightLeft':
                return <ArrowRightLeft className='me-3' />;
            case 'ScatterChart':
                return <ScatterChart className='me-3' />;


            default:
                return null;
        }
    };

    return <>
        {renderIcon()}
    </>
};