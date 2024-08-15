import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Home from "./pages/home/Home";
import AuthForm from "./pages/auth/AuthForm";
import Cart from "./pages/cart/Cart";
import Order from "./pages/order/Order";
import { checkIsLoginAsync } from "./redux/authReducer/authReducer";
import { ToastContainer } from "react-toastify";
import ErrorToast from "./components/errorToast";
import ProtectedRoute from "./components/protectRouter";
import ClipLoader from "react-spinners/ClipLoader"; // Assuming you're using ClipLoader
import Admin from "./pages/admin/Admin";
import AdminProtectedRoute from "./components/adminProtected";
import ErrorPage from "./pages/errorPage/ErrorPage";
import ProductsAdmin from "./pages/admin/products/Products";
import ProductForm from "./pages/admin/productForm/ProductForm";
import ProductDetails from "./pages/productDetails/ProductDetails";


function App() {
   
    const dispatch = useDispatch();
    const loading = useSelector((state) => state.authReducer.loading);
    const isLoggedIn = useSelector((state) => state.authReducer.isLoggedIn);

    useEffect(() => {
        // Check if the user is logged in on page load
        dispatch(checkIsLoginAsync());
    }, [dispatch]);

   

    const router = createBrowserRouter([
        {
            path: "/", element: <Navbar />, children: [
                { index: true, element: <Home /> },
                { path: "auth", element: <AuthForm /> },
                { path:"product/details/:productId", element:<ProductDetails />},

                {
                    path: "cart/:userId", element: (
                        <ProtectedRoute>
                            <Cart />
                        </ProtectedRoute>
                    )
                },
                {
                    path: "order/:userId", element: (
                        <ProtectedRoute>
                            <Order />
                        </ProtectedRoute>
                    )
                },
            ],
        },
        {path:"/admin", element:(
            <AdminProtectedRoute>
                <Admin />
            </AdminProtectedRoute>),

            children: [
               
                { index:true, element: <ProductsAdmin /> },
                { path:"addproduct", element:<ProductForm /> }
               
            ],
        },
        { path: "*", element: <ErrorPage /> }
    ]);

    if (loading) {
        return <div className="spinner-container"><ClipLoader size={50} color={"#123abc"} loading={true} /></div>;
    }

    return (
        <div className="App">
            <ToastContainer className="custom-toast-container"/>
            <ErrorToast />
            <RouterProvider router={router} />
        </div>
    );
}

export default App;
