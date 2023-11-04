import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { DispatchLogin } from "../../../Layout/Auth/Login";
import { user_getall_tradingstatus, USER_ACTIVICTY_LOGS } from "../../../Service/user.service";



export const Get_All_TRADINGSTATUS_USER = createAsyncThunk("getall/user/trading_status", async (data) => {
    try {
        const res = await user_getall_tradingstatus(data);
        // console.log("res" ,res);
        return await res;
    } catch (err) {
        return err;
    }
});

export const user_activity_logs = createAsyncThunk("getall/user/actvictylogs", async (data) => {
    try {
        const res = await USER_ACTIVICTY_LOGS(data);
        // console.log("res" ,res);
        return await res;
    } catch (err) {
        return err;
    }
});




const TradingStatusSlice = createSlice({
    name: "TradingStatusSlice",
    initialState: {
        isLoading: false,
        isError: false,
        status: false,
        alltradingstatus: [],
        userlogs: [],
    },

    recuders: {},
    extraReducers: {

        [Get_All_TRADINGSTATUS_USER.pending]: (state, { payload }) => {
            console.log("pending Get_All_TRADINGSTATUS_USER ");
        },
        [Get_All_TRADINGSTATUS_USER.fulfilled]: (state, { payload }) => {
            return { ...state, alltradingstatus: payload, isLoading: false };
        },
        [user_activity_logs.fulfilled]: (state, { payload }) => {
            return { ...state, userlogs: payload, isLoading: false };
        },


    },
});


export default TradingStatusSlice;
