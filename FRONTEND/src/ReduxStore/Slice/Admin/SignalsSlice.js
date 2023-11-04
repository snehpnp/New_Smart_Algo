

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { DispatchLogin } from "../../../Layout/Auth/Login";
import { GET_ALL_SERVICE } from "../../../Service/admin.service";



export const Get_All_Signals = createAsyncThunk("admin/getallsignals", async (apireq) => {

    const { startDate, token } = apireq
    try {
        const res = await GET_ALL_SERVICE({ startDate: startDate }, token);

        return await res;
    } catch (err) {
        return err;
    }
});



const SignalsSlice = createSlice({
    name: "SignalsSlice",
    initialState: {
        isLoading: false,
        isError: false,
        status: false,
        all_signals: [],

    },
    reducers: {}, // Define any reducers here if needed
    extraReducers: {
        [Get_All_Signals.fulfilled]: (state, { payload }) => {
            return { ...state, all_signals: payload, isLoading: false };
        },

        // [Get_All_Service_for_Client.fulfilled]: (state, { payload }) => {
        //     return { ...state, service_data: payload, isLoading: false };
        //   },
    },
});

export default SignalsSlice;



