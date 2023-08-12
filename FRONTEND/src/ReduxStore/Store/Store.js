import { configureStore } from "@reduxjs/toolkit";

//AUTH SLICE
import AuthSlice from "../Slice/Auth/AuthSlice";
import ThemeSlice from "../Slice/ThemeSlice"
import CommonSlice from "../Slice/Common/commoSlice"

// SUPERADMIN SLICE

import SuperAdminSlice from "../Slice/Superadmin/SuperAdminSlice"






const store = configureStore({
  reducer: {
    AuthSlice: AuthSlice.reducer,
    ThemeSlice: ThemeSlice.reducer,
    CommonSlice: CommonSlice.reducer,
    SuperAdminSlice: SuperAdminSlice.reducer,
  },
});

export default store;
