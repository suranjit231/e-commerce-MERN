import React, { useEffect, useState } from "react";
import styles from "./Sidebar.module.css";
import { fiterProductApiAsync } from "../../redux/productReducer/productReducer";
import { useDispatch} from "react-redux";


export default function SideBar({ isShowSidebar, handleToggleSidebar }) {
    const [isVisible, setIsVisible] = useState(false);
    const [price, setPrice] = useState(0);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        setIsVisible(isShowSidebar);
    }, [isShowSidebar]);

    const handlePriceChange = (event) => {
        setPrice(event.target.value);
    };

    const handleCategoryChange = (event) => {
        const { value, checked } = event.target;
        setSelectedCategories(prevCategories =>
            checked
                ? [...prevCategories, value]
                : prevCategories.filter(category => category !== value)
        );
    };


    const handleApplyFilters = (event) => {
        event.preventDefault();

        let filterCriteria = {};

        if(price){
            filterCriteria.maxPrice = price;
        }
        if(selectedCategories.length >0){
            filterCriteria.category = selectedCategories;
        }

        if (Object.keys(filterCriteria).length === 0) return;
        
    

      //  console.log("filter criteria: ", filterCriteria);
        dispatch(fiterProductApiAsync(filterCriteria));

    };

   

    return (
        <div className={`${styles.sidebarContainer} ${isVisible ? styles.sidebarVisible : ""}`}>
            <i onClick={handleToggleSidebar} 
                className={`fa-solid fa-xmark ${styles.closeSidebar}`}></i>

            <div className={styles.sideBarWrapper}>
                <div className={styles.filterheader}>
                    <span><i className="fa-solid fa-filter-circle-dollar"></i></span>
                    <span>Filter</span>
                </div>

                <form onSubmit={handleApplyFilters}>
                    <div className={styles.priceRangeDiv}>
                        <label htmlFor="priceRange">Price: {price}</label>
                        <input
                            type="range"
                            id="priceRange"
                            min="100"
                            max="100000"
                            value={price}
                            onChange={handlePriceChange}
                            className={styles.priceRangeInput}
                        />
                    </div>

                    <div className={styles.categoryFilterDiv}>
                        <p>Category</p>

                        <div>
                            <label htmlFor="mans-cloth">
                                <input
                                    type="checkbox"
                                    id="mans-cloth"
                                    value="Men's Clothing"
                                    checked={selectedCategories.includes("Men's Clothing")}
                                    onChange={handleCategoryChange}
                                />
                                Man's Clothing
                            </label>
                        </div>

                        <div>
                            <label htmlFor="womens-cloth">
                                <input
                                    type="checkbox"
                                    id="womens-cloth"
                                    value="Women's Clothing"
                                    checked={selectedCategories.includes("Women's Clothing")}
                                    onChange={handleCategoryChange}
                                />
                                Women's Clothing
                            </label>
                        </div>

                        <div>
                            <label htmlFor="electronics">
                                <input
                                    type="checkbox"
                                    id="electronics"
                                    value="Electronics"
                                    checked={selectedCategories.includes("Electronics")}
                                    onChange={handleCategoryChange}
                                />
                                Electronics
                            </label>
                        </div>

                        <div>
                            <label htmlFor="jewelry">
                                <input
                                    type="checkbox"
                                    id="jewelry"
                                    value="Jewelry"
                                    checked={selectedCategories.includes("Jewelry")}
                                    onChange={handleCategoryChange}
                                />
                                Jewelry
                            </label>
                        </div>
                    </div>

                    <div className={styles.applyFilter}>
                        <button type="submit">Apply</button>
                    </div>
                </form>
            </div>
        </div>
    );
}