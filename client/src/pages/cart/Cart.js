import React, {useEffect} from "react";
import styles from "./Cart.module.css";
import { cartSelector } from "../../redux/cartReducer/cartReducer";
import { useDispatch, useSelector} from "react-redux";
import { getInitialCartApiAsync } from "../../redux/cartReducer/cartReducer";
import { increasedCartItemApiAsync, decreasedCartItemsApiAsync, removedCartApiAsync } from "../../redux/cartReducer/cartReducer";
import { toast } from "react-toastify";
import { loadingSelector } from "../../redux/loaderReducer/loaderReducer";
import { ClipLoader } from "react-spinners";
import { createOrderApiAsync } from "../../redux/orderReducer/orderReducer";
import { orderSelector, orderActions } from "../../redux/orderReducer/orderReducer";



export default function Cart() {
    const { carts } = useSelector(cartSelector);
    const dispatch = useDispatch();
    const { loading } = useSelector(loadingSelector);
    const { orderLoading, success } = useSelector(orderSelector);
   
   //===== set initial carts items =======//
   useEffect(()=>{

        dispatch(getInitialCartApiAsync());
       

   },[dispatch]);


   useEffect(()=>{
    

   },[carts]);

   useEffect(()=>{

       // console.log("success: ", success.toString());
        if(success){
            toast.success("Your order is done.");
        }

      let timer=  setTimeout(()=>{
            dispatch(orderActions.toggleSuccess());
        },2000);

        return()=>{
            clearTimeout(timer);
        }

   },[success, dispatch]);


    //========= handle click increased quantity ==============//
    async function handleIncreaded(cartItemId){
        try {
            await dispatch(increasedCartItemApiAsync({cartId:cartItemId}));
            toast.success("Item increased in cart successfully!");
            } catch (error) {
            toast.error("Failed to add item to cart.");
         }
    }

    //======== function handle click decreaded quantity in cart ==========//
   async function handleDecreased(cartItemId){
        try {
            await dispatch(decreasedCartItemsApiAsync({cartId:cartItemId}));
            toast.success("Item removed from cart successfully!");
            } catch (error) {
            toast.error("Failed to removed items from cart.");
         }
    }

    //======= handle click in removed cart ===============//
    async function handleRemovedClick(cartItemId) {
        try{
            await dispatch(removedCartApiAsync({cartId: cartItemId}));
            toast.success("Item removed from cart successfully!");

        }catch(error){
            toast.error("Failed to removed items from cart.");
        }
    }




    //======== function handle click buy-now button =====================//
    function handleClickBuyNow(){
        dispatch(createOrderApiAsync());
    }



    if (loading) {
        return (
          <div className={styles.loaderWrapper}>
            {/* <PulseLoader color={"#123abc"} loading={loading} /> */}
            Loading...
          </div>
        );
      }

      

    return (
        <div className={styles.cartSectionWrapper}>
            <div className={styles.totalCartSection}>

                {
                carts?.length<1? (<p>No Items found in cart.</p>):
                (<>

                    <p>Total Price:
                    <span>

                    ${carts.reduce((total, item) => {

                        const price = item.product?.price ?? 0;
                        const quantity = item.quantity ?? 0;
                        return total + price * quantity;
                    }, 0).toFixed(2)}

                    </span>
                </p>
                <button onClick={()=>handleClickBuyNow()} disabled={orderLoading} >
                    {orderLoading ? <ClipLoader size={15} color={"#fff"} /> : "Buy Now"}
                </button>
                </>
                )}

                


                
            </div>
            <div className={styles.cartItemsContainer}>
                {carts?.length>0 && carts.map((item) => (
                    <div className={styles.cartBox} key={item._id}>
                        <div className={styles.imageBox}>
                            <img src={item.product?.images[0]} alt={item.name} />
                        </div>
                        <div className={styles.footerCartBox}>
                            <p className={styles.productName}>{item.name}</p>
                            <div className={styles.priceAndQuantity}>
                                <p>${item.product.price}</p>
                                <p className={styles.quantityControlDiv}>
                                    <i onClick={()=>handleDecreased(item._id)}
                                     className="fa-solid fa-circle-minus"></i>


                                    <span>{item.quantity}</span>
                                    <i onClick={()=>handleIncreaded(item._id)}
                                    className="fa-solid fa-circle-plus"></i>
                                </p>
                            </div>
                            <div className={styles.removeCartBtnDiv}>
                                <button onClick={()=>handleRemovedClick(item._id)} >Remove From Cart</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}