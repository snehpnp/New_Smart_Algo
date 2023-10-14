import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { DispatchLogin } from "../../../Layout/Auth/Login";
import { UPDATE_BROKER_KEYS, MODIFY_DETAILS } from "../../../Service/user.service";


export const Update_Broker_Keys = createAsyncThunk("update/brokerkeys", async (data) => {
    const { req, token } = data

    try {
        const res = await UPDATE_BROKER_KEYS(req, token);
        return await res;
    } catch (err) {
        return err;
    }
});


export const Modify_Details = createAsyncThunk("update/KEYS", async (data) => {
    const { user_id, req, token } = data

    try {
        const res = await MODIFY_DETAILS({ obj: req, user_id: user_id }, token);
        return await res;
    } catch (err) {
        return err;
    }
});

const BrokerUpdateSlice = createSlice({
    name: "BrokerUpdateSlice",
    initialState: {
        isLoading: false,
        isError: false,
        broker: [],
        modify: [],
        status: false
    },

    recuders: {},
    extraReducers: {

        [Update_Broker_Keys.pending]: (state, { payload }) => {
            // state.isLoading = false;
            // return { ...state, get_dashboard: [], isLoading: true };
        },
        [Update_Broker_Keys.fulfilled]: (state, { payload }) => {
            // state.isLoading = false;
            return { ...state, broker: payload, isLoading: false };
        },
        [Modify_Details.fulfilled]: (state, { payload }) => {
            // state.isLoading = false;
            return { ...state, modify: payload, isLoading: false };
        },
        [Update_Broker_Keys.rejected]: (state, action) => {
            // return { ...state, get_dashboard: action, isLoading: false };
        },

    },
});




export default BrokerUpdateSlice;
