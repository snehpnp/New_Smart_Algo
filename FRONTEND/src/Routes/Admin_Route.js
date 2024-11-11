
import React, { useEffect, useState } from 'react'

import { Route, Routes, useLocation } from "react-router-dom";
import * as Config from "../Utils/Config";
import Wraper from '../Components/Dashboard/Wraper/Wraper';
import Dashboard from '../layout/Admin/Dashboard/DashbaordMain';
import Profile from '../layout/Admin/Profile/Profile'
import ClientList from '../layout/Admin/Clients/ClientList/ClientList'
import AddClient from '../layout/Admin/Clients/ClientList/Add_Client'
import EditClient from '../layout/Admin/Clients/ClientList/Edit_Client'
import SignUpClients from '../layout/Admin/Clients/Sign_Up_Clients/Sign_Up_Clients';
import EditSignupClient from '../layout/Admin/Clients/Sign_Up_Clients/EditSignupClients';
import SignupClientDetails from '../layout/Admin/SignupClients/SignupClient_Details'
import ExpiredClients from '../layout/Admin/Clients/ExpiredClients/ExpiredClients'
import AllSubadmin from '../layout/Admin/SubAdmin/Subadmins/AllSubadmin';
import EditSubadmin from '../layout/Admin/SubAdmin/Subadmins/EditSubadmin';
import SubadminClient from "../layout/Admin/SubAdmin/Subadmin_Clients/Subadmin_Client"
import EditSubadminClient from "../layout/Admin/SubAdmin/Subadmin_Clients/EditSubadminClients"
import AddSubadmin from "../layout/Admin/SubAdmin/Subadmins/AddSubadmin"
import Signals from "../layout/Admin/TradeDetails/Signals/Signals"
import SevenDaysEntry from "../layout/Admin/TradeDetails/7DaysEntryOnly/SevenDaysEntryOnly"
import Edit7days from "../layout/Admin/TradeDetails/7DaysEntryOnly/Edit7days"
import TradeExecutionReport from "../layout/Admin/TradeDetails/TradeExecutionReport/TradeExecutionReport"
import TradingStatus from "../layout/Admin/TradeDetails/TradingStatus/TradingStatus"
import TradeHistory from "../layout/Admin/TradeDetails/TradeHistory/TradeHistory"
import AllLicence from '../layout/Admin/Licence/AllLicence/AllLicence';
import ExpiredLicence from "../layout/Admin/Licence/ExpiredLicence/ExpiredLicence"
import HelpCenter from "../layout/Admin/Support/HelpCenter/HelpCenter"
import MsgBroadCast from "../layout/Admin/Support/MsgBroadCast/MsgBroadCast"
import Service from "../layout/Admin/Service/AllService/AllService"
import GroupService from "../layout/Admin/Service/GroupService/GroupService"
import AddGroup from '../layout/Admin/Service/GroupService/Add_Group';
import EditGroup from '../layout/Admin/Service/GroupService/Edit_Group';
import Report from '../layout/Admin/Report/Report';
import ApiCreateInfo from '../layout/Admin/ApiCreateInfo/ApiCreateInfo';
import AddApiCreateInfo from '../layout/Admin/ApiCreateInfo/AddApiCreateInfo';
import EditApiCreateInfo from '../layout/Admin/ApiCreateInfo/EditApiCreateInfo';
import ReleaseUpdate from '../layout/Admin/ReleaseUpdate/ReleaseUpdate';
import System from '../layout/Admin/System/System';
import AllStrategy from '../layout/Admin/Service/AllStrategy/AllStrategy';
import AddStrategy from '../layout/Admin/Service/AllStrategy/AddStrategy';
import AddStraegyNormal from '../layout/Admin/Service/AllStrategy/AddStraegyNormal';
import EditStrategy from '../layout/Admin/Service/AllStrategy/EditStrategy';
import EditStrategyNormal from '../layout/Admin/Service/AllStrategy/EditStrategyNormal';
import OpationChain from '../layout/Admin/OptionChain/Opation_Chain';
import OpenPositions from '../layout/Admin/OptionChain/Open_Positions';
import CreateStrategy from '../layout/Admin/CreateStrategy/CreateStrategy';
import AllMakeStrategy from '../layout/Admin/CreateStrategy/AllMakeStrategy';
import EditMakeStrategy from '../layout/Admin/CreateStrategy/EditMakeStrategy';
import AddStrategyToClients from '../layout/Admin/Service/AllStrategy/AddStrategyToClients';
import BrokerInfor from '../layout/Admin/BrokersInformation/Broker_info';
import ChartDetail from '../layout/Admin/ChartInformation/Chart_info';
import { Get_Pmermission } from "../ReduxStore/Slice/Users/DashboardSlice";
import Faq from '../layout/Admin/Faq/Faq';
import Starclients from '../layout/Admin/Clients/Starclients/Starclients'
import ReferralPage  from '../layout/Admin/Profile/ReferralPage'
import Plans  from '../layout/Admin/Service/Plans/Plans'
import Addplans  from '../layout/Admin/Service/Plans/Addplan'
import TradeHistory1 from "../layout/Admin/TradeDetails/TradeHistory/Tradehistory1"
import { useDispatch } from "react-redux";

const Admin = () => {

    const location = useLocation();
    const dispatch = useDispatch()
    const roles = JSON.parse(localStorage.getItem('user_role'))
    const token = JSON.parse(localStorage.getItem("user_details")).token
    const [admin_permission, setAdmin_permission] = useState([]);

    useEffect(() => {
        const data2 = async () => {
            if (roles === 'ADMIN') {
                await dispatch(
                    Get_Pmermission({
                        domain: Config.react_domain,
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
        };

        data2();
    }, [dispatch, roles, token]);



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
                <Route exact path="/strategies/add" element={admin_permission.data && Number(admin_permission.data[0].Strategy_plan) === 1 ? <AddStrategy /> : <AddStraegyNormal />} />
                <Route exact path="/strategies/edit/:id" element={admin_permission.data && Number(admin_permission.data[0].Strategy_plan) === 1 ? <EditStrategy /> : <EditStrategyNormal />} />
                <Route exact path="/sevendaysentry" element={<SevenDaysEntry />} />
                <Route exact path="/signupclient" element={<SignupClientDetails />} />
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
                <Route exact path="/optionchain" element={<OpationChain />} />
                <Route exact path="/openposition" element={<OpenPositions />} />
                <Route exact path="/addstratgytoclients" element={<AddStrategyToClients />} />
                <Route exact path="/chart" element={<ChartDetail />} />
                <Route exact path="/allstarclients" element={<Starclients />} />
                <Route exact path="/faq" element={<Faq />} />
                <Route exact path="/refer-earn" element={<ReferralPage />} />
                <Route exact path="/plans" element={<Plans />} />
                <Route exact path="/plan/add" element={<Addplans />} />

                <Route exact path="/tradehistory1" element={<TradeHistory1 />} />
  

            </Routes>
        </>
    )
}

export default Admin