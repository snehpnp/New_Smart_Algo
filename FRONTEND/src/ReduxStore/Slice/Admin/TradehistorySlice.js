

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { DispatchLogin } from "../../../Layout/Auth/Login";
import { GET_TRADEHISTORY } from "../../../Service/admin.service";



export const Get_Tradehisotry = createAsyncThunk("admin/tradhistory", async (apireq) => {

    const { startDate, endDate, token } = apireq
    try {
        const res = await GET_TRADEHISTORY({ startDate: startDate, endDate: endDate }, token);

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

    },
    reducers: {}, // Define any reducers here if needed
    extraReducers: {
        [Get_Tradehisotry.fulfilled]: (state, { payload }) => {
            return { ...state, tradehisotry: payload, isLoading: false };
        },

    },
});

export default TradehistorySlice;



