import { useState, useEffect, useCallback } from 'react';
import { fetchWeatherForecast, getUserLocation } from '../utils/weatherApi';

/**
 * Custom hook for fetching and managing weather data
 * @param {string} initialLocation Initial location to fetch weather for
 * 
 * @returns {Object} Weather data, loading state, error, and utility functions
 */
export const useWeather = (initialLocation = 'New York') => {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [location, setLocation] = useState(initialLocation);

    /**
     * Fetch weather data for a given location
     */
    const fetchWeather = useCallback(async (locationQuery) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetchWeatherForecast(locationQuery);
            if (response.success) {
                setWeatherData(response.data);
                setLocation(locationQuery);
            } else {
                setError(response.error);
                setWeatherData(null);
            }
        } catch (err) {
            setError(err.message);
            setWeatherData(null);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Fetch weather for user's current location
     */
    const fetchWeatherForCurrentLocation = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            const coordinates = await getUserLocation();
            await fetchWeather(coordinates);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    }, [fetchWeather]);

    /**
     * Refresh weather data for current location
     */
    const refreshWeather = useCallback(() => {
        if (location) {
            fetchWeather(location);
        }
    }, [location, fetchWeather]);

    // Fetch weather on mount
    useEffect(() => {
        fetchWeather(initialLocation);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    
    return {
        weatherData,
        loading,
        error,
        fetchWeather,
        fetchWeatherForCurrentLocation,
        refreshWeather,
        currentLocation: location
    };
}