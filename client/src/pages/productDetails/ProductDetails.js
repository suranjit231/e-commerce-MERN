import { useEffect, useState } from "react";
import styles from "./ProductDetails.module.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import {toast} from "react-toastify";
import { ClipLoader } from "react-spinners";
import Stars from "../../components/sters/Sters";
import RatingForm from "./RatingFrom";
import { authSelector } from "../../redux/authReducer/authReducer";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addCartApiAsync } from "../../redux/cartReducer/cartReducer";

export default function ProductDetails(){
    const params = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [averageRating, setAverageRating] = useState(null);
    const [ratings, setRatings] = useState([]);
    const { isLoggedIn } = useSelector(authSelector);
    const navigate = useNavigate();
    const [showReviewForm, setShowReviewForm] = useState(false);
    const dispatch = useDispatch();
    const [cartQuantity, setCartQuantity] = useState(1);

    useEffect(()=>{

       async function fetchDetails(){
            try{
                const {productId} = params;
                setLoading(true);
                const res = await axios.get(`/api/products/details/${productId}`, {withCredentials:true});
                console.log("response.data from backend details: ", res.data);

                if(res.data?.success){
                    setProduct(res.data.product);
                    setAverageRating(res.data.averageRating);
                    setRatings(res.data.ratings);

                }


            }catch(error){
                toast.error(error.response.data.message);
    
            }finally{
                setLoading(false);
            }

        }

        fetchDetails(params);
       
    },[params]);
    //console.log("params: ", params);


    function addRating(updateAbleValue) {
        const { averageRating, totalRatings, productId, rating } = updateAbleValue;
        const ratingIndex = product.ratings.findIndex(
          (rate) => rate.product === productId && rate.user === rating.user
        );
    
        setProduct((prev) => {
          const updatedRatings = [...prev.ratings];
          if (ratingIndex !== -1) {
            // Update the existing rating
            updatedRatings[ratingIndex] = { ...rating };
          } else {
            // Push new rating
            updatedRatings.push(rating);
          }
          return {
            ...prev,
            ratings: updatedRatings,
          };
        });

        setAverageRating(averageRating);
      }


   
    //====== handle toggle review from =======//
    function handleClickShowReviewForm(){
        if(!isLoggedIn){
            return navigate("/auth");
        }

        setShowReviewForm((prev)=>!prev);
    }

    //====== handle click add to cart =======//
    async function handleClickAddToCart(productId) {
        if (!isLoggedIn) {
            return navigate("/auth");
        }
        try {

            if(cartQuantity===0) return;
            await dispatch(addCartApiAsync({ productId, quantity: cartQuantity })).unwrap();
            toast.success("Item added to cart successfully!");
        } catch (error) {
            toast.error("Failed to add item to cart.");
        }
    }


    //====== handle cartQuantity ==============//
    function handleCartQuantity(value){

        if(value=== -1 && cartQuantity===0) return;

        setCartQuantity((prev)=> prev + value);
    }





    if(loading){
        return(
            <div className={styles.loaderContainer}>
                 <ClipLoader size={50} color={"#123abc"} loading={loading} />
            </div>
        )
    }

    if(!loading && !product){
        return;
    }


    function dateFormate(dateInIeoString){
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const dateObj = new Date(dateInIeoString);
        const year = dateObj.getFullYear();
        const month = months[dateObj.getMonth()]; // Get the month name
        const date = dateObj.getDate();
       // console.log(`${year} - ${month} - ${date}`);
        return `${date}/${month}/${year}`;
    }

    return(
        <div className={styles.productDtailsPageContainer}>
            <div className={styles.leftContainer}>
                <div className={styles.mainImageBox} >
                    <img src={product.images[0]} alt="Laptop" />
                </div>

                <div className={styles.imageController}>
                    <div className={styles.imageView} >
                        <img src="http://localhost:5000/uploads/2024-08-12T14-24-30.774ZAccer-laptop.jpg" alt="Laptop" />
                    </div>

                    <div className={styles.imageView} >
                        <img src="http://localhost:5000/uploads/2024-08-12T14-24-30.774ZAccer-laptop.jpg" alt="Laptop" />
                    </div>

                    <div className={styles.imageView} >
                        <img src="http://localhost:5000/uploads/2024-08-12T14-24-30.774ZAccer-laptop.jpg" alt="Laptop" />
                    </div>

                    <div className={styles.imageView} >
                        <img src="http://localhost:5000/uploads/2024-08-12T14-24-30.774ZAccer-laptop.jpg" alt="Laptop" />
                    </div>
                    
                   
                </div>

            </div>

            <div className={styles.rightContainer}>

                {/* ======== top name price and ratings ============ */}
                <div className={styles.rightNamaAndPriceDiv}>
                    <h3 className={styles.nameDiv} >{product.name}</h3>
                    <div className={styles.ratingDiv}>
                        <Stars rating={averageRating} />
                        <p>({ratings.length})</p>
                    </div>
                    <p className={styles.price} >${product.price}</p>

                </div>

                {/* ======= sizes and color container =========== */}

                <div className={styles.sizeContainer}>
                    <div className={styles.leftSizeBox}>
                        <p>Available Sizes</p>

                        <div className={styles.sizeBtnConatiner}>
                            <div className={styles.size} >S</div>
                            <div className={styles.size} >M</div>
                            <div className={styles.size} >L</div>
                        </div>

                    </div>

                    <div className={styles.rightSizeBox}>
                        <p>Available Colors</p>
                        <div className={styles.colorBtnConatiner}>
                            <div className={styles.color} >
                               
                            </div>
                            <div className={styles.color} >
                               
                            </div>
                            <div className={styles.color} >
                               
                            </div>
                        </div>
                        
                    </div>
                </div>

                {/* ========= add to cart container ================ */}

                <div className={styles.cartContainer}>
                    <div className={styles.cartHeading}>
                        <p>Last {product.stock} left </p>
                        <span>-</span>
                        <p>make it your's!</p>
                    </div>

                    <div className={styles.cartControl}>
                        <div onClick={()=>handleCartQuantity(-1)}
                        className={styles.decreased}>-</div>

                        <div className={styles.quantityCount}>{cartQuantity}</div>
                        <div onClick={()=>handleCartQuantity(1)}
                         className={styles.increased}>+</div>
                        <div onClick={()=>handleClickAddToCart(product._id)} className={styles.addToCartBtn}>
                            Add to cart
                        </div>
                    </div>

                </div>

                <div className={styles.descriptionContainer}>
                    <h4>{product.name}:</h4>
                    <p>{product.description}</p>
                </div>



            </div>

            <div className={styles.reviewsContainer}>

               {/* =========== render add rating from here ================= */}
               
               { showReviewForm && <RatingForm
                productId={product._id}
                addRating={addRating} 
                showReviewForm={showReviewForm}
                handleClickShowReviewForm={handleClickShowReviewForm}/>}


                <div className={styles.reviewHeaderDiv}>
                    <h3>Reviews ({product.ratings.length}):</h3>
                    <div onClick={()=>handleClickShowReviewForm()} className={styles.addReviewBtn}>
                       Add review
                    </div>
                </div>

                {product.ratings.length > 0 && product.ratings.map((rate, index) => (
                    <div key={index} className={styles.reviewBoxWrapper}>
                        <div className={styles.userImageDiv}>
                            <img src="https://t4.ftcdn.net/jpg/06/48/39/19/360_F_648391979_uMz6EwAlKNIJnK9r46UpTiM17nT8GuLl.jpg" alt="User" />
                        </div>
                        <div className={styles.userNameAndReview}>
                            <p>John Kathrimpy <span className={styles.reviewDate}>{dateFormate(rate.createdAt)}</span></p>
                            <p className={styles.rateComment}>{rate?.comment}</p>
                            {index !== product.ratings.length - 1 && (
                                <p className={styles.borderButton}></p>
                            )}
                        </div>
                    </div>
                ))}
               
            </div>


        </div>
    )

}