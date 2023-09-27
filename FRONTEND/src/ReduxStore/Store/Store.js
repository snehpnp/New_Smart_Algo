import { configureStore } from "@reduxjs/toolkit";

//AUTH SLICE
import AuthSlice from "../Slice/Auth/AuthSlice";
import ThemeSlice from "../Slice/ThemeSlice"
import CommonSlice from "../Slice/Common/commoSlice"

// SUPERADMIN SLICE

import SuperAdminSlice from "../Slice/Superadmin/SuperAdminSlice"
import ApiCreateInfoSlice from "../Slice/Superadmin/ApiCreateInfoSlice"

import SubadminSlice from "../Slice/Subadmin/Subadminslice";

//  ADMIN SLICE
import AdminSlice from "../Slice/Admin/AdminSlice";
import GroupServiceSlice from "../Slice/Admin/GroupServiceSlice";
import StrategyServiceSlice from "../Slice/Admin/StrategySlice";
import AdminUserSlice from "../Slice/Admin/userSlice";
import SignalsSlice from "../Slice/Admin/SignalsSlice";
import TradehistorySlice from "../Slice/Admin/TradehistorySlice";
import AdminDashboardSlice from "../Slice/Admin/DashboardSlice";
import AdminHelpSlice from "../Slice/Admin/AdminHelpSlice";
import LicenceSlice from "../Slice/Admin/LicenceSlice";
import SystemSlice from "../Slice/Admin/SystemSlice";





//  DASHBOARD SLICE
import DashboardSlice from "../Slice/Users/DashboardSlice";
import StrategyDescSlice from "../Slice/Users/StrategySlice";
import ClientHelpSlice from "../Slice/Users/ClientHelpSlice";











const store = configureStore({
  reducer: {
    AuthSlice: AuthSlice.reducer,
    ThemeSlice: ThemeSlice.reducer,
    CommonSlice: CommonSlice.reducer,
    SuperAdminSlice: SuperAdminSlice.reducer,
    ApiCreateInfoSlice: ApiCreateInfoSlice.reducer,
    AdminSlice: AdminSlice.reducer,
    SubadminSlice: SubadminSlice.reducer,
    GroupServiceSlice: GroupServiceSlice.reducer,
    StrategyServiceSlice: StrategyServiceSlice.reducer,
    AdminUserSlice: AdminUserSlice.reducer,
    SignalsSlice: SignalsSlice.reducer,
    TradehistorySlice: TradehistorySlice.reducer,
    DashboardSlice: DashboardSlice.reducer,
    StrategyDescSlice: StrategyDescSlice.reducer,
    AdminDashboardSlice: AdminDashboardSlice.reducer,
    ClientHelpSlice: ClientHelpSlice.reducer,
    AdminHelpSlice: AdminHelpSlice.reducer,
    LicenceSlice: LicenceSlice.reducer,
    SystemSlice: SystemSlice.reducer,
  },
});

export default store;
