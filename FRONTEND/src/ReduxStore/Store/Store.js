import { configureStore } from "@reduxjs/toolkit";

//AUTH SLICE
import AuthSlice from "../Slice/Auth/AuthSlice";
import ThemeSlice from "../Slice/ThemeSlice"

const store = configureStore({
  reducer: {
    AuthSlice: AuthSlice.reducer,
    ThemeSlice: ThemeSlice.reducer,
  },
});

export default store;
