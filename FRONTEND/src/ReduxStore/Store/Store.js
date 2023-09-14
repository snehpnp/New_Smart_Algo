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


//  DASHBOARD SLICE
import DashboardSlice from "../Slice/Users/DashboardSlice";











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
    DashboardSlice: DashboardSlice.reducer
  },
});

export default store;
