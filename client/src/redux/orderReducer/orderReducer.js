import { createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import { setError } from "../errorReducer/errorReducer";
import { setLoading, clearLoading} from "../loaderReducer/loaderReducer";
import axios from "axios";

const initialState = {
    orders:[],
    orderLoading:false,
    success:false,
}

//===== asyncThunk get initinal orders ========//
export const getInitialOrdersApiAsync = createAsyncThunk("order/getInitialOrdersApi",
    async(arg, thunkAPI)=>{

        try{
            thunkAPI.dispatch(setLoading());
            const res = await axios.get("/api/orders/getAll", {withCredentials:true});
            //console.log("res for get orders: ", res.data);
            return res.data.orders;


        }catch(error){
            thunkAPI.dispatch(setError(error.response.data.message));
            return thunkAPI.rejectWithValue(error.response.data.message);

        }finally{
            thunkAPI.dispatch(clearLoading());
        }
    }
);


//======= create order asyncThunkApi =============//
export const createOrderApiAsync = createAsyncThunk("order/createOrderApi", 
    async(arg, thunkAPI)=>{
        try{
            thunkAPI.dispatch(setLoading());
            const res = await axios.post("/api/orders/createOrder", {withCredentials:true});
            //console.log("res for create order: ", res.data);

            return res.data.order;

        }catch(error){
            thunkAPI.dispatch(setError(error.response.data.message));
            return thunkAPI.rejectWithValue(error.response.data.message);


        }finally{
            thunkAPI.dispatch(clearLoading());
        }

    }
)



//======= create order resucer slice ======//
const orderSlice = createSlice({
    name:"order",
    initialState:initialState,

    reducers:{
        toggleSuccess:(state, action)=>{
            state.success = false;
        }
    },

    extraReducers:(builder)=>{
        builder

        .addCase(getInitialOrdersApiAsync.pending, (state, action)=>{
            state.orderLoading = true;
        })
        //===== set initail order when order page loading ====//
        .addCase(getInitialOrdersApiAsync.fulfilled, (state, action)=>{
            state.orders = [...action.payload];
            state.orderLoading = false;
        })
        .addCase(getInitialOrdersApiAsync.rejected, (state, action)=>{
            state.orderLoading = false;
        })

        //======= create order in pending state ==========//
        .addCase(createOrderApiAsync.pending, (state, action)=>{
            state.orderLoading = true;
        })
        //===== when order is created successfull add in order array ====//
        .addCase(createOrderApiAsync.fulfilled, (state, action)=>{
            state.orders.unshift(action.payload);
            state.orderLoading = false;
            state.success = true;
        })
          //======= create order in rejecting state ==========//
          .addCase(createOrderApiAsync.rejected, (state, action)=>{
            state.orderLoading = false;
        })


    }
});

export const orderReducer = orderSlice.reducer;
export const orderActions = orderSlice.actions;
export const orderSelector = (state)=>state.orderReducer;