import styles from "./RatingForm.module.css";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { ClipLoader } from "react-spinners";


export default function RatingForm(props){
    const [ratingSter, setRatingStar] = useState(null);
    const [ratingText, setRatingText] = useState("");
    const [ratingLoading , setRatingLoading] = useState(false);

    const { productId, addRating, showReviewForm, handleClickShowReviewForm } = props;

    

    //====== function handle change rating star =========//
    function handleChangeRatingStar(value){
        setRatingStar(value);
    }

    //====== handle submit review from ===============//
   async function handleSubmitReviewFrom(e){
        e.preventDefault();

        if(!ratingSter || !ratingText) return;

        try{
            setRatingLoading(true);
            const ratingInfo = {productId:productId, rating:ratingSter, comment:ratingText}
            const res = await axios.post("/api/ratings/addRating", ratingInfo, {withCredentials:true});
            console.log("res.data for add rating: ", res.data);
            if(res.data?.success){

                addRating({averageRating:res.data.averageRating,
                     totalRatings:res.data.totalRatings,
                      productId:res.data.productId,
                    rating:res.data.rating});
                resetFrom();

                toast.success("Thanks for you valuable feedback.");
                handleClickShowReviewForm()
            }

        }catch(error){
            toast.error(error.response.data.message);

        }finally{
            setRatingLoading(false);

        }

        
    }


    function resetFrom(){
        setRatingStar(null);
        setRatingText("");
    }
    



    return(
        <div className={`${styles.reviewsFromContainer} ${showReviewForm ? styles.showForm: styles.hideForm}`}>
        <form onSubmit={handleSubmitReviewFrom} >
            <div className={styles.reviewRating}>
                 <i onClick={()=>handleClickShowReviewForm()}
                  className={`fa-solid fa-circle-xmark ${styles.formClosedBtn}`}></i>
                <p>How satisfied are you with our products overall?</p>
                <div className={styles.formStarContainer} >
                    <i className={`fa-solid fa-star ${ratingSter && 
                        ratingSter>0?styles.includeRate:styles.excludeRate}`}
                        onClick={()=>handleChangeRatingStar(1)} ></i>

                    <i className={`fa-solid fa-star ${ratingSter && 
                        ratingSter>1?styles.includeRate:styles.excludeRate}`}
                        onClick={()=>handleChangeRatingStar(2)} ></i>

                    <i className={`fa-solid fa-star ${ratingSter && 
                        ratingSter>2?styles.includeRate:styles.excludeRate}`}
                        onClick={()=>handleChangeRatingStar(3)} ></i>

                    <i className={`fa-solid fa-star ${ratingSter && 
                        ratingSter>3?styles.includeRate:styles.excludeRate}`}
                        onClick={()=>handleChangeRatingStar(4)} ></i>

                    <i className={`fa-solid fa-star ${ratingSter && 
                        ratingSter>4?styles.includeRate:styles.excludeRate}`}
                        onClick={()=>handleChangeRatingStar(5)} ></i>
                   
                </div>
            </div>

            <div className={styles.reviewTextContainer}>
                <p className={styles.ratingQuestion}>
                     Do you have any suggestions to improve our product and service?
                </p>
                <textarea value={ratingText} onChange={(e)=>setRatingText(e.target.value)} />

               {/* <button >Add review</button> */}

               <button className={styles.subminBtn} type="submit" disabled={ratingLoading}>
              {ratingLoading ? <ClipLoader size={15} color={"#fff"} /> :  "Add review"}
            </button>


            </div>
        </form>

    </div>
    )

}