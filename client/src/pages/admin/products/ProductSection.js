import styles from "./ProductSection.module.css";
import { useSelector, useDispatch } from "react-redux";
import { productSelector } from "../../../redux/productReducer/productReducer";
import { useEffect, useState } from "react";
import { getAllProductApiAsync, deleteProductApiAsync } from "../../../redux/productReducer/productReducer";
import ClipLoader from "react-spinners/ClipLoader";
import { loadingSelector } from "../../../redux/loaderReducer/loaderReducer";
import { toast } from "react-toastify";

export default function ProductSection() {
    const { products } = useSelector(productSelector);
    const { loading } = useSelector(loadingSelector);
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 5;

    useEffect(() => {
        dispatch(getAllProductApiAsync());
        
        console.log("products: ", products);
    }, [dispatch]);

    //===== calculate average rating ===============//
    // const calculateAverageRating = (ratings) => {

    //     console.log("ratings in productSection: ", ratings);
    //     if (ratings.length === 0) return 0;
    //     const total = ratings.reduce((sum, ra) => sum + Number(ra.rating), 0);
    //     return (total / ratings.length).toFixed(1);
    // };

    //===== handle change page number ======//
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    //===== rendering pagination ==========//
    const renderPagination = () => {
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(products.length / productsPerPage); i++) {
            pageNumbers.push(i);
        }

        return pageNumbers.map(number => (
            <button
                key={number}
                onClick={() => handlePageChange(number)}
                className={`${styles.pageButton} ${currentPage === number ? styles.activePageButton : ''}`}
            >
                {number}
            </button>
        ));
    };

    //======= handle delete products =====//
    async function handleDeleteProducts(productId) {
        try {
            const result = await dispatch(deleteProductApiAsync({ productId }));
            console.log("result in productPage for delete: ", result);

            if (result?.payload?.success) {
                toast.success(result?.payload.message);
                // Check if the current page has only one product and set to the previous page if necessary
                if (currentProducts.length === 1 && currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                }
            }
        } catch (error) {
            toast.error("Failed to delete product.");
        }
    }

    return (
        <div className={styles.productSectionContainer}>
            {loading ? (
                <div className={styles.loader}>
                    <ClipLoader size={50} color={"#123abc"} loading={true} />
                </div>
            ) : (
                <>
                    <div className={styles.productGridHeader}>
                        <div className={styles.productGridId}>ID</div>
                        <div className={styles.headerImg}>Image</div>
                        <div className={styles.productName}>Name</div>
                        <div className={styles.productCategory}>Category</div>
                        <div className={styles.productPrice}>Price</div>
                        <div className={styles.productStock}>Stock</div>
                        <div className={styles.productRating}>Rating</div>
                        <div className={styles.actions}>Actions</div>
                    </div>
                    {currentProducts.map((product, index) => (
                        <div key={product._id} className={styles.productGrid}>
                            <div className={styles.productGridId}>{index + 1 + indexOfFirstProduct}</div>
                            <div className={styles.productGridImg}>
                                <img src={product.images[0]} alt={product.name} className={styles.productImage} />
                            </div>
                            <div id={styles.productName}>{product.name}</div>
                            <div className={styles.productCategory}>{product.category}</div>
                            <div className={styles.productPrice}>${product.price}</div>
                            <div className={styles.productStock}>{product.stock}</div>
                            <div className={styles.productRating}>
                                <i className="fa-solid fa-star"></i>
                                <span>{product.averageRating}</span>
                                <span>({product.totalRatings})</span>
                            </div>
                            <div className={styles.actions}>
                                <i className="fa-solid fa-eye"></i>
                                <i className="fa-solid fa-pen"></i>
                                <i className="fa-solid fa-trash" 
                                onClick={() => handleDeleteProducts(product._id)} ></i>
                            </div>
                        </div>
                    ))}
                    <div className={styles.paginationContainer}>
                        {renderPagination()}
                    </div>
                </>
            )}
        </div>
    );
}
