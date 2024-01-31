import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { DispatchLogin } from "../../../Layout/Auth/Login";
import { TRANSACTION_LICENCE, EXPIRED_SOON_USER } from "../../../Service/admin.service";


export const Expired_Soon_User = createAsyncThunk("user/all/helps", async (data) => {
    const { token } = data
    
    try {
        const res = await EXPIRED_SOON_USER({ data: {} }, token);
        return await res;
    } catch (err) {
        return err;
    }
});
export const Transcation_Licence = createAsyncThunk("user/all/helps", async (data) => {
    const { token } = data
    
    try {
        const res = await TRANSACTION_LICENCE({ data: {} }, token);
        return await res;
    } catch (err) {
        return err;
    }
});

const LicenceSlice = createSlice({
    name: "LicenceSlice",
    initialState: {
        isLoading: false,
        isError: false,
        helps: [],
        expired: [],
        transaction_licence: [],
        status: false
    },

    recuders: {},
    extraReducers: {

        [Transcation_Licence.fulfilled]: (state, { payload }) => {
            // state.isLoading = false;
            return { ...state, expired: payload, isLoading: false };
        },
        [Expired_Soon_User.fulfilled]: (state, { payload }) => {
            // state.isLoading = false;
            return { ...state, transaction_licence: payload, isLoading: false };
        },

    },
});




export default LicenceSlice;
