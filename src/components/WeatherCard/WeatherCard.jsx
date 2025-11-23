import React from 'react';
import styles from './WeatherCard.module.css';
import { formatTemperature, getTemperatureInUnit } from '../../utils/temperatureConverter';

/**
 * WeatherCard component for displaying weather information
 */
const WeatherCard = ({ data, unit, type = 'current'}) => {
    if (!data) {
        return null;
    }

    const isCurrentWeather = type === 'current';
    const isTodayForecast = type === 'today';
    const isTomorrowForecast = type === 'tomorrow';

    const getTitle = () => {
        if (isCurrentWeather) {
            return 'Current Weather';
        }
        if (isTodayForecast) {
            return "Today's Forecast";
        }
        if (isTomorrowForecast) {
            return "Tomorrow's Forecast";
        }
    }

    const getTemperature = () => {
        if (isCurrentWeather) {
            const temp = unit === 'C' ? data.temp_c : data.temp_f;
            return formatTemperature(temp, unit);
        } else {
            const maxTemp = unit === 'C' ? data.maxtemp_c : data.maxtemp_f;
            const minTemp = unit === 'C' ? data.mintemp_c : data.mintemp_f;
            return {
                max: formatTemperature(maxTemp, unit),
                min: formatTemperature(minTemp, unit)
            };
        }
    }

    const getFeelsLike = () => {
        if (isCurrentWeather) {
            const temp = unit === 'C' ? data.feelslike_c : data.feelslike_f;
            return formatTemperature(temp, unit);
        }
        return null;
    }

    const temperature = getTemperature();
    const feelsLike = getFeelsLike();

    return (
        <div className={`${styles.card} ${styles[type]}`}>
            <div className={styles.header}>
                <h2 className={styles.title}>{getTitle()}</h2>
                {!isCurrentWeather && (
                    <span className={styles.date}>
                        {new Date(data.date).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                        })}
                    </span>
                )}
            </div>

            <div className={styles.content}>
                <div className={styles.iconContainer}>
                    <img
                        className={styles.weatherIcon}
                        src={`https:${data.condition.icon}`}
                        alt={data.condition.text}
                    />
                </div>

                <div className={styles.temperatureSection}>
                    {isCurrentWeather ? (
                        <>
                            <div className={styles.mainTemp}>{temperature}</div>
                            {feelsLike && (
                                <div className={styles.feelsLike}>
                                    Feels like: {feelsLike}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className={styles.tempRange}>
                            <div className={styles.maxTemp}>
                                <span className={styles.tempLabel}>High</span>
                                <span className={styles.tempValue}>{temperature.max}</span>
                            </div>
                            <div className={styles.separator}>/</div>
                            <div className={styles.minTemp}>
                                <span className={styles.tempLabel}>Min:</span>
                                <span className={styles.tempValue}>{temperature.min}</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className={styles.condition}>
                    {data.condition.text}
                </div>

                {isCurrentWeather && (
                    <div className={styles.additionalInfo}>
                        <div className={styles.infoItem}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
                            </svg>
                            <span>Humidity: {data.humidity}%</span>
                        </div>

                        <div className={styles.infoItem}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path>
                            </svg>
                            <span>Wind: {Math.round(data.wind_kph)} km/h</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WeatherCard;