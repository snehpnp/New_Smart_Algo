import React, { useRef, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { admin_sidebar, supper_admin_sidebar, sub_admin_sidebar, Client } from './Nav_Config'
import { Signal, Users, Wrench, Link2, Frame, CandlestickChart, Activity, WalletCards, HelpingHand, FolderClock, LayoutDashboard, Building2, Copyright, Repeat2, ArrowRightLeft, ScatterChart, Boxes, Rocket, Paintbrush, Vote, Info } from 'lucide-react';
import Test from "../../../test"
import html2canvas from 'html2canvas';
import $ from "jquery";
import Logo from '../Header/Logo';
import { Get_Sub_Admin_Permissions } from '../../../ReduxStore/Slice/Subadmin/Subadminslice';
import { useDispatch, useSelector } from "react-redux";
import { Get_Company_Logo } from '../../../ReduxStore/Slice/Admin/AdminSlice'
import * as Config from "../../../Utils/Config";
import { Get_Pmermission } from "../../../ReduxStore/Slice/Users/DashboardSlice";





const Sidebar = ({ ShowSidebar }) => {

    const location = useLocation()
    const dispatch = useDispatch()



    const roles = JSON.parse(localStorage.getItem('user_role'))
    const gotodashboard = JSON.parse(localStorage.getItem('gotodashboard'))
    const user_role_goTo = JSON.parse(localStorage.getItem('user_role_goTo'))
    const user_ID = JSON.parse(localStorage.getItem("user_details")).user_id
    const token = JSON.parse(localStorage.getItem("user_details")).token


    const [getPermissions, setGetPermissions] = useState([])
    const [admin_permission, setAdmin_permission] = useState([]);


   
    // if(admin_permission.length > 0 ){

    //     console.log("  admin_permission.data[0].Create_Strategy  ",admin_permission.data[0].Create_Strategy)

    // }
    

    //  GET SUBADMIN PERMISSION
    const data2 = async () => {
        if (roles === 'SUBADMIN') {
            await dispatch(Get_Sub_Admin_Permissions({ id: user_ID && user_ID })).unwrap()
                .then((response) => {
                    if (response.status) {
                        setGetPermissions(response.data[0])

                    }
                })
        }
        if (roles === 'ADMIN') {
            await dispatch(
                Get_Pmermission({
                    "domain": Config.react_domain,
                    token: token,
                })
            )
                .unwrap()
                .then((response) => {
                    if (response.status) {
                        setAdmin_permission({
                            loading: false,
                            data: response.data,
                        });
                    } else {
                        setAdmin_permission({
                            loading: false,
                            data: response.data,
                        });
                    }
                });
        }
    }
    useEffect(() => {
        data2()

    }, [])




    const CompanyName = async () => {
        await dispatch(Get_Company_Logo()).unwrap()
            .then((response) => {
                if (response.status) {
                    $(".logo-abbr").attr('src', response.data && response.data[0].logo);

                    $(".set_Favicon")

                    let favicon = $("link[rel='icon']").length
                        ? $("link[rel='icon']")
                        : $("<link rel='icon' type='image/x-icon' />");
                    favicon.attr('href', response.data && response.data[0].favicon);
                    $('head').append(favicon);
                }
            })
    }
    useEffect(() => {
        CompanyName()
    }, [])




    const test = async () => {

        const element = document.getElementById('root');


        const options = {
            width: document.documentElement.scrollWidth, // Set custom width
            height: document.documentElement.scrollHeight, // Set custom height
        };

        // Set the window size and scroll position to match the content size
        // window.resizeTo(width, height);
        window.scrollTo(0, 0);

        var screenshotUrl
        // setIsModalOpen(false)


        // Capture the screenshot
        await html2canvas(document.documentElement, options).then(canvas => {
            // Convert canvas to an image and download it
            const screenshot = canvas.toDataURL('image/png');
            screenshotUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = screenshot;
            link.download = 'screenshot.png';
            link.click();


        })



    }


    return (
        <div>

            <div className="deznav pt-3" >
                <div className="deznav-scroll">
                    <ul className="metismenu" id="menu">

                        {/* <button onClick={test()}>click</button> */}

                        <div className='sidebar-logo'>
                            <Logo />
                        </div>
                        {
                            gotodashboard != null ? user_role_goTo === "USER" ? Client && Client.map((item) => {
                                return <>
                                    <li className={`${location.pathname === item.route && item.route ? 'mm-active' : ""}`}>
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
                                                        <li className={`${location.pathname === item.route && item.route ? 'mm-active' : ""}`}>
                                                            <Link to={nested_item.route}>{nested_item.name}</Link>
                                                        </li>
                                                    </>
                                                })
                                                : ""}
                                        </ul>
                                    </li>
                                    {item.Data.length === 0 ? <>
                                        <li className={`${location.pathname === item.route && item.route ? 'mm-active' : ""}`}>
                                            <Link to={item.route} className="" aria-expanded="false">
                                                <IconComponent key={item.id} icon={item.Icon} />

                                                <span className="nav-text mx-2">{item.name}</span>
                                            </Link>
                                        </li>
                                    </> : ""}


                                </>
                            }) : user_role_goTo === "SUBADMIN" ? sub_admin_sidebar && sub_admin_sidebar.map((item) => {
                                return <>
                                    <li className={`${location.pathname === item.route && item.route ? 'mm-active' : ""}`}>
                                        {item.Data.length > 0 ? <>
                                            <Link
                                                className="has-arrow "
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
                                                        <li className={`${location.pathname === item.route && item.route ? 'mm-active' : ""}`}>
                                                            <Link to={nested_item.route}>{nested_item.name}</Link>
                                                        </li>
                                                    </>
                                                })
                                                : ""}
                                        </ul>
                                    </li>
                                    {item.Data.length === 0 ? <>
                                        <li className={`${location.pathname === item.route && item.route ? 'mm-active' : ""}`}>
                                            <Link to={item.route} className="" aria-expanded="false">
                                                <IconComponent key={item.id} icon={item.Icon} />

                                                <span className="nav-text mx-2">{item.name}</span>
                                            </Link>
                                        </li>
                                    </> : ""}


                                </>
                            }) : "" :
                                roles === 'ADMIN' ? admin_sidebar && admin_sidebar.map((item) => {

                                   // console.log("item.Data.length SS length --",item.Data.length)
                                    //console.log("item.Data.length SS -- check permission",admin_permission.data && admin_permission.data[0].Create_Strategy === 0)
                                
                                    // console.log("location.pathname ",location.pathname)
                                    // console.log("item  ",item)
                                    // console.log("item.Data ",item.Data)

                                    if((item.id === 9 || item.name === "Make Strategy")&& admin_permission.data && admin_permission.data[0].Create_Strategy === 0){
                                  //  console.log("okkkkkkkkkkkkkk")
                                    }else{
                                   //  console.log("elseeeeeeeee") 
                                     return <>

                                        <li className={`${location.pathname.includes(item.route && item.route) ? 'mm-active' : ""}`}>
                                            {item.Data.length > 0  ? <>
                                                <a
                                                    className="has-arrow"
                                                
                                                >
                                                    <IconComponent key={item.id} icon={item.Icon} className='mx-2' />
                                                    <span className="nav-text">{item.name}</span>
                                                </a>
                                            </> : ""}
                                            {item.Data.length !== 0 ? <>
                                                <ul aria-expanded='false'>
                                                    {item.Data.length > 0 ?
                                               item.Data.map((nested_item) => {

                                               // console.log("nested_item.route ",nested_item.route)
                                              //  console.log("admin_permission.data[0].Create_Strategy ",admin_permission.data && admin_permission.data[0].Create_Strategy)

                                        if(nested_item.route == "/admin/createstrategy" && admin_permission.data && admin_permission.data[0].Create_Strategy === 0 || nested_item.route == "/admin/AllMakeStrategy" && admin_permission.data && admin_permission.data[0].Create_Strategy === 0 
                                        ||nested_item.route == "/admin/optionchain" && admin_permission.data && admin_permission.data[0].Option_chain === 0
                                                 ){
                                                    
                                                             
                                                     }else{
                                                     // console.log(" NOT OKKKK")
                                                             
                                                        return <>
                                                        <li className={`${location.pathname.includes(item.route && item.route) ? 'mm-active' : ""}`}>

                                                            <Link to={nested_item.route}>{nested_item.name}</Link>

                                                        </li>
                                                         </>
                                          
                                                            }


                                                         
                                                        })
                                                        : ""}
                                                </ul>
                                            </> : ""}
                                        </li>

                                        {/* : ""} */}


                                        {item.Data.length === 0 ? <>
                                            {
                                                
                                                item.route === "/admin/createstrategy" && admin_permission.data && admin_permission.data[0].Create_Strategy === 0 ||
                                                    item.route === "/admin/optionchain" && admin_permission.data && admin_permission.data[0].Option_chain === 0 ? "" :
                                                    <li className={`${location.pathname === item.route && item.route ? 'mm-active' : ""}`}>
                                                        <Link to={item.route} className="" aria-expanded="false">
                                                            <IconComponent key={item.id} icon={item.Icon} />
                                                            <span className="nav-text">{item.name}</span>
                                                        </Link>
                                                    </li>
                                            }
                                        </> : ""}



                                    </>
                                    }

                                    



                                }) : roles === 'SUPERADMIN' ? supper_admin_sidebar && supper_admin_sidebar.map((item) => {
                                    return <>
                                        <li className={`${location.pathname === item.route && item.route ? 'mm-active' : ""}`}>
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
                                                            <li className={`${location.pathname === item.route && item.route ? 'mm-active' : ""}`}>
                                                                <Link to={nested_item.route}>{nested_item.name}</Link>
                                                            </li>
                                                        </>
                                                    })
                                                    : ""}
                                            </ul>
                                        </li>
                                        {item.Data.length === 0 ? <>
                                            <li className={`${location.pathname === item.route && item.route ? 'mm-active' : ""}`}>
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
                                            {(item.route === "/subadmin/tradehistory" && getPermissions && getPermissions.trade_history_old == 1) ? <>

                                                <li className={`${location.pathname === item.route && item.route ? 'mm-active' : ""}`}>
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
                                                    {
                                                        item.Data.length === 0 ? "" : <>
                                                            <ul aria-expanded="false">
                                                                {item.Data.length > 0 ?
                                                                    item.Data.map((nested_item) => {
                                                                        return <>
                                                                            <li className={`${location.pathname === item.route && item.route ? 'mm-active' : ""}`}>
                                                                                <Link to={nested_item.route}>{nested_item.name}</Link>
                                                                            </li>
                                                                        </>
                                                                    })
                                                                    : ""}
                                                            </ul>
                                                        </>}
                                                </li>
                                            </> : ""}

                                            {item.Data.length === 0 ? <>
                                                {item.route === "/subadmin/tradehistory" && getPermissions && getPermissions.trade_history_old == 0 ? '' :
                                                    <li className={`${location.pathname === item.route && item.route ? 'mm-active' : ""}`}>
                                                        <Link to={item.route} className="" aria-expanded="false">
                                                            <IconComponent key={item.id} icon={item.Icon} />
                                                            {/* <i className="flaticon-013-checkmark" /> */}
                                                            <span className="nav-text mx-2">{item.name}</span>
                                                        </Link>
                                                    </li>
                                                }

                                            </>


                                                : ""}


                                        </>
                                    }) :
                                        roles === "USER" ? Client && Client.map((item) => {
                                            return <>
                                                <li className={`${location.pathname === item.route && item.route ? 'mm-active' : ""}`}>
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
                                                                    <li className={`${location.pathname === item.route && item.route ? 'mm-active' : ""}`}>
                                                                        <Link to={nested_item.route}>{nested_item.name}</Link>
                                                                    </li>
                                                                </>
                                                            })
                                                            : ""}
                                                    </ul>
                                                </li>
                                                {item.Data.length === 0 ? <>
                                                    <li className={`${location.pathname === item.route && item.route ? 'mm-active' : ""}`}>
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
            case 'Paintbrush':
                return <Paintbrush className='me-3' />;
            case 'Vote':
                return <Vote className='me-3' />;
            case 'Boxes':
                return <Boxes className='me-3' />;
            case 'Info':
                return <Info className='me-3' />;
            case 'Link2':
                return <Link2 className='me-3' />;

            default:
                return null;
        }
    };

    return <>
        {renderIcon()}
    </>
};