
import React, { useRef, useEffect, useState } from 'react'

import { BrowserRouter, Route, Routes, NavLink, useLocation, useNavigate } from "react-router-dom";
import * as Config from "../Utils/Config";

import Wraper from '../Components/Dashboard/Wraper/Wraper';
import Dashboard from '../layout/Admin/Dashboard/DashbaordMain';
import Profile from '../layout/Admin/Profile/Profile'

//  Clients
import ClientList from '../layout/Admin/Clients/ClientList/ClientList'
import AddClient from '../layout/Admin/Clients/ClientList/Add_Client'
import EditClient from '../layout/Admin/Clients/ClientList/Edit_Client'
import SignUpClients from '../layout/Admin/Clients/Sign_Up_Clients/Sign_Up_Clients';
import EditSignupClient from '../layout/Admin/Clients/Sign_Up_Clients/EditSignupClients';




//show client details
import SignupClient_Details from '../layout/Admin/SignupClients/SignupClient_Details'


// Expired Client List
import ExpiredClients from '../layout/Admin/Clients/ExpiredClients/ExpiredClients'


//  Sub Admin
import AllSubadmin from '../layout/Admin/SubAdmin/Subadmins/AllSubadmin';
import EditSubadmin from '../layout/Admin/SubAdmin/Subadmins/EditSubadmin';
import SubadminClient from "../layout/Admin/SubAdmin/Subadmin_Clients/Subadmin_Client"
import EditSubadminClient from "../layout/Admin/SubAdmin/Subadmin_Clients/EditSubadminClients"
import AddSubadmin from "../layout/Admin/SubAdmin/Subadmins/AddSubadmin"


// Trade Details
import Signals from "../layout/Admin/TradeDetails/Signals/Signals"
import SevenDaysEntry from "../layout/Admin/TradeDetails/7DaysEntryOnly/SevenDaysEntryOnly"
import Edit7days from "../layout/Admin/TradeDetails/7DaysEntryOnly/Edit7days"
import TradeExecutionReport from "../layout/Admin/TradeDetails/TradeExecutionReport/TradeExecutionReport"
import TradingStatus from "../layout/Admin/TradeDetails/TradingStatus/TradingStatus"
import TradeHistory from "../layout/Admin/TradeDetails/TradeHistory/TradeHistory"

// Licence
import AllLicence from '../layout/Admin/Licence/AllLicence/AllLicence';
import ExpiredLicence from "../layout/Admin/Licence/ExpiredLicence/ExpiredLicence"

// Support
import HelpCenter from "../layout/Admin/Support/HelpCenter/HelpCenter"
import MsgBroadCast from "../layout/Admin/Support/MsgBroadCast/MsgBroadCast"

// Service
import Service from "../layout/Admin/Service/AllService/AllService"
import GroupService from "../layout/Admin/Service/GroupService/GroupService"
import AddGroup from '../layout/Admin/Service/GroupService/Add_Group';
import EditGroup from '../layout/Admin/Service/GroupService/Edit_Group';


// Report
import Report from '../layout/Admin/Report/Report';

// ApiCreateInfo
import ApiCreateInfo from '../layout/Admin/ApiCreateInfo/ApiCreateInfo';
import AddApiCreateInfo from '../layout/Admin/ApiCreateInfo/AddApiCreateInfo';
import EditApiCreateInfo from '../layout/Admin/ApiCreateInfo/EditApiCreateInfo';



// ReleaseUpdate
import ReleaseUpdate from '../layout/Admin/ReleaseUpdate/ReleaseUpdate';


// System
import System from '../layout/Admin/System/System';

// Strategy
import AllStrategy from '../layout/Admin/Service/AllStrategy/AllStrategy';
import AddStrategy from '../layout/Admin/Service/AllStrategy/AddStrategy';
import AddStraegyNormal from '../layout/Admin/Service/AllStrategy/AddStraegyNormal';

import EditStrategy from '../layout/Admin/Service/AllStrategy/EditStrategy';
import EditStrategyNormal from '../layout/Admin/Service/AllStrategy/EditStrategyNormal';

import { Import } from 'lucide-react';

// OPTION CHAIN
import Opation_Chain from '../layout/Admin/OptionChain/Opation_Chain';
import Open_Positions from '../layout/Admin/OptionChain/Open_Positions';



