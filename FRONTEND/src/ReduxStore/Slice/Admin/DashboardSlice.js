import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { DispatchLogin } from "../../../Layout/Auth/Login";
import { GET_DASHBOARD_COUNT, GET_BROKER_INFORMATION } from "../../../Service/admin.service";



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


const DashboardSlice = createSlice({
    name: "DashboardSlice",
    initialState: {
        isLoading: false,
        isError: false,
        status: false,
        dashboard: [],
        brokerinfo: [],


    },

    recuders: {},
    extraReducers: {

        [Get_Dashboard_Count.fulfilled]: (state, { payload }) => {
            return { ...state, dashboard: payload, isLoading: false };
        },
        [GET_BROKER_INFORMATIONS.fulfilled]: (state, { payload }) => {
            return { ...state, brokerinfo: payload, isLoading: false };
        },
    },
});



export default DashboardSlice;
