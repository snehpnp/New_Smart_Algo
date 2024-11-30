import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GET_ALL_SERVICS ,GET_ALL_Catagory ,GET_EXPIRY_BY_SCRIPT,GET_ALL_STRIKE_PRICE ,GET_STRATEGY_DATA ,GET_TOKEN_BY_SOCKET ,GET_LIVE_DATA_SESSION ,ADD_DATA_MAKECALL_ABR ,GET_DATA_MAKECALL_ABR ,DELETE_DATA_MAKECALL_ABR,UPDATE_DATA_MAKECALL_ABR} from "../../../../Service/Comman/Makecall/make.service";

export const getAllServices = createAsyncThunk(
  "make/ServiceByCatagory",
  async (data) => {
    try {
      const {req,token} = data
      const res = await GET_ALL_SERVICS(req,token);
      return res;
    } catch (err) {
      throw err;
    }
  }
);

export const getCatogries = createAsyncThunk(
    "make/allCatagory",
    async (data) => {
      try {
        const {req,token} = data
        
        const res = await GET_ALL_Catagory(req,token);
        return res;
      } catch (err) {
        throw err;
      }
    }
  );

export const getexpirymanualtrade = createAsyncThunk(
    "make/getexpirymanualtrade",
    async (data) => {
      try {
        const {req,token} = data
       
        const res = await GET_EXPIRY_BY_SCRIPT(req,token);
        return res;
      } catch (err) {
        throw err;
      }
    }
  );


 export const getAllStrikePriceApi = createAsyncThunk(
    "make/getAllStrikePriceApi",
    async (data) => {
      try {
        const {req,token} = data

        const res = await GET_ALL_STRIKE_PRICE(req,token);
        return res;
      } catch (err) {
        throw err;
      }
    }
  );

  export const getStrategyData = createAsyncThunk(
    "make/getStrategyData",
    async (data) => {
      try {
        const {req,token} = data
       
        const res = await GET_STRATEGY_DATA(req,token);
        return res;
      } catch (err) {
        throw err;
      }
    }
  );

  export const gettokenbysocket = createAsyncThunk(
    "make/gettokenbysocket",
    async (data) => {
      try {
        const {req,token} = data

        const res = await GET_TOKEN_BY_SOCKET(req,token);
        return res;
      } catch (err) {
        throw err;
      }
    }
  );

  export const GetBrokerLiveDatas = createAsyncThunk(
    "make/LiveDataSession",
    async (data) => {
      try {
        const {req,token} = data
       
        const res = await GET_LIVE_DATA_SESSION(req,token);
        return res;
      } catch (err) {
        throw err;
      }
    }
  );

 
  // Add data above below range
  export const AddDataAboveBelowRange = createAsyncThunk(
    "make/AddDataAboveBelowRange",
    async (data) => {
      try {
        const {req,token} = data
       
        const res = await ADD_DATA_MAKECALL_ABR(req,token);
        return res;
      } catch (err) {
        throw err;
      }
    }
  );

  // Get data above below range
  export const GetDataAboveBelowRange = createAsyncThunk(
    "make/GetDataAboveBelowRange",
    async (data) => {
      try {
        const {req,token} = data
       
        const res = await GET_DATA_MAKECALL_ABR(req,token);
        return res;
      } catch (err) {
        throw err;
      }
    }
  );


  // Get Delete above below range
  export const DeleteDataMakeCall = createAsyncThunk(
    "make/DeleteDataMakeCall",
    async (data) => {
      try {
        const {req,token} = data
       
        const res = await DELETE_DATA_MAKECALL_ABR(req,token);
        return res;
      } catch (err) {
        throw err;
      }
    }
  );

  // Get Update above below range
  export const UpdateDataMakeCall = createAsyncThunk(
    "make/UpdateDataMakeCall",
    async (data) => {
      try {
        const {req,token} = data
       
        const res = await UPDATE_DATA_MAKECALL_ABR(req,token);
        return res;
      } catch (err) {
        throw err;
      }
    }
  );


const GrouoServicesSlice = createSlice({
  name: "SystemSlice",
  initialState: {
    isLoading: false,
    isError: false,
    AllgroupService: null,
    Allcategaory: null,
    AllGetScriptExpiry: null,
    AllGetStrikePrice: null,
    AllStrategyData: null,
    AllGetTokenBySocket: null,
    AllBrokerLiveData: null,
    AddDataAboveBelowRangeData:null,
    GetDataAboveBelowRangeData:null,
    DeleteDataAboveBelowRangeData:null,
    UpdateDataAboveBelowRangeData:null,

  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllServices.pending, (state, action) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getAllServices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.AllgroupService = action.payload;
      })
      .addCase(getAllServices.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })


      .addCase(getCatogries.pending, (state, action) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getCatogries.fulfilled, (state, action) => {
        state.isLoading = false;
        state.Allcategaory = action.payload;
      })
      .addCase(getCatogries.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })


      .addCase(getexpirymanualtrade.pending, (state, action) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getexpirymanualtrade.fulfilled, (state, action) => {
        state.isLoading = false;
        state.AllGetScriptExpiry = action.payload;
      })
      .addCase(getexpirymanualtrade.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })

      .addCase(getAllStrikePriceApi.pending, (state, action) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getAllStrikePriceApi.fulfilled, (state, action) => {
        state.isLoading = false;
        state.AllGetStrikePrice = action.payload;
      })
      .addCase(getAllStrikePriceApi.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })


      .addCase(getStrategyData.pending, (state, action) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getStrategyData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.AllStrategyData = action.payload;
      })
      .addCase(getStrategyData.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })

      .addCase(gettokenbysocket.pending, (state, action) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(gettokenbysocket.fulfilled, (state, action) => {
        state.isLoading = false;
        state.AllGetTokenBySocket = action.payload;
      })
      .addCase(gettokenbysocket.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })

      .addCase(GetBrokerLiveDatas.pending, (state, action) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(GetBrokerLiveDatas.fulfilled, (state, action) => {
        state.isLoading = false;
        state.AllBrokerLiveData = action.payload;
      })
      .addCase(GetBrokerLiveDatas.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })

      .addCase(AddDataAboveBelowRange.pending, (state, action) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(AddDataAboveBelowRange.fulfilled, (state, action) => {
        state.isLoading = false;
        state.AddDataAboveBelowRangeData = action.payload;
      })
      .addCase(AddDataAboveBelowRange.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })

      .addCase(GetDataAboveBelowRange.pending, (state, action) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(GetDataAboveBelowRange.fulfilled, (state, action) => {
        state.isLoading = false;
        state.GetDataAboveBelowRangeData = action.payload;
      })
      .addCase(GetDataAboveBelowRange.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })

      .addCase(DeleteDataMakeCall.pending, (state, action) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(DeleteDataMakeCall.fulfilled, (state, action) => {
        state.isLoading = false;
        state.DeleteDataAboveBelowRangeData = action.payload;
      })
      .addCase(DeleteDataMakeCall.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })

      .addCase(UpdateDataMakeCall.pending, (state, action) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(UpdateDataMakeCall.fulfilled, (state, action) => {
        state.isLoading = false;
        state.UpdateDataAboveBelowRangeData = action.payload;
      })
      .addCase(UpdateDataMakeCall.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      });

      

  },
});

export default GrouoServicesSlice;
