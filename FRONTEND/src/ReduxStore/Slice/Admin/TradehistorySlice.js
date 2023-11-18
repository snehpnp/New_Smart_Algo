

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { DispatchLogin } from "../../../Layout/Auth/Login";
import { GET_TRADEHISTORY, GET_SEVAN_TRADEHISTORY,GET_ADMIN_TRADING_STATUS } from "../../../Service/admin.service";



export const Get_Tradehisotry = createAsyncThunk("admin/tradhistory", async (apireq) => {

    const { startDate, endDate, service, strategy,type, token } = apireq
    try {
        const res = await GET_TRADEHISTORY({ startDate: startDate, endDate: endDate, service: service, strategy: strategy,type }, token);
        return await res;
    } catch (err) {
        return err;
    }
});


export const Get_Sevan_Tradehisotry = createAsyncThunk("get/entry/tradhistory", async (apireq) => {

    const { startDate, endDate, token } = apireq
    try {
        const res = await GET_SEVAN_TRADEHISTORY({ startDate: startDate, endDate: endDate }, token);

        return await res;
    } catch (err) {
        return err;
    }
});




export const GET_ADMIN_TRADE_STATUS = createAsyncThunk("admin/trading/status", async (broker_name) => {

    try {
        const res = await GET_ADMIN_TRADING_STATUS(broker_name);

        return await res;
    } catch (err) {
        return err;
    }
});



const TradehistorySlice = createSlice({
    name: "TradehistorySlice",
    initialState: {
        isLoading: false,
        isError: false,
        status: false,
        tradehisotry: [],
        tradehisotry_sevan: [],
        trading_status: [],



    },
    reducers: {}, // Define any reducers here if needed
    extraReducers: {
        [Get_Tradehisotry.fulfilled]: (state, { payload }) => {
            return { ...state, tradehisotry: payload, isLoading: false };
        },
        [Get_Sevan_Tradehisotry.fulfilled]: (state, { payload }) => {
            return { ...state, tradehisotry_sevan: payload, isLoading: false };
        },
        [GET_ADMIN_TRADE_STATUS.fulfilled]: (state, { payload }) => {
            return { ...state, trading_status: payload, isLoading: false };
        },

    },
});

export default TradehistorySlice;



