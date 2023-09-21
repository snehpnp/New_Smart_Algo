import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { DispatchLogin } from "../../../Layout/Auth/Login";
import { STRATEGY_DESCRIPTION } from "../../../Service/user.service";


export const Get_Strategy_Description = createAsyncThunk("user/strat_desc", async (data) => {
    const { _id, token } = data

    try {
        const res = await STRATEGY_DESCRIPTION({ user_id: _id }, token);
        return await res;
    } catch (err) {
        return err;
    }
});

const StrategyDescSlice = createSlice({
    name: "StrategyDescSlice",
    initialState: {
        isLoading: false,
        isError: false,
        strategy: [],
        status: false
    },

    recuders: {},
    extraReducers: {

        [Get_Strategy_Description.pending]: (state, { payload }) => {
            // state.isLoading = false;
            // return { ...state, get_dashboard: [], isLoading: true };
        },
        [Get_Strategy_Description.fulfilled]: (state, { payload }) => {
            // state.isLoading = false;
            return { ...state, strategy: payload, isLoading: false };
        },
        [Get_Strategy_Description.rejected]: (state, action) => {
            // return { ...state, get_dashboard: action, isLoading: false };
        },

    },
});




export default StrategyDescSlice;
