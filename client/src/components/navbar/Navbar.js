import React, { useState, useEffect, useRef } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { authSelector, logoutApiAsync } from "../../redux/authReducer/authReducer";
import { searchProdctApiAsync } from "../../redux/productReducer/productReducer";
import { cartSelector, getInitialCartApiAsync } from "../../redux/cartReducer/cartReducer";
import { toast } from "react-toastify";
import styles from "./Navbar.module.css";
import SideBar from "../sidebar/Sidebar";
import { loadingSelector } from "../../redux/loaderReducer/loaderReducer";


export default function Navbar() {
    const [showSearch, setShowSearch] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 820);
    const [isShowSidebar, setShowSidebar] = useState(false);
    const [searchText, setSearchText] = useState("");
    const searchRef = useRef();
    const debounceTimeout = useRef(null);
    const location = useLocation();  // Get the current path
 

    const { isLoggedIn, error: authError, user } = useSelector(authSelector);
    const { carts } = useSelector(cartSelector);
    const dispatch = useDispatch();

    // Handle auth errors
    useEffect(() => {
        if (authError) {
            console.log("error: ", authError);
            toast.error(authError);
        }
    }, [authError]);

    // Handle responsiveness for search bar
    const handleResize = () => {
        setIsMobile(window.innerWidth < 820);
        if (window.innerWidth >= 820) {
            setShowSearch(false);
        }
    };

    useEffect(() => {
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    // Search focus
    useEffect(() => {
        if (showSearch) {
            searchRef.current.focus();
        }
    }, [showSearch]);

    // Fetch initial cart items if logged in
        useEffect(() => {
            if (isLoggedIn) {
                dispatch(getInitialCartApiAsync());
            }
        }, [isLoggedIn, dispatch]);

    // Handle searching for a product with debounce
    const handleSearchTextChange = (text) => {
        setSearchText(text);
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        debounceTimeout.current = setTimeout(() => {
            dispatch(searchProdctApiAsync({ searchQuery: text }));
        }, 500);
    };

    // Toggle responsive search bar
    function toggleResponsiveSearch() {
        if (isShowSidebar) {
            setShowSidebar((prev) => !prev);
            setShowSearch((prev) => !prev);
        } else {
            setShowSearch((prev) => !prev);
        }
    }

    // Handle toggle sidebar
    function handleToggleSidebar() {
        if (!isMobile) {
            setShowSidebar((prev) => !prev);
        } else if (isMobile && showSearch) {
            setShowSearch(false);
            setShowSidebar((prev) => !prev);
        } else {
            setShowSidebar((prev) => !prev);
        }
    }

    // Handle logout
    function handleLogout() {
        dispatch(logoutApiAsync());
    }

    // Determine if the current path is the root route
    const isHomePage = location.pathname === "/";

    return (
        <>
            <div className={styles.navWrapper}>
                <div className={styles.navContainer}>
                    <div className={styles.leftNavbar}>
                        <p>Busy Buy</p>
                    </div>

                    {!isMobile ? (
                        <div className={styles.searchDiv}>
                            <input
                                type="text"
                                name="search"
                                value={searchText}
                                onChange={(e) => handleSearchTextChange(e.target.value)}
                                placeholder="Search..."
                            />
                            <i className={`fa-solid fa-magnifying-glass ${styles.searchIcon}`}></i>
                        </div>
                    ) : (
                        <div>
                            <i
                                onClick={() => toggleResponsiveSearch()}
                                className={`fa-solid fa-magnifying-glass ${styles.searchIconRes}`}
                            ></i>
                        </div>
                    )}

                    <div className={styles.rightNavbar}>
                        <div className={styles.homeDiv}>
                            <Link to="/">
                                <i className="fa-solid fa-house"></i>
                            </Link>
                        </div>

                        {isLoggedIn ? (
                            <>
                                <div className={styles.orderDiv}>
                                    <Link to={`/order/${user._id}`}>
                                        <i className="fa-solid fa-store"></i>
                                    </Link>
                                </div>

                                <div className={styles.cartDiv}>
                                    <Link to={`/cart/${user._id}`}>
                                        <i className="fa-solid fa-cart-shopping"></i>
                                        <p className={styles.countCartItem}>{carts.length}</p>
                                    </Link>
                                </div>

                                <div className={styles.loginDiv} onClick={() => handleLogout()}>
                                    <i className="fa-solid fa-right-from-bracket"></i>
                                </div>
                            </>
                        ) : (
                            <div className={styles.loginDiv}>
                                <Link to="/auth">
                                    <i className="fa-solid fa-right-to-bracket"></i>
                                </Link>
                            </div>
                        )}

                        {isHomePage ? (
                            <div className={styles.menuDiv}>
                                <i onClick={() => handleToggleSidebar()} className="fa-solid fa-bars"></i>
                            </div>
                        ) : (
                            <div className={styles.userDiv}>
                                <Link to="/admin">
                                    <i className="fa-solid fa-user"></i>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {isMobile && (
                    <div className={styles.responsiveSearchContainer}>
                        {showSearch && (
                            <div className={`${styles.responsiveSearchDiv} ${styles.show}`}>
                                <input
                                    ref={searchRef}
                                    onChange={(e) => handleSearchTextChange(e.target.value)}
                                    value={searchText}
                                    type="text"
                                    placeholder="Search..."
                                />
                                <i
                                    className="fa-solid fa-xmark"
                                    onClick={() => setShowSearch(false)}
                                ></i>
                            </div>
                        )}
                    </div>
                )}

                {isShowSidebar && <SideBar isShowSidebar={isShowSidebar} handleToggleSidebar={handleToggleSidebar} />}
            </div>

            <Outlet />
        </>
    );
}
