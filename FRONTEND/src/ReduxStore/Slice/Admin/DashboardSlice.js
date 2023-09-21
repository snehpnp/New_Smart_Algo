import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { DispatchLogin } from "../../../Layout/Auth/Login";
import { GET_DASHBOARD_COUNT } from "../../../Service/admin.service";



export const Get_Dashboard_Count = createAsyncThunk("admin/dashboard/count", async (token) => {
    try {
        const res = await GET_DASHBOARD_COUNT( token);
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

    },

    recuders: {},
    extraReducers: {

        [Get_Dashboard_Count.fulfilled]: (state, { payload }) => {
            return { ...state, dashboard: payload, isLoading: false };
        },
    },
});



export default DashboardSlice;
