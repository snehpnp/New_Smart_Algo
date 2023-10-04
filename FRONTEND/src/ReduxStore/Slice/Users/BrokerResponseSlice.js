import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { DispatchLogin } from "../../../Layout/Auth/Login";
import { GET_BROKER_RESPONSE,Update_broker_response } from "../../../Service/user.service";


export const Get_Broker_Response = createAsyncThunk("user/brokerresponse", async (data) => {
    const { _id, token } = data
    console.log(data);
    try {
        const res = await GET_BROKER_RESPONSE({ _id: _id }, token);
        return await res;
    } catch (err) {
        return err;
    }
});


export const UpdateBrokerResponse = createAsyncThunk("user/brokerresponse", async (data) => {
    const { user_id,OrderId, token } = data
    // console.log(data);
    try {
        const res = await Update_broker_response({ user_id: user_id ,OrderId:OrderId}, token);
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
        brokerReponse: [],
        status: false
    },

    recuders: {},
    extraReducers: {

        [Get_Broker_Response.pending]: (state, { payload }) => {
            // state.isLoading = false;
            // return { ...state, get_dashboard: [], isLoading: true };
        },
        [Get_Broker_Response.fulfilled]: (state, { payload }) => {
            // state.isLoading = false;
            return { ...state, brokerReponse: payload, isLoading: false };
        },
        [Get_Broker_Response.rejected]: (state, action) => {
            // return { ...state, get_dashboard: action, isLoading: false };
        },

    },
});




export default BrokerResponseSlice;
