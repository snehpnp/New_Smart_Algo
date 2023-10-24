import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { DispatchLogin } from "../../../Layout/Auth/Login";
import { GET_OPTION_SYMBOLS_EXPIRY, GET_OPTION_SYMBOLS } from "../../../Service/common.service";


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
        const res = await GET_OPTION_SYMBOLS_EXPIRY({ req: "" }, token);
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
        symbol_expiry: []
    },

    recuders: {},
    extraReducers: {
        [Get_Option_Symbols.fulfilled]: (state, { payload }) => {
            return { ...state, symbolls: payload, isLoading: false };
        },
        [Get_Option_Symbols_Expiry.fulfilled]: (state, { payload }) => {
            return { ...state, symbol_expiry: payload, isLoading: false };
        },
    }
})


export default OptionChainSlice;
