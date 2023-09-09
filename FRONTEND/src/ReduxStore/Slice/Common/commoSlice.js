import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { DispatchLogin } from "../../../Layout/Auth/Login";
import { USER_PROFILE , GET_ALL_SERVICE_FOR_CLIENTS } from "../../../Service/common.service";


export const User_Profile = createAsyncThunk("user/profile", async (data) => {
    try {
        const res = await USER_PROFILE(data);
        return await res;
    } catch (err) {
        return err;
    }
});

export const Get_All_Service_for_Client = createAsyncThunk("user/service1", async (apireq) => {
    const { req, token } = apireq

    try {
        const res = await GET_ALL_SERVICE_FOR_CLIENTS(req, token);
        return await res;
    } catch (err) {
        return err;
    }
});


const CommonSlice = createSlice({
    name: "CommonSlice",
    initialState: {
        isLoading: false,
        isError: false,
        profiledata: [],
        service_data :  []
    },

    recuders: {},
    extraReducers: {
        [User_Profile.fulfilled]: (state, { payload }) => {
            return { ...state, profiledata: payload, isLoading: false };
          },
        [Get_All_Service_for_Client.fulfilled]: (state, { payload }) => {
            return { ...state, service_data: payload, isLoading: false };
          },
    }
})


export default CommonSlice;
