import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { DispatchLogin } from "../../../Layout/Auth/Login";
import { GET_OPTION_SYMBOLS_EXPIRY, GET_OPTION_ALL_ROUND_TOKEN, UPDATE_SIGNALS, GET_OPEN_POSITION, GET_PANEL_KEY, GET_OPTION_SYMBOLS } from "../../../Service/common.service";


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


export const Get_Open_Position = createAsyncThunk("/get/oper_position", async (apireq, token) => {
    try {
        const res = await GET_OPEN_POSITION(apireq, token);
        return await res;
    } catch (err) {
        return err;
    }
});

export const Update_Signals = createAsyncThunk("/update/signals", async (apireq) => {
    const { data, token } = apireq
    try {
        const res = await UPDATE_SIGNALS({ data: data }, token);
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
        open_position: [],
        update_signals: [],
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
        [Get_Open_Position.fulfilled]: (state, { payload }) => {
            return { ...state, open_position: payload, isLoading: false };
        },
        [Update_Signals.fulfilled]: (state, { payload }) => {
            return { ...state, update_signals: payload, isLoading: false };
        },
    }
})


export default OptionChainSlice;
