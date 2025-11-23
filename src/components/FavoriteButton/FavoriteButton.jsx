import React from 'react';
import styles from './FavoriteButton.module.css';

/**
 * FavoriteButton component for adding/removing favorites
 */
const FavoriteButton = ({ location, isFavorited, onToggle, disabled }) => {
    const handleClick = () => {
        if (!disabled) {
            onToggle();
        }
    };

    return (
        <button
            className={`${styles.favoriteButton} ${isFavorited ? styles.favorited : ''}`}
            onClick={handleClick}
            disabled={disabled}
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill={isFavorited ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            className={styles.icon}
            >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span className={styles.text}>
                {isFavorited ? 'Favorited' : 'Add to Favorites'}
            </span>
        </button>
    );
};

export default FavoriteButton;