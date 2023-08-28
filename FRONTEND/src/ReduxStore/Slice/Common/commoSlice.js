import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { DispatchLogin } from "../../../Layout/Auth/Login";
import { USER_PROFILE } from "../../../Service/common.service";


export const User_Profile = createAsyncThunk("user/profile", async (data) => {
    try {
        const res = await USER_PROFILE(data);
        return await res;
    } catch (err) {
        return err;
    }
});


const CommonSlice = createSlice({
    name: "CommonSlice",
    initialState: {
        isLoading: false,
        isError: false,
        profiledata: [],
    },

    recuders: {},
    extraReducers: {
        [User_Profile.fulfilled]: (state, { payload }) => {
            return { ...state, profiledata: payload, isLoading: false };
          },
    }
})


export default CommonSlice;
