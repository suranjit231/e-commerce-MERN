import React, { useState } from "react";
import styles from "./Products.module.css";
import ProductSection from "./ProductSection";
import { Link } from "react-router-dom";


export default function ProductsAdmin() {
    const [isPriceDropdownOpen, setPriceDropdownOpen] = useState(false);
    const [isCategoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
    const [isRatingsDropdownOpen, setRatingsDropdownOpen] = useState(false);
    const [isSearchDropdownOpen, setSearchDropdownOpen] = useState(false);

    const [selectedPriceRange, setSelectedPriceRange] = useState("$0 - $50");
    const [selectedCategory, setSelectedCategory] = useState("Men's");
    const [selectedRating, setSelectedRating] = useState("4 stars & up");
    const [selectedSearchBy, setSelectedSearchBy] = useState("Name");

    const priceRanges = ["$0 - $50", "$50 - $100", "$100 - $200", "$200+"];
    const categories = ["Men's", "Women's", "Electronics", "Fruits", "Jewelry", "Cars"];
    const ratings = ["4 stars & up", "3 stars & up", "2 stars & up", "1 star & up"];
    const searchByOptions = ["Name", "Brand", "Category"];

    const toggleDropdown = (dropdown) => {
        switch (dropdown) {
            case "price":
                setPriceDropdownOpen(!isPriceDropdownOpen);
                break;
            case "category":
                setCategoryDropdownOpen(!isCategoryDropdownOpen);
                break;
            case "ratings":
                setRatingsDropdownOpen(!isRatingsDropdownOpen);
                break;
            case "search":
                setSearchDropdownOpen(!isSearchDropdownOpen);
                break;
            default:
                break;
        }
    };

    const selectOption = (option, type) => {
        switch (type) {
            case "price":
                setSelectedPriceRange(option);
                setPriceDropdownOpen(false);
                break;
            case "category":
                setSelectedCategory(option);
                setCategoryDropdownOpen(false);
                break;
            case "ratings":
                setSelectedRating(option);
                setRatingsDropdownOpen(false);
                break;
            case "search":
                setSelectedSearchBy(option);
                setSearchDropdownOpen(false);
                break;
            default:
                break;
        }
    };

    return (
        <div className={styles.adminProductPageContainer}>
            <div className={styles.wrapper}>
                {/* ----------- header line ---------- */}
                <div className={styles.productHeaderSec}>
                    <div className={styles.header} >
                        <p>Best Selling Products</p>
                        <div className={styles.addProduct}>
                            <Link to={"/admin/addproduct"} >
                                <i className="fa-solid fa-plus"></i>
                                <span className={styles.addBtn} >
                                    Add
                                </span>
                            </Link>
                           
                        </div>
                    </div>
                  
                    <i className="fa fa-ellipsis-v"></i>
                </div>

                <div className={styles.filterContainer}>
                    {/* Price Filter */}
                    <div className={styles.filterCategory}>
                        <p>Price By</p>
                        <div className={styles.priceRangeListContainer}>
                            <div className={styles.dropdown} onClick={() => toggleDropdown("price")}>
                                <span>{selectedPriceRange}</span>
                                <i className={`fa fa-chevron-${isPriceDropdownOpen ? 'up' : 'down'} ${styles.dropdownArrow}`}></i>
                                {isPriceDropdownOpen && (
                                    <div className={styles.dropdownMenu}>
                                        {priceRanges.map((range, index) => (
                                            <div 
                                                key={index} 
                                                className={styles.dropdownItem} 
                                                onClick={() => selectOption(range, "price")}
                                            >
                                                {range}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div className={styles.filterCategory}>
                        <p>Category By</p>
                        <div className={styles.priceRangeListContainer}>
                            <div className={styles.dropdown} onClick={() => toggleDropdown("category")}>
                                <span>{selectedCategory}</span>
                                <i className={`fa fa-chevron-${isCategoryDropdownOpen ? 'up' : 'down'} ${styles.dropdownArrow}`}></i>
                                {isCategoryDropdownOpen && (
                                    <div className={styles.dropdownMenu}>
                                        {categories.map((category, index) => (
                                            <div 
                                                key={index} 
                                                className={styles.dropdownItem} 
                                                onClick={() => selectOption(category, "category")}
                                            >
                                                {category}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Ratings Filter */}
                    <div className={styles.filterCategory}>
                        <p>Ratings By</p>
                        <div className={styles.priceRangeListContainer}>
                            <div className={styles.dropdown} onClick={() => toggleDropdown("ratings")}>
                                <span>{selectedRating}</span>
                                <i className={`fa fa-chevron-${isRatingsDropdownOpen ? 'up' : 'down'} ${styles.dropdownArrow}`}></i>
                                {isRatingsDropdownOpen && (
                                    <div className={styles.dropdownMenu}>
                                        {ratings.map((rating, index) => (
                                            <div 
                                                key={index} 
                                                className={styles.dropdownItem} 
                                                onClick={() => selectOption(rating, "ratings")}
                                            >
                                                {rating}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Search By Filter */}
                    <div className={styles.filterCategory}>
                        <p>Search By</p>
                        <div className={styles.priceRangeListContainer}>
                            <div className={styles.dropdown} onClick={() => toggleDropdown("search")}>
                                <span>{selectedSearchBy}</span>
                                <i className={`fa fa-chevron-${isSearchDropdownOpen ? 'up' : 'down'} ${styles.dropdownArrow}`}></i>
                                {isSearchDropdownOpen && (
                                    <div className={styles.dropdownMenu}>
                                        {searchByOptions.map((option, index) => (
                                            <div 
                                                key={index} 
                                                className={styles.dropdownItem} 
                                                onClick={() => selectOption(option, "search")}
                                            >
                                                {option}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ========== product sections will render here ========== */}

                    <ProductSection />


            </div>
        </div>
    );
}
