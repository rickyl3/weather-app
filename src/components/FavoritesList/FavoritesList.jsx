import React from 'react';
import styles from './FavoritesList.module.css';

/**
 * FavoritesList component for displaying and selecting favorite locations
 */
const FavoritesList = ({ favorites, onSelect, onRemove, currentLocation }) => {
    if (favorites.length === 0) {
        return (
            <div className={styles.emptyState}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                <p className={styles.emptyText}>No favorite locations yet</p>
                <p className={styles.emptyHint}>Search for a location and add it to favorites!</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                Favorite Locations ({favorites.length}/10)
            </h3>
            
            <div className={styles.list}>
                {favorites.map((favorite) => {
                    const isActive = currentLocation?.toLowerCase() === favorite.name.toLowerCase();
                    
                    return (
                        <div
                            key={`${favorite.name}-${favorite.country}`}
                            className={`${styles.item} ${isActive ? styles.active : ''}`}
                        >
                            <button
                                className={styles.selectButton}
                                onClick={() => onSelect(favorite.name)}
                                aria-label={`View weather for ${favorite.name}`}
                            >
                                <div className={styles.locationInfo}>
                                    <span className={styles.locationName}>{favorite.name}</span>
                                    <span className={styles.locationDetails}>
                                        {favorite.region && `${favorite.region}, `}{favorite.country}
                                    </span>
                                </div>
                                {isActive && (
                                    <span className={styles.activeBadge}>Current</span>
                                )}
                            </button>
                            
                            <button
                                className={styles.removeButton}
                                onClick={() => onRemove(favorite.name)}
                                aria-label={`Remove ${favorite.name} from favorites`}
                                title="Remove from favorites"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FavoritesList;