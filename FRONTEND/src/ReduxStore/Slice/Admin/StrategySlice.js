import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { DispatchLogin } from "../../../Layout/Auth/Login";
import { GET_ALL_STRATEGY, GET_STRATEGY_BY_ID, GET_CLIENTS_BY_STRATEG_ID, ADD_STRATEGY, EDIT_STRATEGY_BY_ID, REMOVE_STRATEGY_BY_ID } from "../../../Service/admin.service";



export const Get_All_Strategy = createAsyncThunk("admin/allstrategy", async (apireq) => {

    const { req, token } = apireq
    try {
        const res = await GET_ALL_STRATEGY(req, token);

        return await res;
    } catch (err) {
        return err;
    }
});


export const Get_Strategy_BY_Id = createAsyncThunk("admin/strategy/get", async (apireq) => {

    const { _id, token } = apireq
    try {
        const res = await GET_STRATEGY_BY_ID({ _id: _id }, token);

        return await res;
    } catch (err) {
        return err;
    }
});

export const Get_client_By_strategy_Id = createAsyncThunk("admin/client/get", async (apireq) => {

    const { _id, token } = apireq
    try {
        const res = await GET_CLIENTS_BY_STRATEG_ID({ _id: _id }, token);

        return await res;
    } catch (err) {
        return err;
    }
});

export const Remove_Strategy_BY_Id = createAsyncThunk("admin/strategy/delete", async (apireq) => {

    const { _id, token } = apireq
    try {
        const res = await REMOVE_STRATEGY_BY_ID({ _id: _id }, token);

        return await res;
    } catch (err) {
        return err;
    }
});



export const Edit_Strategy = createAsyncThunk("admin/strategy/edit", async (apireq) => {

    const { req, token } = apireq

console.log("tesdt" , apireq);

    try {
        const res = await EDIT_STRATEGY_BY_ID(req, token);
        return await res;
    } catch (err) {
        return err.data
    }
});



export const Add_Strategy = createAsyncThunk("admin/strategy/add", async (apireq) => {

    const { req, token } = apireq
    try {
        const res = await ADD_STRATEGY(req, token);
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
        allstrategy: [],
        getonestrategy: [],
        removestrategy: [],
        addstrategy: [],
        editstrategy: [],
        clients: [],
    },
    reducers: {},
    // extraReducers: (builder) => {
    //     builder
    //         .addCase(Get_All_Strategy.pending, (state, action) => {
    //             state.isLoading = true;
    //             state.isError = false;
    //         })
    //         .addCase(Add_Strategy.fulfilled, (state, action) => {
    //             state.addstrategy = action.payload;
    //             state.isLoading = false;
    //             state.isError = false;
    //         })
    //         .addCase(Get_All_Strategy.fulfilled, (state, action) => {
    //             state.allstrategy = action.payload;
    //             state.isLoading = false;
    //             state.isError = false;
    //         })
    //         .addCase(Get_Strategy_BY_Id.fulfilled, (state, action) => {
    //             state.getonestrategy = action.payload;
    //             state.isLoading = false;
    //             state.isError = false;
    //         })
    //         .addCase(Remove_Strategy_BY_Id.fulfilled, (state, action) => {
    //             state.removestrategy = action.payload;
    //             state.isLoading = false;
    //             state.isError = false;
    //         });
    // },

    extraReducers: {

        [Get_All_Strategy.fulfilled]: (state, { payload }) => {
            return { ...state, addstrategy: payload, isLoading: false };
        },
        [Get_All_Strategy.fulfilled]: (state, { payload }) => {
            return { ...state, allstrategy: payload, isLoading: false };
        },
        [Get_Strategy_BY_Id.fulfilled]: (state, { payload }) => {
            return { ...state, getonestrategy: payload, isLoading: false };
        },
        [Remove_Strategy_BY_Id.fulfilled]: (state, { payload }) => {
            return { ...state, removestrategy: payload, isLoading: false };
        },
        [Edit_Strategy.fulfilled]: (state, { payload }) => {
            return { ...state, editstrategy: payload, isLoading: false };
        },
        [Get_client_By_strategy_Id.fulfilled]: (state, { payload }) => {
            return { ...state, clients: payload, isLoading: false };
        },
    }
}
);

export default StrategyServiceSlice;



