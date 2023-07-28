/* eslint-disable no-unused-vars */
import React from 'react'
import { BrowserRouter, Route, Routes, NavLink, useLocation, useNavigate } from "react-router-dom";

import Wraper from '../Components/Dashboard/Wraper/Wraper';
import Dashboard from '../layout/Admin/Dashboard/Dashbaord';

//  Clients
import ClientList from '../layout/Clients/ClientList/ClientList';
import SignUpClients from '../layout/Clients/Sign_Up_Clients/Sign_Up_Clients';

//  Clients
import AllSubadmin from '../layout/Admin/SubAdmin/Subadmins/AllSubadmin';
import SubadminClient from "../layout/Admin/SubAdmin/Subadmin_Clients/Subadmin_Client"

// Trade Details
import Signals from "../layout/Admin/TradeDetails/Signals/Signals"
import SevenDaysEntry from "../layout/Admin/TradeDetails/7DaysEntryOnly/SevenDaysEntryOnly"
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

// Report
import Report from '../layout/Admin/Report/Report';

// ApiCreateInfo
import ApiCreateInfo from '../layout/Admin/ApiCreateInfo/ApiCreateInfo';

// ApiCreateInfo
import ReleaseUpdate from '../layout/Admin/ReleaseUpdate/ReleaseUpdate';


// System

import System from '../layout/Admin/System/System';





const Admin = () => {

    const location = useLocation();
    const navigate = useNavigate()
    const role_id = localStorage.getItem("Role")

    return (
        <>
            {location.pathname !== "/admin" && location.pathname !== "/admin/*" ? <Wraper /> : null}
            <Routes>
                <Route exact path="/dashboard" element={<Dashboard />} />
                <Route exact path="/system" element={<System />} />
                <Route exact path="/allclients" element={<ClientList />} />
                <Route exact path="/signupclients" element={<SignUpClients />} />
                <Route exact path="/allsubadmins" element={<AllSubadmin />} />
                <Route exact path="/subadminclients" element={<SubadminClient />} />
                <Route exact path="/sevendaysentry" element={<SevenDaysEntry />} />
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
                <Route exact path="/reports" element={<Report />} />
                <Route exact path="/apicreateinfo" element={<ApiCreateInfo />} />
                <Route exact path="/updates" element={<ReleaseUpdate />} />
            </Routes>
        </>
    )
}

export default Admin