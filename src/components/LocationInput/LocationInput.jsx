import React, { useState } from 'react';
import styles from './LocationInput.module.css';

/**
 * LocationInput component for searching weather by city name
 */
const LocationInput = ({ onSearch, onUseCurrentLocation, loading }) => {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            onSearch(inputValue.trim());
        }
    }

    const handleCurrentLocation = () => {
        onUseCurrentLocation();
        setInputValue('');
    }

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputWrapper}>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Enter city name..."
                        className={styles.input}
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        className={styles.searchButton}
                        disabled={loading || !inputValue.trim()}
                        aria-label="Search"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.35-4.35"></path>
                        </svg>
                    </button>
                </div>
            </form>

            <button
                onClick={handleCurrentLocation}
                className={styles.locationButton}
                disabled={loading}
                aria-label="Use current location"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="12" cy="12" r="10"></circle>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>
                Use Current Location
            </button>
        </div>
    );
}

export default LocationInput;