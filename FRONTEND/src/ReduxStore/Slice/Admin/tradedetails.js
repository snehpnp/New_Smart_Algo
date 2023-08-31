import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { DispatchLogin } from "../../../Layout/Auth/Login";
import { GET_ALL_TRADINGSTATUS} from "../../../Service/admin.service";



export const GET_ALL_TRADING_STATUS = createAsyncThunk("getall/tadingstatus", async (apireq) => {

    const { req, token } = apireq
    try {
        const res = await GET_ALL_TRADINGSTATUS(req, token);
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
        alltradingstatus: [],
        recuders: {},
        extraReducers: {

        
            [GET_ALL_TRADING_STATUS.fulfilled]: (state, { payload }) => {
                return { ...state, alltradingstatus: payload, isLoading: false };
            },
          
        },

    },
});



export default StrategyServiceSlice;
