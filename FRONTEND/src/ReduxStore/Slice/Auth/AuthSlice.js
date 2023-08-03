import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { DispatchLogin } from "../../../Layout/Auth/Login";
import { SIGN_IN_USER, VARIFY_USER_DEVICE, LOG_OUT_USER } from "../../../Service/auth.service";

export const SignIn = createAsyncThunk("DispatchLogin", async (data) => {
  try {
    const res = await SIGN_IN_USER(data);
    return await res;
  } catch (err) {
    return err;
  }
});

// for check status
export const Verify_User_Device = createAsyncThunk("DispatchDeviceLogin", async (data) => {
  try {
    const res = await VARIFY_USER_DEVICE(data)
    return res;
  }
  catch (err) {
    return err;
  }
});


export const Log_Out_User = createAsyncThunk("DispatchUserLogout", async (data) => {
  try {
    const res = await LOG_OUT_USER(data)
    return res;
  }
  catch (err) {
    return err;
  }
});



const AuthSlice = createSlice({
  name: "AuthSlice",
  initialState: {
    isLoading: false,
    isError: false,
    logdatails: [],
    device_user: [],
    userlogout: []
  },

  recuders: {},
  extraReducers: {
    [SignIn.pending]: (state, action) => {
      console.log("Pending");
    },
    [SignIn.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      return { ...state, logdatails: payload };
    },
    [SignIn.rejected]: (state, action) => {
      console.log("Pending");
    },
    [Verify_User_Device.fulfilled]: (state, { payload }) => {
      // state.isLoading = false;
      return { ...state, device_user: payload, isLoading: false };
    },
    [Verify_User_Device.rejected]: (state, action) => {
      return { ...state, device_user: action, isLoading: false };
    },
    [Log_Out_User.fulfilled]: (state, { payload }) => {
      return { ...state, device_user: payload, isLoading: false };
    },
     [Log_Out_User.rejected]: (state, action) => {
      return { ...state, device_user: action, isLoading: false };
    },
  },
});

// export const {ganpat} = HomeScreenSlice.actions
export default AuthSlice;
