import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GetBrokerData } from "../../../Service/Comman/Optionchain";

import { GetUserInfo, TRADING_OFF_BTN ,ProfileData,updateprofiledata,ProfileuserId,ProfileActive,UpdateUserBrokerInfo} from "../../../Service/Comman/comman";

export const Userinfo = createAsyncThunk(
    "get/userinfo",
    async (data) => {

        try {
            const res = await GetUserInfo(data);
            return res;
        } catch (err) {
            throw err;
        }
    }
);

export const Trading_Off_Btn = createAsyncThunk('tradingoff',
    async (data) => {
        try {
            const res = await TRADING_OFF_BTN(data);
            return res;
        } catch (err) {
            throw err
        }
    })


export const GetBrokerDatas = createAsyncThunk(
    "get/brokercredentail",
    async (data) => {
        
        try {
            const res = await GetBrokerData(data);
            return res;
        } catch (err) {
            throw err;
        }
    }
);




// profile image update

export const ProfilImage = createAsyncThunk(
    "ProfileImagedata",
    async (data) => {
        
        try {
            const res = await ProfileData(data);
            return res;
        } catch (err) {
            throw err;
        }
    }
);


// update profile data

export const ProfileUpdatedata = createAsyncThunk(
    "updateProfile",
    async (data) => {
        
        try {
            const res = await updateprofiledata(data);
            return res;
        } catch (err) {
            throw err;
        }
    }
);


/// profile info match by user id 


export const profiledatauserId = createAsyncThunk(
    "profileId",
    async (data) => {
        
        try {
            const res = await ProfileuserId(data);
            return res;
        } catch (err) {
            throw err;
        }
    }
);



///profile active status 

export const ActiveProfile = createAsyncThunk(
    "Profilestatus",
    async (data) => {
        
        try {
            const res = await ProfileActive(data);
            return res;
        } catch (err) {
            throw err;
        }
    }
);




export const UpdateUserBrokerInfoData = createAsyncThunk(
    "user/update/brokerinfo",
    async (data) => {
        
        try {
            const res = await UpdateUserBrokerInfo(data);
            return res;
        } catch (err) {
            throw err;
        }
    }
);



const Userinfo1Slice = createSlice({
    name: "UserinfoSlice",
    initialState: {
        isLoading: false,
        isError: false,
        userInfo: null,
        tradingoff: null,
        ProfilImage:null,
        ProfileUpdatedata:null,
        profiledatauserId:null,
        ActiveProfile:null,

    },
    reducers: {},
    extraReducers: (builder) => {

        builder
            .addCase(Userinfo.pending, (state, action) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(Userinfo.fulfilled, (state, action) => {
                state.isLoading = false;
                state.userInfo = action.payload
            })
            .addCase(Userinfo.rejected, (state, action) => {

                state.isLoading = false;
                state.isError = true;
            })
            .addCase(GetBrokerDatas.pending, (state, action) => {

                state.isLoading = true;
                state.isError = false;
            })
            .addCase(GetBrokerDatas.fulfilled, (state, action) => {

                state.isLoading = false;
            })
            .addCase(GetBrokerDatas.rejected, (state, action) => {

                state.isLoading = false;
                state.isError = true;
            })

            .addCase(Trading_Off_Btn.fulfilled, (state, action) => {
                state.isLoading = false;
                state.tradingoff = action.payload
            }).addCase(ProfilImage.fulfilled, (state, action) => {
                state.isLoading = false;
                state.ProfilImage = action.payload
            }).addCase(ProfilImage.pending, (state, action) => {

                state.isLoading = true;
                state.isError = false;
            }).addCase(ProfilImage.rejected, (state, action) => {

                state.isLoading = false;
                state.isError = true;
            }).addCase(ProfileUpdatedata.fulfilled, (state, action) => {
                state.isLoading = false;
                state.ProfileUpdatedata = action.payload
            }).addCase(ProfileUpdatedata.pending, (state, action) => {

                state.isLoading = true;
                state.isError = false;
            }).addCase(ProfileUpdatedata.rejected, (state, action) => {

                state.isLoading = false;
                state.isError = true;
            }).addCase(profiledatauserId.fulfilled, (state, action) => {
                state.isLoading = false;
                state.profiledatauserId = action.payload
            }).addCase(profiledatauserId.pending, (state, action) => {

                state.isLoading = true;
                state.isError = false;
            }).addCase(profiledatauserId.rejected, (state, action) => {

                state.isLoading = false;
                state.isError = true;
            }).addCase(ActiveProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.ActiveProfile = action.payload
            }).addCase(ActiveProfile.pending, (state, action) => {

                state.isLoading = true;
                state.isError = false;
            }).addCase(ActiveProfile.rejected, (state, action) => {

                state.isLoading = false;
                state.isError = true;
            }).addCase(UpdateUserBrokerInfoData.rejected, (state, action) => {

                state.isLoading = false;
                state.isError = true;
            })

    },
});

export default Userinfo1Slice;
