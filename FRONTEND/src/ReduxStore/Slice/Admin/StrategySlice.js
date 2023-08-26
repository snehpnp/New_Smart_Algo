import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { DispatchLogin } from "../../../Layout/Auth/Login";
import { GET_ALL_STRATEGY, GET_STRATEGY_BY_ID, ADD_STRATEGY, REMOVE_STRATEGY_BY_ID } from "../../../Service/admin.service";



export const Get_All_Strategy = createAsyncThunk("admin/allstrategy", async (apireq) => {

    const { req, token } = apireq
    try {
        const res = await GET_ALL_STRATEGY(req, token);

        return await res;
    } catch (err) {
        return err;
    }
});


export const Get_Strategy_BY_Id = createAsyncThunk("admin/strategy/get", async (apireq) => {

    const { _id, token } = apireq
    try {
        const res = await GET_STRATEGY_BY_ID({ _id: _id }, token);

        return await res;
    } catch (err) {
        return err;
    }
});

export const Remove_Strategy_BY_Id = createAsyncThunk("admin/strategy/delete", async (apireq) => {

    const { _id, token } = apireq
    try {
        const res = await REMOVE_STRATEGY_BY_ID({ _id: _id }, token);

        return await res;
    } catch (err) {
        return err;
    }
});



export const Add_Strategy = createAsyncThunk("admin/strategy/add", async (apireq) => {

    const { req, token } = apireq
    try {
        const res = await ADD_STRATEGY(req, token);
        return await res;
    } catch (err) {
        return err.data
    }
});




const StrategyServiceSlice = createSlice({
    name: "StrategyServiceSlice",
    initialState: {
        isLoading: false,
        isError: false,
        status: false,
        allstrategy: [],
        getonestrategy: [],
        removestrategy: [],
        addstrategy: [],
        recuders: {},
        extraReducers: {

            [Get_All_Strategy.pending]: (state, action) => {
                console.log("pending Get_All_Strategy ");
            },
            [Add_Strategy.fulfilled]: (state, { payload }) => {
                return { ...state, addstrategy: payload, isLoading: false };
            },
            [Get_All_Strategy.fulfilled]: (state, { payload }) => {
                return { ...state, allstrategy: payload, isLoading: false };
            },
            [Get_Strategy_BY_Id.fulfilled]: (state, { payload }) => {
                return { ...state, getonestrategy: payload, isLoading: false };
            },
            [Remove_Strategy_BY_Id.fulfilled]: (state, { payload }) => {
                return { ...state, removestrategy: payload, isLoading: false };
            },
        },

    },
});



export default StrategyServiceSlice;
