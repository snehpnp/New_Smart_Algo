

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { DispatchLogin } from "../../../Layout/Auth/Login";
import { GET_TRADE_HISTORY } from "../../../Service/user.service";



export const Get_Tradehisotry = createAsyncThunk("user/tradhistory", async (apireq) => {

    const { user_id, startDate, endDate, token } = apireq
    try {
        const res = await GET_TRADE_HISTORY({ user_id: user_id, startDate: startDate, endDate: endDate }, token);
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



