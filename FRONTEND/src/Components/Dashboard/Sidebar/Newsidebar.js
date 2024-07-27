import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { admin_sidebar as originalAdminSidebar, supper_admin_sidebar, sub_admin_sidebar, Client } from './Nav_Config';
import { Signal, Users, Wrench, Link2, Frame, CandlestickChart, Activity, WalletCards, HelpingHand, FolderClock, LayoutDashboard, Building2, Copyright, Repeat2, ArrowRightLeft, ScatterChart, Boxes, Rocket, Paintbrush, Vote, Info, MoreHorizontal, BetweenHorizontalStart  } from 'lucide-react';
import $ from "jquery";
import Logo from '../Header/Logo';
import { Get_Sub_Admin_Permissions } from '../../../ReduxStore/Slice/Subadmin/Subadminslice';
import { useDispatch, useSelector } from "react-redux";
import { Get_Company_Logo } from '../../../ReduxStore/Slice/Admin/AdminSlice';
import * as Config from "../../../Utils/Config";
import { Get_Pmermission } from "../../../ReduxStore/Slice/Users/DashboardSlice";

const Sidebar = ({ ShowSidebar }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    const roles = JSON.parse(localStorage.getItem('user_role'));
    const gotodashboard = JSON.parse(localStorage.getItem('gotodashboard'));
    const user_role_goTo = JSON.parse(localStorage.getItem('user_role_goTo'));
    const user_ID = JSON.parse(localStorage.getItem("user_details")).user_id;
    const token = JSON.parse(localStorage.getItem("user_details")).token;
    const goTouser_ID = JSON.parse(localStorage.getItem("user_details_goTo"));
    const theme = JSON.parse(localStorage.getItem("theme"));

    const [getPermissions, setGetPermissions] = useState([]);
    const [admin_permission, setAdmin_permission] = useState([]);

    const maxItemsBeforeMore = 7;

    // Add logic to dynamically create the 'More' section if there are more than 7 items
    const createAdminSidebarWithMore = (sidebar) => {
        if (sidebar.length > maxItemsBeforeMore) {
            const mainItems = sidebar.slice(0, maxItemsBeforeMore);
            const moreItems = sidebar.slice(maxItemsBeforeMore);

            mainItems.push({
                id: maxItemsBeforeMore + 1,
                name: 'More',
                Icon: 'MoreHorizontal',
                Data: moreItems,
            });

            return mainItems;
        }
        return sidebar;
    };

    const admin_sidebar = createAdminSidebarWithMore(originalAdminSidebar);

    // GET SUBADMIN PERMISSION
    const data2 = async () => {
        if (roles === 'SUBADMIN') {
            await dispatch(Get_Sub_Admin_Permissions({ id: user_ID && user_ID })).unwrap()
                .then((response) => {
                    if (response.status) {
                        setGetPermissions(response.data[0]);
                    }
                });
        } else if (user_role_goTo === 'SUBADMIN') {
            await dispatch(Get_Sub_Admin_Permissions({ id: goTouser_ID && goTouser_ID.user_id })).unwrap()
                .then((response) => {
                    if (response.status) {
                        setGetPermissions(response.data[0]);
                    }
                });
        }

        if (roles === 'ADMIN') {
            await dispatch(
                Get_Pmermission({
                    "domain": Config.react_domain,
                    token: token,
                })
            ).unwrap()
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
    };

    useEffect(() => {
        data2();
    }, []);

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
            });
    };

    useEffect(() => {
        CompanyName();
    }, []);

    const renderMenu = (items) => {
        return items.map((item) => (
            <li key={item.id} className={`${location.pathname === item.route ? 'mm-active' : ''}`}>
                {item.Data && item.Data.length > 0 ? (
                    <>
                        <Link className="has-arrow" aria-expanded="false">
                            <IconComponent icon={item.Icon} />
                            <span className="nav-text mx-2">{item.name}</span>
                        </Link>
                        <ul aria-expanded="false">
                            {renderMenu(item.Data)}
                        </ul>
                    </>
                ) : (
                    <Link to={item.route} className="" aria-expanded="false">
                        <IconComponent icon={item.Icon} />
                        <span className="nav-text mx-2">{item.name}</span>
                    </Link>
                )}
            </li>
        ));
    };

    return (
        <div>
            <div className="deznav pt-3">
                <div className="deznav-scroll">
                    <ul className="metismenu" id="menu">
                        {gotodashboard != null ? renderMenu(Client) : ''}
                        {roles === 'ADMIN' && renderMenu(admin_sidebar)}
                        {roles === 'SUPERADMIN' && renderMenu(supper_admin_sidebar)}
                        {roles === 'SUBADMIN' && renderMenu(sub_admin_sidebar)}
                    </ul>
                </div>
            </div>
        </div>
    );
};

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
            case 'BetweenHorizontalStart':
                return <BetweenHorizontalStart  className='me-3' />;
            case 'MoreHorizontal':
                return <MoreHorizontal className='me-3' />;
            default:
                return null;
        }
    };

    return <>{renderIcon()}</>;
};

export default Sidebar;
