import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { DispatchLogin } from "../../../Layout/Auth/Login";
import { GET_TIMEFRAME , GET_SOURCE } from "../../../Service/common.service";


export const get_time_frame = createAsyncThunk("get/getAlltimeframe", async (data) => {
    try {
        console.log("data -",data)
        const {req,token}=data
        const res = await GET_TIMEFRAME(req,token);
        return await res;
    } catch (err) {
        return err;
    }
});

export const get_source = createAsyncThunk("get_sources", async (data) => {
    try {
        console.log("data -",data)
        const {req,token}=data
        const res = await GET_SOURCE(req,token);
        return await res;
    } catch (err) {
        return err;
    }
});



const MakeStrategy = createSlice({
    name: "MakeStrategy",
    initialState: {
        isLoading: false,
        isError: false,
        timeframe: [],
    },

    recuders: {},
    extraReducers: {
        [get_time_frame.fulfilled]: (state, { payload }) => {
            return { ...state, timeframe: payload, isLoading: false };
        },
        [get_source.fulfilled]: (state, { payload }) => {
            return { ...state, timeframe: payload, isLoading: false };
        },
    }
})


export default MakeStrategy;
