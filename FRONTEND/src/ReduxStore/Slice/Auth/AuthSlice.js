import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { DispatchLogin } from "../../../Layout/Auth/Login";
import { SIGN_IN_USER,SIGN_UP_USER, VARIFY_USER_DEVICE, LOG_OUT_USER, SET_THEME_DETAILS, RESET_PASSWORD, UPDATE_PASSWORD, FORGET_PASSWORD, GET_PANEL_INFORMATION, OTP_SEND_USEHERE, LOGOUT_FROM_OTHER_DEVICE } from "../../../Service/auth.service";



export const SignIn = createAsyncThunk("DispatchLogin", async (data) => {
  try {
    const res = await SIGN_IN_USER(data);
    return await res;
  } catch (err) {
    return err;
  }
});

export const SignUpUser = createAsyncThunk("DispatchSignUp", async (data) => {
  try {
    const res = await SIGN_UP_USER(data);
     
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


export const get_theme_details = createAsyncThunk("/get/theme", async (data) => {
  try {
    const res = await SET_THEME_DETAILS(data)
    return res;
  }
  catch (err) {
    return err;
  }
});

//  Forget Password
export const Forget_Password = createAsyncThunk("/forget/password", async (data) => {
  try {
    const res = await FORGET_PASSWORD(data)
    return res;
  }
  catch (err) {
    throw err;
  }
});

//  Forget Password
export const Update_Password = createAsyncThunk("/update/password", async (data) => {
  try {
    const res = await UPDATE_PASSWORD(data)
    return res;
  }
  catch (err) {
    return err;
  }
});


//  Forget Password
export const Reset_Password = createAsyncThunk("/reset/password", async (data) => {
  try {
    const res = await RESET_PASSWORD(data)
    return res;
  }
  catch (err) {
    return err;
  }
});


//  Forget Password
export const Get_Panel_Informtion = createAsyncThunk("/get/panelinfo", async (data) => {
  try {
    const res = await GET_PANEL_INFORMATION(data)
    return res;
  }
  catch (err) {
    return err;
  }
});

//  OTP_SEND_USEHERE
export const OTP_SEND_USEHERES = createAsyncThunk("/session/clear", async (data) => {
  try {
    const res = await OTP_SEND_USEHERE(data)
    return res;
  }
  catch (err) {
    return err;
  }
});
//  OTP_SEND_USEHERE
export const Logout_From_Other_Device = createAsyncThunk("/session/clear", async (data) => {
  try {
    const res = await LOGOUT_FROM_OTHER_DEVICE(data)
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
    userlogout: [],
    getheme: [],
    forgetpassword: [],
    updatepassword: [],
    resetpassword: [],
    panel_details: [],
    otpStore: [],
    logout: []
  },

  recuders: {},
  extraReducers: {
    [SignIn.pending]: (state, action) => {
      
    },
    [SignIn.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      return { ...state, logdatails: payload };
    },
    [SignIn.rejected]: (state, action) => {
    
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
    [get_theme_details.fulfilled]: (state, { payload }) => {
      return { ...state, getheme: payload, isLoading: false };
    },
    [get_theme_details.rejected]: (state, action) => {
      return { ...state, getheme: action, isLoading: false };
    },
    [Forget_Password.fulfilled]: (state, { payload }) => {
      return { ...state, forgetpassword: payload, isLoading: false };
    },
    [OTP_SEND_USEHERES.fulfilled]: (state, { payload }) => {
      return { ...state, otpStore: payload, isLoading: false };
    },
    [Update_Password.fulfilled]: (state, { payload }) => {
      return { ...state, updatepassword: payload, isLoading: false };
    },
    // [Update_Password.rejected]: (state, action) => {
    //   return { ...state, updatepassword: action, isLoading: false };
    // },
    [Reset_Password.fulfilled]: (state, { payload }) => {
      return { ...state, resetpassword: payload, isLoading: false };
    },
    [Logout_From_Other_Device.fulfilled]: (state, { payload }) => {
      return { ...state, logout: payload, isLoading: false };
    },
    [Reset_Password.rejected]: (state, action) => {
      return { ...state, resetpassword: action, isLoading: false };
    },
  },

  [Get_Panel_Informtion.fulfilled]: (state, { payload }) => {
    return { ...state, panel_details: payload, isLoading: false };
  },

   
});

// export const {ganpat} = HomeScreenSlice.actions
export default AuthSlice;
