import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { DispatchLogin } from "../../../Layout/Auth/Login";
import { GET_DASHBOARD_COUNT, UPDATE_BROKER_INFORMATION, GET_BROKER_INFORMATION, FIND_BROKER_RESPONSE } from "../../../Service/admin.service";



export const Get_Dashboard_Count = createAsyncThunk("admin/dashboard/count", async (token) => {
    try {
        const res = await GET_DASHBOARD_COUNT(token);
        // console.log("res" ,res);
        return await res;
    } catch (err) {
        return err;
    }
});



export const GET_BROKER_INFORMATIONS = createAsyncThunk("getall/broker_information", async (token) => {
    try {
        const res = await GET_BROKER_INFORMATION(token);
        // console.log("res" ,res);
        return await res;
    } catch (err) {
        return err;
    }
});

export const UPDATE_BROKER_INFORMATIONS = createAsyncThunk("update/broker_information", async (data) => {
    const { req, token } = data


    try {
        const res = await UPDATE_BROKER_INFORMATION(req, token);
        // console.log("res" ,res);
        return await res;
    } catch (err) {
        return err;
    }
});



export const FIND_BROKER_RESPONSES = createAsyncThunk("get/broker_information", async (data) => {
    try {
        const res = await FIND_BROKER_RESPONSE(data);
        // console.log("res" ,res);
        return await res;
    } catch (err) {
        return err;
    }
});

const DashboardSlice = createSlice({
    name: "DashboardSlice",
    initialState: {
        isLoading: false,
        isError: false,
        status: false,
        dashboard: [],
        brokerinfo: [],
        updatebrokerinfo: [],
        Onebrokerinfo: [],



    },

    recuders: {},
    extraReducers: {

        [Get_Dashboard_Count.fulfilled]: (state, { payload }) => {
            return { ...state, dashboard: payload, isLoading: false };
        },
        [GET_BROKER_INFORMATIONS.fulfilled]: (state, { payload }) => {
            return { ...state, brokerinfo: payload, isLoading: false };
        },
        [UPDATE_BROKER_INFORMATIONS.fulfilled]: (state, { payload }) => {
            return { ...state, updatebrokerinfo: payload, isLoading: false };
        },
        [FIND_BROKER_RESPONSES.fulfilled]: (state, { payload }) => {
            return { ...state, Onebrokerinfo: payload, isLoading: false };
        },
    },
});



export default DashboardSlice;
