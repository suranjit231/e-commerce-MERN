import React, { useEffect } from "react";
import styles from "./Home.module.css";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductApiAsync, productSelector } from "../../redux/productReducer/productReducer";
import { addCartApiAsync } from "../../redux/cartReducer/cartReducer";
import { authSelector } from "../../redux/authReducer/authReducer";
import { loadingSelector } from "../../redux/loaderReducer/loaderReducer";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import Stars from "../../components/sters/Sters";

export default function Home() {
    const navigate = useNavigate();
    const { loading } = useSelector(loadingSelector);
    const { products } = useSelector(productSelector);
    const { isLoggedIn } = useSelector(authSelector);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllProductApiAsync());
    }, [dispatch]);

    async function handleClickAddToCart(productId) {
        if (!isLoggedIn) {
            return navigate("/auth");
        }
        try {
            await dispatch(addCartApiAsync({ productId, quantity: 1 })).unwrap();
            toast.success("Item added to cart successfully!");
        } catch (error) {
            toast.error("Failed to add item to cart.");
        }
    }

    if (loading) {
        return <div className={styles.loader}><ClipLoader size={35} color={"#000"} /></div>;
    }

    
    return (
        <div className={styles.homeContainer}>
            {products?.length > 0 && products.map((prod) => (
                <div key={prod._id} className={styles.productBox}>

                    {/* ====== directed to details page on click of product images ===== */}
                    <div className={styles.imageBox}>
                        <Link to={`product/details/${prod._id}`} >
                        
                                <img src={prod.images[0]} alt={prod.name} />
                        
                        
                        </Link>
                    </div>
                    
                    <div className={styles.productFooter}>
                        <p>{prod.name}</p>
                        <div className={styles.priceNdRatingDiv}>
                            <p>$ {prod.price}</p>
                            <div className={styles.ratingContainer}>
                                <Stars rating={prod.averageRating} />
                               
                            </div>
                        </div>
                        <div className={styles.cartBtnDiv}>
                            <button onClick={() => handleClickAddToCart(prod._id)} disabled={loading}>
                                {loading ? <ClipLoader size={15} color={"#fff"} /> : "Add to Cart"}
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
