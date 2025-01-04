import React from 'react'
import {  Route, Routes, useLocation } from "react-router-dom";
import Wraper from '../Components/Dashboard/Wraper/Wraper';
import Dashboard from '../layout/Sub_Admin/Dashboard/Dashboard';
import Profile from '../layout/Sub_Admin/Profile/Profile';
import AllClients from '../layout/Sub_Admin/ClientList/ClientList';
import AddClients from '../layout/Sub_Admin/ClientList/Add_Client';
import EditClients from '../layout/Sub_Admin/ClientList/Edit_Client';
import Signals from '../layout/Sub_Admin/Signals/Signals';
import TradeHistory from '../layout/Sub_Admin/TradeHistory/TradeHistory';
import TradingStatus from '../layout/Sub_Admin/Tradingstatus/Tradingstatus';
import HelpCenter from '../layout/Sub_Admin/HelpCenter/HelpCenter';
import ApiCreateInfo1 from '../layout/Admin/ApiCreateInfo/ApiCreateInfo';

// OPTION CHAIN
import Opation_Chain from '../layout/Admin/OptionChain/Opation_Chain';
import Open_Positions from '../layout/Admin/OptionChain/Open_Positions';

// CREATE STRATEGY
import CreateStrategy from '../layout/Admin/CreateStrategy/CreateStrategy';
import AllMakeStrategy from '../layout/Admin/CreateStrategy/AllMakeStrategy';
import EditMakeStrategy from '../layout/Admin/CreateStrategy/EditMakeStrategy';

import Footer from '../Components/Dashboard/Footer/Footer.js'


const Admin = () => {

    const location = useLocation();


    return (
        <>
            {location.pathname !== "/subadmin" && location.pathname !== "/subadmin/*" ? <Wraper /> : null}

            <Routes>
                {/* <> */}
                <Route exact path="/dashboard" element={<Dashboard />} />
                <Route exact path="/profile" element={<Profile />} />
                <Route exact path="/clients" element={<AllClients />} />
                <Route exact path="/client/edit/:id" element={<EditClients />} />
                <Route exact path="/client/add" element={<AddClients />} />
                <Route exact path="/signals" element={<Signals />} />
                <Route exact path="/tradehistory" element={<TradeHistory />} />
                <Route exact path="/tradingstatus" element={<TradingStatus />} />
                <Route exact path="/apicreateinfo" element={<ApiCreateInfo1 />} />
                <Route exact path="/helpcenter" element={<HelpCenter />} />
                <Route exact path="/optionchain" element={<Opation_Chain />} />
                <Route exact path="/openposition" element={<Open_Positions />} />
                <Route exact path="/createstrategy" element={<CreateStrategy />} />
                <Route exact path="/AllMakeStrategy" element={<AllMakeStrategy />} />
                <Route exact path="/MakeStrategy/edit/:id" element={<EditMakeStrategy />} />

            </Routes>

            {location.pathname !== "/subadmin" && location.pathname !== "/subadmin/*" ? <Footer /> : null}

        </>
    )
}

export default Admin