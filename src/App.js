import React, { useState, useEffect } from 'react';
import './App.css';
import LocationInput from './components/LocationInput/LocationInput';
import WeatherCard from './components/WeatherCard/WeatherCard';
import TemperatureToggle from './components/TemperatureToggle/TemperatureToggle';
import { useWeather } from './hooks/useWeather';
import FavoriteButton from './components/FavoriteButton/FavoriteButton';
import FavoritesList from './components/FavoritesList/FavoritesList';
import { getFavorites, addFavorite, removeFavorite, isFavorite } from './utils/favoriteLocations';

function App() {
    const [temperatureUnit, setTemperatureUnit] = useState('C');
    const [favorites, setFavorites] = useState([]);

    const {
        weatherData,
        loading,
        error,
        fetchWeather,
        fetchWeatherForCurrentLocation
    } = useWeather();

    useEffect(() => {
        setFavorites(getFavorites());
    }, []);
    
    const handleSearch = (location) => {
        fetchWeather(location);
    }

    const handleUseLocation = () => {
        fetchWeatherForCurrentLocation();
    }

    const handleUnitToggle = (unit) => {
        setTemperatureUnit(unit);
    }

    const handleToggleFavorite = () => {
        if (!weatherData?.location) {
            return;
        }

        const locationName = weatherData.location.name;
        const isCurrentlyFavorited = isFavorite(locationName);

        if (isCurrentlyFavorited) {
            removeFavorite(locationName);
        } else {
            addFavorite(weatherData.location);
        }

        setFavorites(getFavorites());
    };

    const handleSelectFavorite = (locationName) => {
        fetchWeather(locationName);
    };

    const handleRemoveFavorite = (locationName) => {
        removeFavorite(locationName);
        setFavorites(getFavorites());
    };

    const currentLocationIsFavorited = weatherData?.location 
        ? isFavorite(weatherData.location.name) 
        : false;

    return (
        <div className="App">
            <header className="App-header">
                <h1 className="App-title">Weather App</h1>
                <p className="App-subtitle">Get current and tomorrow's weather forecast!</p>
            </header>

            <div className="App-controls">
                <LocationInput
                    onSearch={handleSearch}
                    onUseCurrentLocation={handleUseLocation}
                    loading={loading}
                />
                <div className="App-controls-row">
                    {weatherData && (
                        <>
                            <TemperatureToggle
                                unit={temperatureUnit}
                                onToggle={handleUnitToggle}
                            />
                            <FavoriteButton
                                location={weatherData.location}
                                isFavorited={currentLocationIsFavorited}
                                onToggle={handleToggleFavorite}
                                disabled={loading}
                            />
                        </>
                    )}
                </div>
            </div>

            {favorites.length > 0 && (
                <FavoritesList
                    favorites={favorites}
                    onSelect={handleSelectFavorite}
                    onRemove={handleRemoveFavorite}
                    currentLocation={weatherData?.location?.name}
                />
            )}

            {loading && (
                <div className="App-loading">
                    <div className="spinner"></div>
                    <p>Loading weather data...</p>
                </div>
            )}

            {error && (
                <div className="App-error">
                    <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="10" strokeWidth="2" />
                        <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2" strokeLinecap="round"/>
                        <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <p>{error}</p>
                </div>
            )}

            {weatherData && !loading && (
                <>
                    <div className="App-location">
                        <svg className="location-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div>
                            <h2>
                                {weatherData.location.name}
                                {weatherData.location.region && `, ${weatherData.location.region}`}
                                {weatherData.location.country && `, ${weatherData.location.country}`}
                            </h2>
                            <p className="App-location-labels">
                                <em>
                                    name
                                    {weatherData.location.region && ', region'}
                                    {weatherData.location.country && ', country'}
                                </em>
                            </p>
                        </div>
                    </div>

                    <div className="App-weather-grid">
                        <WeatherCard
                            data={weatherData.current}
                            unit={temperatureUnit}
                            type="current"
                        />

                        <WeatherCard
                            data={weatherData.today}
                            unit={temperatureUnit}
                            type="today"
                        />

                        <WeatherCard
                            data={weatherData.tomorrow}
                            unit={temperatureUnit}
                            type="tomorrow"
                        />
                    </div>

                    <div className="App-details">
                        <div className="detail-item">
                            <span className="detail-label">Feels Like</span>
                            <span className="detail-value">
                                {Math.round(temperatureUnit === 'C' 
                                ? weatherData.current.feelslike_c 
                                : weatherData.current.feelslike_f
                                )}°{temperatureUnit}
                            </span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Humidity</span>
                            <span className="detail-value">{weatherData.current.humidity}%</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Wind Speed</span>
                            <span className="detail-value">
                                {Math.round(temperatureUnit === 'C'
                                ? weatherData.current.wind_kph
                                : weatherData.current.wind_mph
                                )} {temperatureUnit === 'C' ? 'km/h' : 'mph'}
                            </span>
                        </div>
                    </div>
                </>
            )}

            <footer className="App-footer">
                <p>Created by Ricky Leung</p>
            </footer>
        </div>
    );
}

export default App;
