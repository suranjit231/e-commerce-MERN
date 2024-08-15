import { useState } from "react";
import styles from "./Admin.module.css";
import AdminNavar from "./adminNav/AdminNavbar";
import AdminDashboard from "./dashboard/AdminDashboard";
// import ProductsAdmin from "./products/Products";
import { Outlet } from "react-router-dom";

export default function Admin() {
    const [isDashboard, setDashboard] = useState(false);

    // Function to toggle dashboard
    function toggleDashboard() {
        setDashboard(prev => !prev);
    }

    return (
        <div className={styles.adminPageContainer}>
            <AdminNavar toggleDashboard={toggleDashboard} isDashboard={isDashboard} />

        <div className={styles.mainWrapper}>
                <AdminDashboard isDashboard={isDashboard} />

                <Outlet />
        </div>
        </div>
    );
}
