import React from 'react';
import styles from './AdminDashboard.module.css';
import { logoutApiAsync } from "../../../redux/authReducer/authReducer";
import { useDispatch } from 'react-redux';

export default function AdminDashboard({isDashboard}) {

   const dispatch = useDispatch();
   //===== handle admin logout ====//
   function handleLogout(){
      dispatch(logoutApiAsync());
   }


    return (
       

        <div className={`${styles.dashboardContainer} ${isDashboard ? styles.showDash : styles.hideDash}`}>
             <div className={`${styles.dashBoardList} ${styles.dashboardDiv}`}>
                <img src='./images/dashboard.svg' alt='Dash-Icon' className={styles.icon} />
                <p>Dashboard</p>
                <img src="./images/greaterIcon.svg" alt="Icon" className={styles.greaterIcon} />
             </div>

             <div className={`${styles.dashBoardList} ${styles.dashboardDiv}`}>
                <img src='./images/lock.svg' alt='Dash-Icon' className={styles.icon} />
                <p>Authentication</p>
                <img src="./images/greaterIcon.svg" alt="Icon" className={styles.greaterIcon} />
             </div>

             <div className={`${styles.dashBoardList} ${styles.dashboardDiv}`}>
                <img src='./images/userIcon.svg' alt='Dash-Icon' className={styles.icon} />
                <p>Users</p>
                <img src="./images/greaterIcon.svg" alt="Icon" className={styles.greaterIcon} />
             </div>

             <div className={`${styles.dashBoardList} ${styles.dashboardDiv}`}>
                <img src='./images/productsIcon.svg' alt='Dash-Icon' className={styles.icon} />
                <p>Products</p>
                <img src="./images/greaterIcon.svg" alt="Icon" className={styles.greaterIcon} />
             </div>

             <div className={`${styles.dashBoardList} ${styles.dashboardDiv}`}>
                <img src='./images/orderIcon.svg' alt='Dash-Icon' className={styles.icon} />
                <p>Orders</p>
                <span className={styles.count}>05</span>
             </div>

             <div className={`${styles.dashBoardList} ${styles.dashboardDiv}`}>
                <img src='./images/messageIcon.svg' alt='Dash-Icon' className={styles.icon} />
                <p>Messages</p>
                <span className={styles.count}>09</span>
             </div>

             <div className={`${styles.dashBoardList} ${styles.dashboardDiv}`}>
                <img src='./images/ballIcon.svg' alt='Dash-Icon' className={styles.icon} />
                <p>Notification</p>
                <span className={styles.count}>03</span>
             </div>

             <div className={`${styles.dashBoardList} ${styles.dashboardDiv}`}>
                <img src='./images/settingIcon.svg' alt='Dash-Icon' className={styles.icon} />
                <p>Settings</p>
                
             </div>

             <div onClick={()=>handleLogout()}  className={`${styles.dashBoardList} ${styles.dashboardDiv}`}>
                <img src='./images/logoutIcon.svg' alt='Dash-Icon' className={styles.icon} />
                <p>Logout</p>
                
             </div>



        </div>
    );
}
