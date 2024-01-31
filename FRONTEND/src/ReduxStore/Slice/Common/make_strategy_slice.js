import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { DispatchLogin } from "../../../Layout/Auth/Login";
import { GET_TIMEFRAME , GET_INSTRUMENT ,GET_SOURCE ,GET_COMPARATORS ,ADD_MAKE_STRATEGY ,GET_ALL_MAKE_STRATEGY,DELETE_MAKE_STRATEGY,EDIT_MAKE_STRATEGY,UPDATE_MAKE_STRATEGY,DELETE_MAKE_STRATEGY_SELECTED,GET_CANDLE_DATA} from "../../../Service/common.service";

export const get_candle_data = createAsyncThunk("get/candledata", async (data) => {
    try {
     
        const {req,token}=data
        const res = await GET_CANDLE_DATA(req,token);
        return await res;
    } catch (err) {
        return err;
    }
});

export const get_instrument = createAsyncThunk("add/getservicename", async (data) => {
    try {
    
        const {req,token}=data
        const res = await GET_INSTRUMENT(req,token);
        return await res;
    } catch (err) {
        return err;
    }
});



export const get_time_frame = createAsyncThunk("get/getAlltimeframe", async (data) => {
    try {
      
        const {req,token}=data
        const res = await GET_TIMEFRAME(req,token);
        return await res;
    } catch (err) {
        return err;
    }
});

export const get_source = createAsyncThunk("get_sources", async (data) => {
    try {
    
        const {req,token}=data
        const res = await GET_SOURCE(req,token);
        return await res;
    } catch (err) {
        return err;
    }
});

export const get_comparators = createAsyncThunk("get_comparators", async (data) => {
    try {
      
        const {req,token}=data
        const res = await GET_COMPARATORS(req,token);
        return await res;
    } catch (err) {
        return err;
    }
});

// Make strategy
export const Add_Make_Strategy = createAsyncThunk("AddMakeStartegy", async (data) => {
    try {
       
        const {req,token}=data
        const res = await ADD_MAKE_STRATEGY(req,token);
        return await res;
    } catch (err) {
        return err;
    }
});


export const get_all_make_strategy = createAsyncThunk("GetAllMakeStartegy", async (data) => {
    try {
        const {req,token}=data
        const res = await GET_ALL_MAKE_STRATEGY(req,token);
        return await res;
    } catch (err) {
        return err;
    }
});

export const delete_make_strategy = createAsyncThunk("DeleteMakeStartegy", async (data) => {
    try {
        const {req,token}=data
        const res = await DELETE_MAKE_STRATEGY(req,token);
        return await res;
    } catch (err) {
        return err;
    }
});

export const Edit_Make_Strategy = createAsyncThunk("EditeMakeStartegy", async (data) => {
    try {
        const {req,token}=data
        const res = await EDIT_MAKE_STRATEGY(req,token);
        return await res;
    } catch (err) {
        return err;
    }
});

export const Update_Make_Strategy = createAsyncThunk("UpdateMakeStartegy", async (data) => {
    try {
        const {req,token}=data
        const res = await UPDATE_MAKE_STRATEGY(req,token);
        return await res;
    } catch (err) {
        return err;
    }
});



export const delete_make_strategy_selected = createAsyncThunk("DeleteMakeStartegySelected", async (data) => {
    try {
        const {req,token}=data
        const res = await DELETE_MAKE_STRATEGY_SELECTED(req,token);
        return await res;
    } catch (err) {
        return err;
    }
});








const MakeStrategy = createSlice({
    name: "MakeStrategy",
    initialState: {
        isLoading: false,
        isError: false,
        timeframe: [],
        source: [],
        comparators: [],
        addmakeStrategy: [],
        getmakeStrategy: [],
        deletemakestrategy:[],
        editemakestrategy:[],
        updatemakestrategy:[],
        deletemakestrategySelected:[],
        getinstrument:[],
        getcandledata:[],
    },

    recuders: {},
    extraReducers: {
        [get_time_frame.fulfilled]: (state, { payload }) => {
            return { ...state, timeframe: payload, isLoading: false };
        },
        [get_source.fulfilled]: (state, { payload }) => {
            return { ...state, source: payload, isLoading: false };
        },
        [get_comparators.fulfilled]: (state, { payload }) => {
            return { ...state, comparators: payload, isLoading: false };
        },
        [Add_Make_Strategy.fulfilled]: (state, { payload }) => {
            return { ...state, addmakeStrategy: payload, isLoading: false };
        },
        [get_all_make_strategy.fulfilled]: (state, { payload }) => {
            return { ...state, getmakeStrategy: payload, isLoading: false };
        },
        [delete_make_strategy.fulfilled]: (state, { payload }) => {
            return { ...state, deletemakestrategy: payload, isLoading: false };
        },
        [Edit_Make_Strategy.fulfilled]: (state, { payload }) => {
            return { ...state, editemakestrategy: payload, isLoading: false };
        },
        [Update_Make_Strategy.fulfilled]: (state, { payload }) => {
            return { ...state, updatemakestrategy: payload, isLoading: false };
        },
        [delete_make_strategy_selected.fulfilled]: (state, { payload }) => {
            return { ...state, deletemakestrategySelected: payload, isLoading: false };
        },
        [get_instrument.fulfilled]: (state, { payload }) => {
            return { ...state, getinstrument: payload, isLoading: false };
        },
        [get_candle_data.fulfilled]: (state, { payload }) => {
            return { ...state, getcandledata: payload, isLoading: false };
        },
        
        
        
    }
})


export default MakeStrategy;
