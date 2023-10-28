import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { DispatchLogin } from "../../../Layout/Auth/Login";
import { GET_OPTION_SYMBOLS_EXPIRY, GET_OPTION_ALL_ROUND_TOKEN, GET_PANEL_KEY, GET_OPTION_SYMBOLS } from "../../../Service/common.service";


export const Get_Option_Symbols = createAsyncThunk("get/option_symbols", async (data) => {
    try {
        const res = await GET_OPTION_SYMBOLS(data);
        return await res;
    } catch (err) {
        return err;
    }
});

export const Get_Option_Symbols_Expiry = createAsyncThunk("/get/option_symbols", async (apireq) => {

    const { req, token } = apireq

    try {
        const res = await GET_OPTION_SYMBOLS_EXPIRY({ symbol: req }, token);
        return await res;
    } catch (err) {
        return err;
    }
});

export const Get_Option_All_Round_token = createAsyncThunk("/get/token", async (apireq, token) => {
    try {
        const res = await GET_OPTION_ALL_ROUND_TOKEN(apireq, token);
        return await res;
    } catch (err) {
        return err;
    }
});
export const Get_Panel_key = createAsyncThunk("/get/key", async (apireq, token) => {
    try {
        const res = await GET_PANEL_KEY(apireq, token);
        return await res;
    } catch (err) {
        return err;
    }
});



const OptionChainSlice = createSlice({
    name: "OptionChainSlice",
    initialState: {
        isLoading: false,
        isError: false,
        symbolls: [],
        symbol_expiry: [],
        Option_Token: [],
        panel_key: [],
    },

    recuders: {},
    extraReducers: {
        [Get_Option_Symbols.fulfilled]: (state, { payload }) => {
            return { ...state, symbolls: payload, isLoading: false };
        },
        [Get_Option_Symbols_Expiry.fulfilled]: (state, { payload }) => {
            return { ...state, symbol_expiry: payload, isLoading: false };
        },
        [Get_Option_All_Round_token.fulfilled]: (state, { payload }) => {
            return { ...state, Option_Token: payload, isLoading: false };
        },
        [Get_Panel_key.fulfilled]: (state, { payload }) => {
            return { ...state, panel_key: payload, isLoading: false };
        },
    }
})


export default OptionChainSlice;
