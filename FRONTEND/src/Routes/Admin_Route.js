
import React, { useEffect, useState ,lazy, Suspense} from 'react'

import { useDispatch } from "react-redux";
import { Route, Routes, useLocation } from "react-router-dom";
import * as Config from "../Utils/Config";
import Wraper from '../Components/Dashboard/Wraper/Wraper';
import Footer from '../Components/Dashboard/Footer/Footer.js'
import Loading from '../Utils/Loader.js'

import { Get_Pmermission } from "../ReduxStore/Slice/Users/DashboardSlice";


const Dashboard = lazy(() => import('../layout/Admin/Dashboard/DashbaordMain'));
const Profile = lazy(() => import('../layout/Admin/Profile/Profile'));
const ClientList = lazy(() => import('../layout/Admin/Clients/ClientList/ClientList'));
const AddClient = lazy(() => import('../layout/Admin/Clients/ClientList/Add_Client'));
const EditClient = lazy(() => import('../layout/Admin/Clients/ClientList/Edit_Client'));
const SignUpClients = lazy(() => import('../layout/Admin/Clients/Sign_Up_Clients/Sign_Up_Clients'));
const EditSignupClient = lazy(() => import('../layout/Admin/Clients/Sign_Up_Clients/EditSignupClients'));
const SignupClientDetails = lazy(() => import('../layout/Admin/SignupClients/SignupClient_Details'));
const ExpiredClients = lazy(() => import('../layout/Admin/Clients/ExpiredClients/ExpiredClients'));
const AllSubadmin = lazy(() => import('../layout/Admin/SubAdmin/Subadmins/AllSubadmin'));
const EditSubadmin = lazy(() => import('../layout/Admin/SubAdmin/Subadmins/EditSubadmin'));
const SubadminClient = lazy(() => import("../layout/Admin/SubAdmin/Subadmin_Clients/Subadmin_Client"));
const EditSubadminClient = lazy(() => import("../layout/Admin/SubAdmin/Subadmin_Clients/EditSubadminClients"));
const AddSubadmin = lazy(() => import("../layout/Admin/SubAdmin/Subadmins/AddSubadmin"));
const Signals = lazy(() => import("../layout/Admin/TradeDetails/Signals/Signals"));
const SevenDaysEntry = lazy(() => import("../layout/Admin/TradeDetails/7DaysEntryOnly/SevenDaysEntryOnly"));
const Edit7days = lazy(() => import("../layout/Admin/TradeDetails/7DaysEntryOnly/Edit7days"));
const TradeExecutionReport = lazy(() => import("../layout/Admin/TradeDetails/TradeExecutionReport/TradeExecutionReport"));
const TradingStatus = lazy(() => import("../layout/Admin/TradeDetails/TradingStatus/TradingStatus"));
const TradeHistory = lazy(() => import("../layout/Admin/TradeDetails/TradeHistory/TradeHistory"));
const AllLicence = lazy(() => import('../layout/Admin/Licence/AllLicence/AllLicence'));
const ExpiredLicence = lazy(() => import("../layout/Admin/Licence/ExpiredLicence/ExpiredLicence"));
const HelpCenter = lazy(() => import("../layout/Admin/Support/HelpCenter/HelpCenter"));
const MsgBroadCast = lazy(() => import("../layout/Admin/Support/MsgBroadCast/MsgBroadCast"));
const Service = lazy(() => import("../layout/Admin/Service/AllService/AllService"));
const GroupService = lazy(() => import("../layout/Admin/Service/GroupService/GroupService"));
const AddGroup = lazy(() => import('../layout/Admin/Service/GroupService/Add_Group'));
const EditGroup = lazy(() => import('../layout/Admin/Service/GroupService/Edit_Group'));
const Report = lazy(() => import('../layout/Admin/Report/Report'));
const ApiCreateInfo = lazy(() => import('../layout/Admin/ApiCreateInfo/ApiCreateInfo'));
const AddApiCreateInfo = lazy(() => import('../layout/Admin/ApiCreateInfo/AddApiCreateInfo'));
const EditApiCreateInfo = lazy(() => import('../layout/Admin/ApiCreateInfo/EditApiCreateInfo'));
const ReleaseUpdate = lazy(() => import('../layout/Admin/ReleaseUpdate/ReleaseUpdate'));
const System = lazy(() => import('../layout/Admin/System/System'));
const AllStrategy = lazy(() => import('../layout/Admin/Service/AllStrategy/AllStrategy'));
const AddStrategy = lazy(() => import('../layout/Admin/Service/AllStrategy/AddStrategy'));
const AddStraegyNormal = lazy(() => import('../layout/Admin/Service/AllStrategy/AddStraegyNormal'));
const EditStrategy = lazy(() => import('../layout/Admin/Service/AllStrategy/EditStrategy'));
const EditStrategyNormal = lazy(() => import('../layout/Admin/Service/AllStrategy/EditStrategyNormal'));
const OpationChain = lazy(() => import('../layout/Admin/OptionChain/Opation_Chain'));
const OpenPositions = lazy(() => import('../layout/Admin/OptionChain/Open_Positions'));
const CreateStrategy = lazy(() => import('../layout/Admin/CreateStrategy/CreateStrategy'));
const AllMakeStrategy = lazy(() => import('../layout/Admin/CreateStrategy/AllMakeStrategy'));
const EditMakeStrategy = lazy(() => import('../layout/Admin/CreateStrategy/EditMakeStrategy'));
const AddStrategyToClients = lazy(() => import('../layout/Admin/Service/AllStrategy/AddStrategyToClients'));
const BrokerInfor = lazy(() => import('../layout/Admin/BrokersInformation/Broker_info'));
const ChartDetail = lazy(() => import('../layout/Admin/ChartInformation/Chart_info'));
const Faq = lazy(() => import('../layout/Admin/Faq/Faq'));
const Starclients = lazy(() => import('../layout/Admin/Clients/Starclients/Starclients'));
const ReferralPage = lazy(() => import('../layout/Admin/Profile/ReferralPage'));
const Plans = lazy(() => import('../layout/Admin/Service/Plans/Plans'));
const Addplans = lazy(() => import('../layout/Admin/Service/Plans/Addplan'));
const TradeHistory1 = lazy(() => import("../layout/Admin/TradeDetails/TradeHistory/OrderHistory.js"));
const Makecall = lazy(() => import('../layout/Comman/Make/Makecall.js'));
const MakeCallPendingPosition = lazy(() => import('../layout/Comman/Make/MakeCallPendingPosition.js'));
const Settings = lazy(() => import('../layout/Admin/Profile/Settings'));
const Holdings = lazy(() => import('../layout/Admin/TradeDetails/TradeHistory/Holdings.js'));


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
            <Suspense fallback={<Loading/>}>
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
                <Route exact path="/makecall" element={<Makecall />} />
                <Route exact path="/makecallpendingposition" element={<MakeCallPendingPosition />} />
                <Route exact path="/tradehistory1" element={<TradeHistory1 />} />
                <Route exact path="/settings" element={<Settings />} />
                <Route exact path="/holdingshistory" element={<Holdings />} />

            </Routes>
            </Suspense>
            {location.pathname !== "/admin" && location.pathname !== "/admin/*" ? <Footer /> : null}

        </>
    )
}

export default Admin