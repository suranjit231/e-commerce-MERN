import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setError } from "../errorReducer/errorReducer"
import axios from "axios";
import { setLoading, clearLoading } from "../loaderReducer/loaderReducer";
import { createOrderApiAsync } from "../orderReducer/orderReducer";

const initialState={
    loading:false,
    carts:[],
}


//====== add cart async api calls =======//
export const addCartApiAsync = createAsyncThunk("cart/addCartApi",
    async(arg, thunkAPI)=>{
        try{

            thunkAPI.dispatch(setLoading())
            const res = await axios.post("/api/carts/addToCart", arg, {withCredentials:true});
            //console.log("res in add to cart.", res.data);
            return res.data.cart;

        }catch(error){
            thunkAPI.dispatch(setError(error.response.data.message));
            thunkAPI.rejectWithValue("Server error");
        }finally {
            thunkAPI.dispatch(clearLoading());
        }
    }
)

//===== setInitial cart items state =======//
export const getInitialCartApiAsync = createAsyncThunk("cart/getInitialCartApi",
    async(arg, thunkAPI)=>{
        try{

           // console.log("get cartApi is called: ")
            thunkAPI.dispatch(setLoading())
            const res = await axios.get("/api/carts/getAllCart", {withCredentials:true});
           // console.log("res for getting initail carts: ", res);
            return res.data.carts;

        }catch(error){
            thunkAPI.dispatch(setError(error.response.data.message));
            thunkAPI.rejectWithValue("Server error");
        }finally {
            thunkAPI.dispatch(clearLoading());
        }
    }
)

//====== increased items in cart =============================//
export const increasedCartItemApiAsync = createAsyncThunk("cart/increasedCartItemApi", 
    async(arg, thunkAPI)=>{
        try{

            const {cartId} = arg;
            //console.log("arg: ", cartId);
            thunkAPI.dispatch(setLoading());
            const res = await axios.put(`/api/carts/increasedCart/${cartId}`, {withCredentials:true});
           // console.log("res for increased in cart: ", res.data);
            return res.data.cart;

        }catch(error){
            thunkAPI.dispatch(setError(error.response.data.message));
            thunkAPI.rejectWithValue("Server error");
        }finally{
            thunkAPI.dispatch(clearLoading());
        }
    }
)

//====== decreased cartItems quantity api call =======//
export const decreasedCartItemsApiAsync = createAsyncThunk("cart/decreasedCartItemsApi", 
    async(arg, thunkAPI)=>{
        try{

            thunkAPI.dispatch(setLoading());
            const {cartId} = arg;
            const res = await axios.put(`/api/carts/decreasedCart/${cartId}`, {withCredentials:true});
             //console.log("res for decreased in cart: ", res.data);
            return cartId;


        }catch(error){
            thunkAPI.dispatch(setError(error.response.data.message));
            thunkAPI.rejectWithValue("Server error");

        }finally{
            thunkAPI.dispatch(clearLoading());
        }
    }
)

//======= removed from cart api calles =============//
export const removedCartApiAsync = createAsyncThunk("cart/removedCartApi",
    async(arg, thunkAPI)=>{
        try{
            thunkAPI.dispatch(setLoading());
            const {cartId} = arg;
            const res = await axios.delete(`/api/carts/removedCart/${cartId}`);
           // console.log("res for delete in cart: ", res.data);

            return cartId;

        }catch(error){
            thunkAPI.dispatch(setError(error.response.data.message));
            thunkAPI.rejectWithValue("Server error.");

        }finally{
            thunkAPI.dispatch(clearLoading());
        }
    }
)




//======= creating cartSlice for managing cart state =========//
const cartSlice = createSlice({
    name:"cart",
    initialState:initialState,

    reducers:{},

    extraReducers:(builder)=>{
        //===== set initial cart if user is loggedin ====//
        builder.addCase(getInitialCartApiAsync.fulfilled, (state, action)=>{
            state.carts = [...action.payload]
        })
        //====== add items in cart =============//
        .addCase(addCartApiAsync.fulfilled, (state, action)=>{
            const existingItemIndex = state.carts.findIndex(item => item._id === action.payload._id);
          
            if (existingItemIndex !== -1) {
                state.carts[existingItemIndex].quantity += action.payload.quantity;
            } else {
                console.log("addCart reducer action.payload: ", action.payload);
                state.carts.push(action.payload);
                console.log("carts in addCart reducer: ", state.carts)
            }

            
          
        })
        //======= increased quantity in cartItems state ========//
        .addCase(increasedCartItemApiAsync.fulfilled, (state, action)=>{
            const existingItemIndex = state.carts.findIndex(item => item._id === action.payload._id);
            if (existingItemIndex !== -1) {
                state.carts[existingItemIndex].quantity = action.payload.quantity;
            }
        })

        //===== decreased quantity in cart ====================//
        .addCase(decreasedCartItemsApiAsync.fulfilled, (state, action)=>{
           state.carts.map((item, i)=>{
                if(item._id===action.payload){
                    if(item.quantity>1){
                        item.quantity -= 1
                    }else{
                        state.carts.splice(i, 1);
                    }
                }

                return item;
           })
        })

        //======= set state fro  delete items from cart ===========//
        .addCase(removedCartApiAsync.fulfilled, (state, action)=>{
            const itemIdx = state.carts.findIndex((item)=>item._id === action.payload);
            if(itemIdx !== -1){
                state.carts.splice(itemIdx, 1);
            }
        })

        //====== clear cart when create order is success =============//
        .addCase(createOrderApiAsync.fulfilled, (state, action)=>{
            state.carts=[]
        })



        
    }
});

export const cartReducer = cartSlice.reducer;
export const cartActions = cartSlice.actions;
export const cartSelector = (state)=>state.cartReducer;