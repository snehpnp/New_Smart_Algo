import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { DispatchLogin } from "../../../Layout/Auth/Login";
import { UPDATE_BROKER_KEYS } from "../../../Service/user.service";


export const Update_Broker_Keys = createAsyncThunk("update/brokerkeys", async (data) => {
    const { req, token } = data

    try {
        const res = await UPDATE_BROKER_KEYS(req, token);
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
        [Update_Broker_Keys.rejected]: (state, action) => {
            // return { ...state, get_dashboard: action, isLoading: false };
        },

    },
});




export default BrokerUpdateSlice;
