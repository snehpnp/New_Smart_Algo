import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { DispatchLogin } from "../../../Layout/Auth/Login";
import { GET_SIGNALS } from "../../../Service/user.service";


export const Get_Signals = createAsyncThunk("user/tradehistory", async (data) => {
    const { _id, token } = data

    try {
        const res = await GET_SIGNALS({ user_id: _id }, token);
        return await res;
    } catch (err) {
        return err;
    }
});

const BrokerResponseSlice = createSlice({
    name: "BrokerResponseSlice",
    initialState: {
        isLoading: false,
        isError: false,
        tradhistory: [],
        status: false
    },

    recuders: {},
    extraReducers: {

        [Get_Signals.pending]: (state, { payload }) => {
            // state.isLoading = false;
            // return { ...state, get_dashboard: [], isLoading: true };
        },
        [Get_Signals.fulfilled]: (state, { payload }) => {
            // state.isLoading = false;
            return { ...state, tradhistory: payload, isLoading: false };
        },
        [Get_Signals.rejected]: (state, action) => {
            // return { ...state, get_dashboard: action, isLoading: false };
        },

    },
});




export default BrokerResponseSlice;
