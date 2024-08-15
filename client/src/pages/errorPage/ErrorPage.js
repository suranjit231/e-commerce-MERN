import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ErrorPage.module.css"; // Add your styles here

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.errorPageContainer}>
      <div className={styles.errorContent}>
        <h1 className={styles.errorTitle}>Page Not Found</h1>
        <p className={styles.errorMessage}>
          Sorry, you don't have access to this page.
        </p>
        <button className={styles.homeButton} onClick={() => navigate("/")}>
          Go to Home Page
        </button>
      </div>
    </div>
  );
}
