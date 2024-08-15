import React, { useEffect } from "react";
import styles from "./Order.module.css";
import { getInitialOrdersApiAsync, orderSelector } from "../../redux/orderReducer/orderReducer";
import { loadingSelector } from "../../redux/loaderReducer/loaderReducer";
import { useSelector, useDispatch } from "react-redux";
import { ClipLoader } from "react-spinners";
import { authSelector } from "../../redux/authReducer/authReducer";
import { useNavigate } from "react-router-dom";

export default function Order() {
    const { loading } = useSelector(loadingSelector);
    const { orders } = useSelector(orderSelector);
    const { isLoggedIn } = useSelector(authSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getInitialOrdersApiAsync());
    }, [dispatch]);

   

    useEffect(()=>{
        // console.log(" loading in Order.js: ", loading.toString());
        if(!loading && !isLoggedIn){
           return navigate("/auth");
        }

    },[isLoggedIn, navigate, loading])

    function formatDate(isoDate) {
        const date = new Date(isoDate);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    if (loading) {
        return (
            <div className={styles.spinnerContainer}>
                <ClipLoader size={50} color={"red"} loading={true} />
            </div>
        );
    }

    if (!orders || orders?.length < 1) {
        return <p className={styles.NoOrder}>You haven't ordered in the past 1 month</p>;
    }

    return (
        <div className={styles.orderPageContainer}>
            {orders?.length > 0 && orders.map((order) => (
                <div className={styles.orderBoxWrapper} key={order._id}>
                    <div className={styles.orderBoxHeader}>
                        <div className={styles.topHeader}>
                            <p>Order ID: {order._id}</p>
                            <div className={styles.leftTop}>
                                <div className={styles.printInvoice}>
                                    <i className="fa-regular fa-file-lines"></i>
                                    <span>Invoice</span>
                                </div>
                                <div className={styles.trackOrderButton}>
                                    <span>Track Order</span>
                                    <i className="fa-solid fa-location-dot"></i>
                                </div>
                            </div>
                        </div>
                        <div className={styles.secondTopHeader}>
                            <div className={styles.orderDate}>
                                Order date: <span>{formatDate(order.orderDate)}</span>
                            </div>
                            <div className={styles.deliveryDate}>
                                <span className={styles.flightIcon}>
                                    <i className="fas fa-plane"></i>
                                </span>
                                <span>Estimated delivery:</span>
                                <span>Sep 10, 2024</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.divider}></div>

                    {/* Order Products */}
                    <div className={styles.orderBoxMain}>
                        {order.products.map((productItem) => (
                            <div className={styles.orderBox} key={productItem._id}>
                                <div className={styles.leftOrderBox}>
                                    <div className={styles.imgBox}>
                                        <img 
                                            src={productItem.product.images[0]} 
                                            alt={productItem.product.name} 
                                        />
                                    </div>
                                    <div className={styles.productName}>
                                        {productItem.product.name}
                                    </div>
                                </div>
                                <div className={styles.rightOrderBox}>
                                    <p className={styles.price}>${productItem.price}</p>
                                    <p className={styles.qty}>Qty: <span>{productItem.quantity}</span></p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.divider}></div>

                    <div className={styles.orderBoxFooter}>
                        <div className={styles.paymentDiv}>
                            <div className={styles.creditcard}>
                                <div className={styles.provider}>
                                    <i className="fab fa-cc-visa"></i>
                                </div>
                                <div className={styles.number}>xxxx xxxx xxxx xx80</div>
                                <div className={styles.goodThroughLabel}>
                                    good<br />through
                                </div>
                                <div className={styles.goodThroughLabel}>09/24</div>
                                <div className={styles.holder}>Jane Doe</div>
                                <div className={styles.validity}>valid</div>
                                <p className={styles.select}>Select</p>
                            </div>
                        </div>
                        <div className={styles.addressDiv}>
                            <h4>Delivery</h4>
                            <h5>Address</h5>
                            <p>1234 Main St, Anytown, USA</p>
                        </div>
                    </div>

                    <div className={styles.totalPriceDiv}>
                        <p>Total Price: ${order.totalPrice}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
