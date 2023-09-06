import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { DispatchLogin } from "../../../Layout/Auth/Login";
import { user_getall_tradingstatus} from "../../../Service/user.service";



export const Get_All_TRADINGSTATUS_USER = createAsyncThunk("getall/user/trading_status", async (data) => {
    try {
        const res = await user_getall_tradingstatus(data);
        // console.log("res" ,res);
        return await res;
    } catch (err) {
        return err;
    }
});




const UserSlice = createSlice({
    name: "SubadminsSlice",
    initialState: {
        isLoading: false,
        isError: false,
        status: false,
        alltradingstatus: [],    
    },

    recuders: {},
    extraReducers: {

        [Get_All_TRADINGSTATUS_USER.pending]: (state, { payload }) => {
            // state.isLoading = false;
            console.log("pending Get_All_TRADINGSTATUS_USER ");
            // return { ...state, allService: [], isLoading: true };
        },
        [Get_All_TRADINGSTATUS_USER.fulfilled]: (state, { payload }) => {
            // state.isLoading = false;

            return { ...state, alltradingstatus: payload, isLoading: false };
        },
   
    
    },
});


export default UserSlice;
