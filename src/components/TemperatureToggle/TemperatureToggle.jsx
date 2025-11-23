import React from 'react';
import styles from './TemperatureToggle.module.css';

/**
 * TemperatureToggle component for switching between Celsius and Fahrenheit
 */
const TemperatureToggle = ({ unit, onToggle }) => {
    return (
        <div className={styles.container}>
            <span className={styles.label}>Temperature Unit:</span>
            <div className={styles.toggleWrapper}>
                <button
                    className={`${styles.toggleButton} ${unit === 'C' ? styles.active : ''}`}
                    onClick={() => onToggle('C')}
                    aria-label="Switch to Celsius"
                    aria-pressed={unit === 'C'}
                >
                    °C
                </button>
                <button
                    className={`${styles.toggleButton} ${unit === 'F' ? styles.active : ''}`}
                    onClick={() => onToggle('F')}
                    aria-label="Switch to Fahrenheit"
                    aria-pressed={unit === 'F'}
                >
                    °F
                </button>
            </div>
        </div>
    );
}

export default TemperatureToggle;