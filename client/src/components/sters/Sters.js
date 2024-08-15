// src/components/Stars.js
import React from 'react';
import styles from './Sters.module.css';

const Stars = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - Math.ceil(rating);

    let stars = [];

    for (let i = 0; i < fullStars; i++) {
        stars.push(<i key={`full-${i}`} className={`fa-solid fa-star ${styles.fullStar}`}></i>);
    }

    if (halfStar) {
        stars.push(<i key="half" className={`fa-solid fa-star-half-stroke ${styles.halfStar}`}></i>);
    }

    for (let i = 0; i < emptyStars; i++) {
        stars.push(<i key={`empty-${i}`} className={`fa-solid fa-star ${styles.emptyStar}`}></i>);
    }

    return <div className={styles.ratingContainer}>{stars}</div>;
};

export default Stars;
