import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./authReducer/authReducer";
import { errorReducer } from "./errorReducer/errorReducer";
import { productReducer } from "./productReducer/productReducer";
import { cartReducer } from "./cartReducer/cartReducer";
import { loadingReducer } from "./loaderReducer/loaderReducer";
import { orderReducer } from "./orderReducer/orderReducer";

const store = configureStore({
    reducer:{
        authReducer,
        productReducer,
        cartReducer,
        loadingReducer,
        orderReducer,
        errorReducer
    }
});


export default store;