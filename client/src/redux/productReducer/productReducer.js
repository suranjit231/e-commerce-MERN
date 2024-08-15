import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setError } from "../errorReducer/errorReducer";
import { setLoading, clearLoading } from "../loaderReducer/loaderReducer";

const initialState = {
    loading:false,
    products:[]
}

//======= async getAll products api call =======//
export const getAllProductApiAsync = createAsyncThunk("product/getAllProductApi", 
    async(arg, thunkAPI)=>{
        try{

            thunkAPI.dispatch(setLoading());
            const res = await axios.get("/api/products");
            thunkAPI.dispatch(clearLoading());
           // console.log(res.data.products);
            return res.data.products;

        }catch(error){
            thunkAPI.dispatch(setError("Products not found!"));
            console.log("error fetch products: ", error);
            thunkAPI.dispatch(clearLoading());
            return thunkAPI.rejectWithValue("Products not found");
        }
        
    }
)


//===== delete products api call ===============//
export const deleteProductApiAsync = createAsyncThunk("product/deleteProductApi",
    async(arg, thunkAPI)=>{
        try{

            const { productId } = arg;
            thunkAPI.dispatch(setLoading());
            const res = await axios.delete(`/api/products/${productId}`, {withCredentials:true});
            console.log("res.data for delete products: ", res.data);

            if(res.data?.success){
                return { productId:productId, message: res.data?.message, success:true}
            }


        }catch(error){
            thunkAPI.dispatch(setError(error.response.data.message));
            return thunkAPI.rejectWithValue("Failds to add product.");

        }finally{
            thunkAPI.dispatch(clearLoading());
        }
    }
)


 //===== async get search product api call =====//
export const searchProdctApiAsync = createAsyncThunk("product/searchProduct",
    async(arg, thunkAPI)=>{
        try{
            thunkAPI.dispatch(setLoading());
            const res = await axios.get("/api/products/searchProduct", {
                params: {
                    query: arg.searchQuery,
                }
            });

            thunkAPI.dispatch(clearLoading());
           // console.log("response search api: ", res.data);
          console.log("res.data: ", res.data);


            return res.data.products;

        }catch(error){
            thunkAPI.dispatch(setError("Products not found!"));
            thunkAPI.dispatch(clearLoading());
            return thunkAPI.rejectWithValue("Products not found");
        }
    }
)

//======= filter product async api calls =================//
export const fiterProductApiAsync = createAsyncThunk("product/filterProductApi", 
    async(arg, thunkAPI)=>{
        try{

            thunkAPI.dispatch(clearLoading());
            const res = await axios.get("/api/products/filterProduct", {
                params:{
                    query:arg

                }
            });

            console.log("filter products response: ", res.data);
            thunkAPI.dispatch(clearLoading());
            
    
            return res.data.products;

        }catch(error){
            thunkAPI.dispatch(setError("Products not found!"));
            thunkAPI.dispatch(clearLoading());
            return thunkAPI.rejectWithValue("Products not found.");
        }
    }
)


//======= add new product api call ============//
export const addProductApiAsync = createAsyncThunk("product/addProductApi", 
    async(arg, thunkAPI)=>{
       try{
            thunkAPI.dispatch(setLoading());

            const response = await axios.post("/api/products/addProduct", arg, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    },

                    withCredentials:true
            });
            if (response.status === 201) {
    
                console.log(response.data.product);
               return response.data.product;
            }

       }catch(error){
            thunkAPI.dispatch(setError(error.response.data.message));
            return thunkAPI.rejectWithValue("Failds to add product.");

       }finally{
            thunkAPI.dispatch(clearLoading());
       }
        
    }
)


//===== create productSlice for state management =========//
const productSlice = createSlice({
    name:"product",
    initialState:initialState,

    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(getAllProductApiAsync.fulfilled, (state, action)=>{
            state.products = [...action.payload];
            
        })
        //===== set search products =====//
        .addCase(searchProdctApiAsync.fulfilled, (state, action)=>{
            state.products = [...action.payload]
        })
        //====== filter products set state ======//
        .addCase(fiterProductApiAsync.fulfilled, (state, action)=>{
            state.products = [...action.payload]
            
        })
        //====== add new Products ==============//
        .addCase(addProductApiAsync.fulfilled, (state, action)=>{
            state.products.push(action.payload);
        })

        //==== delete products =================//
        .addCase(deleteProductApiAsync.fulfilled, (state, action)=>{
            const {productId} = action.payload;
            
            const products = state.products.filter((prod)=>prod._id !== productId);
            state.products = [...products];
        })
        
        

    }
});


export const productReducer = productSlice.reducer;
export const productSelector = (state)=>state.productReducer;
export const producAction = productSlice.actions;