import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { DispatchLogin } from "../../../Layout/Auth/Login";
import { Sign_In_User } from "../../../Service/auth.service";

export const SignIn = createAsyncThunk("DispatchLogin", async (data) => {
  try {
    const res = await Sign_In_User(data);

    console.log("res", res);
    return await res;
  } catch (err) {
    console.log("error", err);
    // custom error
  }
});

const AuthSlice = createSlice({
  name: "AuthSlice",
  initialState: {
    isLoading: false,
    isError: false,
    logdatails: [],
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
  },
});

// export const {ganpat} = HomeScreenSlice.actions
export default AuthSlice;
