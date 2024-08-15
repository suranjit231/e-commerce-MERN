// redux/authReducer.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setError } from "../errorReducer/errorReducer";
import { setLoading, clearLoading } from "../loaderReducer/loaderReducer";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:5000';

const initialState = {
  isLoggedIn: false,
  isSignup: false,
  user: null,
  loading: false,
};

//======== user signup api call ==============//
export const signupApiAsync = createAsyncThunk(
  "auth/signupApi",
  async (arg, thunkAPI) => {

    try {
        thunkAPI.dispatch(setLoading());
      const res = await axios.post("/api/users/signup", arg);
      return res.data;
    } catch (error) {
      thunkAPI.dispatch(setError(error.response.data.message));
      return thunkAPI.rejectWithValue(error.response.data.message);

    }finally{
      thunkAPI.dispatch(clearLoading());
    }


  }
);

//======== user signin api call ==============//
export const signinApiAsync = createAsyncThunk(
  "auth/signinApi",
  async (arg, thunkAPI) => {
    try {

      thunkAPI.dispatch(setLoading());
      const res = await axios.post("/api/users/signin", arg);

      return res.data;
    } catch (error) {
      thunkAPI.dispatch(setError(error.response.data.message));
      return thunkAPI.rejectWithValue(error.response.data.message);

    }finally{
      thunkAPI.dispatch(clearLoading());
    }


  }
);


//======== user logout api call ==============//
export const logoutApiAsync = createAsyncThunk(
  "auth/logoutAsync",
  async (arg, thunkAPI) => {
    try {

      thunkAPI.dispatch(setLoading());
      const response = await axios.get("/api/users/logout");
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(setError(error.response.data.message));
      return thunkAPI.rejectWithValue(error.response.data.message);

    }finally{
      thunkAPI.dispatch(clearLoading());
    }


  }
);


//======== check user login api call ==============//
export const checkIsLoginAsync = createAsyncThunk("auth/isLoginAsync", 
  async(arg, thunkAPI)=>{
    try{

        thunkAPI.dispatch(setLoading());
      const response = await axios.get("/api/users/isLogin", {withCredentials:true});
      const responseData = response.data;
    //  console.log("response data for checked login: ", responseData);

      if(responseData && responseData.success){
        thunkAPI.dispatch(setAuthState(responseData.user));
      }else{
        thunkAPI.dispatch(setAuthLogout(responseData.user));
      }

    }catch(error){
      thunkAPI.dispatch(setError("server error"));
      return thunkAPI.rejectWithValue("Server error");

    }finally{
      thunkAPI.dispatch(clearLoading());
    }
  }
)


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthState:(state, action)=>{
      state.isLoggedIn = true;
     // console.log("action.payload in auth reducser: ", action.payload);
      state.user = action.payload;
      state.loading = false;
    },

    setAuthLogout:(state, action)=>{
      state.isLoggedIn = false;
      state.user = null;
      state.loading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupApiAsync.fulfilled, (state) => {
        state.isSignup = true;
        
      })
      
      .addCase(signinApiAsync.fulfilled, (state, action) => {

       // console.log("action.payload in auth reducser signup: ", action.payload);
        state.isLoggedIn = true;
        state.user = action.payload.user;
       
      })
     
      .addCase(logoutApiAsync.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.user = null;
       
      })
      
  },
});

export const authReducer = authSlice.reducer;
export const { setAuthState, setAuthLogout } = authSlice.actions;
export const authSelector = (state) => state.authReducer;
