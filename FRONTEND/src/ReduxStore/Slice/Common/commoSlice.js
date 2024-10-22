import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { USER_PROFILE, GET_ALL_SERVICE_FOR_CLIENTS,GET_ALL_SIGNUP_CLIENTS, GET_MESSAGE_BROD,CANCEL_ORDER_BY_ADMIN } from "../../../Service/common.service";


export const User_Profile = createAsyncThunk("get/profile", async (data) => {
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


export const GET_MESSAGE_BRODS = createAsyncThunk("get/messagebrodcast", async (id) => {
    // const { req, token } = apireq

    try {
        const res = await GET_MESSAGE_BROD(id);
        return await res;
    } catch (err) {
        return err;
    }
});


export const CancelOrderReq = createAsyncThunk("cancelorderByAdmin", async (apireq) => {
    const { req, token } = apireq
  
    try {
        const res = await CANCEL_ORDER_BY_ADMIN(req, token);
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
        service_data: [],
        message_brod: []

    },

    recuders: {},
    extraReducers: {
        [User_Profile.pending]: (state) => {
            state.isLoading = true;
        },
        [Get_All_Service_for_Client.pending]: (state) => {
            state.isLoading = true;
        },
        [GET_MESSAGE_BRODS.pending]: (state) => {
            state.isLoading = true;
        },
        [User_Profile.fulfilled]: (state, { payload }) => {
            return { ...state, profiledata: payload, isLoading: false };
        },
        [Get_All_Service_for_Client.fulfilled]: (state, { payload }) => {
            return { ...state, service_data: payload, isLoading: false };
        },
        [GET_MESSAGE_BRODS.fulfilled]: (state, { payload }) => {
            return { ...state, message_brod: payload, isLoading: false };
        },
        [User_Profile.rejected]: (state) => {
            state.isLoading = false;
            state.isError = true;
        },
        [Get_All_Service_for_Client.rejected]: (state) => {
            state.isLoading = false;
            state.isError = true;
        },
        [GET_MESSAGE_BRODS.rejected]: (state) => {
            state.isLoading = false;
            state.isError = true;
        }

    }
})


export default CommonSlice;
