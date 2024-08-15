import styles from "./AdminNavbar.module.css";
import { Link } from "react-router-dom";
export default function AdminNavar(props){
   
    const {toggleDashboard} = props;
   
    return(
        <div className={styles.adminNavContainer}>
            <div className={styles.leftAdminNavbar}>
                <div className={styles.adminLogo}>
                    <Link to={"/admin"} >
                        AdminDashboard
                    </Link>
                    
                </div>
                <div className={styles.navMenu} onClick={()=>toggleDashboard()}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                <div className={styles.searchDiv}>
                    <input type="text" placeholder="Search..." />
                    <i className={`fa-solid fa-magnifying-glass ${styles.searchIcon}`}></i>

                </div>
            </div>

            <div className={styles.rightAdminNav}>
                <div className={styles.notificatonBell}>
                    <i className="fa-regular fa-bell"></i>
                    <span className={styles.notifyCount}>01</span>
                </div>

                <div className={styles.adminAccountIcon}>
                    <div className={styles.adminImage}>
                        <img src="https://i.pinimg.com/236x/22/ec/4d/22ec4dab31b02c8ac335121ed896bbdb.jpg" alt="Amin" />
                    </div>
                    
                </div>


            </div>

        </div>
    )

}