// CREATE STRATEGY
import CreateStrategy from '../layout/Admin/CreateStrategy/CreateStrategy';
import AllMakeStrategy from '../layout/Admin/CreateStrategy/AllMakeStrategy';
import EditMakeStrategy from '../layout/Admin/CreateStrategy/EditMakeStrategy';




// BROKER INFORMATION SET
import BrokerInfor from '../layout/Admin/BrokersInformation/Broker_info';


import { Get_Pmermission } from "../ReduxStore/Slice/Users/DashboardSlice";

import { useDispatch, useSelector } from "react-redux";




const Admin = () => {

    const location = useLocation();
    const navigate = useNavigate()
    const role_id = localStorage.getItem("Role")
    const dispatch = useDispatch()
    const roles = JSON.parse(localStorage.getItem('user_role'))
    const token = JSON.parse(localStorage.getItem("user_details")).token


    const [admin_permission, setAdmin_permission] = useState([]);

    //  GET SUBADMIN PERMISSION
    const data2 = async () => {

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

     


    return (
        <>
            {location.pathname !== "/admin" && location.pathname !== "/admin/*" ? <Wraper /> : null}
            <Routes>
                <Route exact path="/dashboard" element={<Dashboard />} />
                <Route exact path="/profile" element={<Profile />} />
                <Route exact path="/system" element={<System />} />
                <Route exact path="/allclients" element={<ClientList />} />
                <Route exact path="/expiredclients" element={<ExpiredClients />} />
                <Route exact path="/client/add" element={<AddClient />} />
                <Route exact path="/client/edit/:id" element={<EditClient />} />
                <Route exact path="/signupclients" element={<SignUpClients />} />
                <Route exact path="/editsignupclients" element={<EditSignupClient />} />
                <Route exact path="/allsubadmins" element={<AllSubadmin />} />
                <Route exact path="/editsubadmin/:id" element={<EditSubadmin />} />
                <Route exact path="/subadminclients" element={<SubadminClient />} />
                <Route exact path="/allsubadmins/add" element={<AddSubadmin />} />
                <Route exact path="/allsubadmins/edit" element={<EditSubadminClient />} />
                <Route exact path="/strategies" element={<AllStrategy />} />
                <Route exact path="/strategies/add" element={admin_permission.data && admin_permission.data[0].Strategy_plan == 1 ? <AddStrategy /> : <AddStraegyNormal />} />
        
                <Route exact path="/strategies/edit/:id" element={admin_permission.data && admin_permission.data[0].Strategy_plan == 1 ? <EditStrategy /> : <EditStrategyNormal />} />

                <Route exact path="/sevendaysentry" element={<SevenDaysEntry />} />
                <Route exact path="/signupclient" element={<SignupClient_Details/>} />

                <Route exact path="/Edit7days" element={<Edit7days />} />
                <Route exact path="/tradeexecution" element={<TradeExecutionReport />} />
                <Route exact path="/tradingstatus" element={<TradingStatus />} />
                <Route exact path="/tradehistory" element={<TradeHistory />} />
                <Route exact path="/signals" element={<Signals />} />
                <Route exact path="/allLicence" element={<AllLicence />} />
                <Route exact path="/expiredlicence" element={<ExpiredLicence />} />
                <Route exact path="/helpcenter" element={<HelpCenter />} />
                <Route exact path="/msgbroadcast" element={<MsgBroadCast />} />
                <Route exact path="/allservices" element={<Service />} />
                <Route exact path="/groupservices" element={<GroupService />} />
                <Route exact path="/groupservices/add" element={<AddGroup />} />
                <Route exact path="/groupservices/edit/:id" element={<EditGroup />} />
                <Route exact path="/reports" element={<Report />} />
                <Route exact path="/apicreateinfo" element={<ApiCreateInfo />} />
                <Route exact path="/apicreateinfo/add" element={<AddApiCreateInfo />} />
                <Route exact path="/apicreateinfo/edit" element={<EditApiCreateInfo />} />
                <Route exact path="/updates" element={<ReleaseUpdate />} />
                <Route exact path="/createstrategy" element={<CreateStrategy />} />
                <Route exact path="/AllMakeStrategy" element={<AllMakeStrategy />} />
                <Route exact path="/MakeStrategy/edit/:id" element={<EditMakeStrategy />} />
                <Route exact path="/brokerinfo" element={<BrokerInfor />} />
                <Route exact path="/optionchain" element={<Opation_Chain />} />
                <Route exact path="/openposition" element={<Open_Positions />} />

            </Routes>
        </>
    )
}

export default Admin