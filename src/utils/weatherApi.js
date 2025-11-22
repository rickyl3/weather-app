import axios from 'axios';

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const BASE_URL = process.env.REACT_APP_WEATHER_API_BASE_URL || 'https://api.weatherapi.com/v1';

/**
 * Fetch weather forecast data for a given location
 * @param {string} location City name, zip code, or coordinates
 * 
 * @returns {Promise} Weather data including current and forecast
 */
export const fetchWeatherForecast = async (location) => {
    try {
        if (!API_KEY) {
            throw new Error('API key is not configured. Please add WEATHER_API_KEY to your .env file');
        }

        const response = await axios.get(`${BASE_URL}/forecast.json`, {
            params: {
                key: API_KEY,
                q: location,
                days: 2,
                aqi: 'no',
                alerts: 'no'
            }
        });

        return {
            success: true,
            data: parseWeatherData(response.data)
        };
    } catch (error) {
        return {
            success: false,
            error: parseError(error)
        };
    }
}

/**
 * Parse and structure the weather data
 */
const parseWeatherData = (data) => {
    const current = data.current;
    const forecast = data.forecast.forecastday;

    return {
        location: {
            name: data.location.name,
            region: data.location.region,
            country: data.location.country,
            localtime: data.location.localtime
        },
        current: {
            temp_c: current.temp_c,
            temp_f: current.temp_f,
            condition: {
                text: current.condition.text,
                icon: current.condition.icon,
                code: current.condition.code
            },
            humidity: current.humidity,
            wind_kph: current.wind_kph,
            wind_mph: current.wind_mph,
            feelslike_c: current.feelslike_c,
            feelslike_f: current.feelslike_f
        },
        today: {
            date: forecast[0].date,
            maxtemp_c: forecast[0].day.maxtemp_c,
            maxtemp_f: forecast[0].day.maxtemp_f,
            mintemp_c: forecast[0].day.mintemp_c,
            mintemp_f: forecast[0].day.mintemp_f,
            condition: {
                text: forecast[0].day.condition.text,
                icon: forecast[0].day.condition.icon
            }
        },
        tomorrow: {
            date: forecast[1].date,
            maxtemp_c: forecast[1].day.maxtemp_c,
            maxtemp_f: forecast[1].day.maxtemp_f,
            mintemp_c: forecast[1].day.mintemp_c,
            mintemp_f: forecast[1].day.mintemp_f,
            condition: {
                text: forecast[1].day.condition.text,
                icon: forecast[1].day.condition.icon
            }
        }
    };
}

/**
 * Parse and structure the error response
 */
const parseError = (error) => {
    if (error.response) {
        // API responded with error
        const status = error.response.status;
        const message = error.response.data?.error?.message;

        if (status === 400) {
            return 'Invalid location. Please try a differnet city name or zip code.';
        }
        if (status === 401) {
            return 'Invalid API key. Please check your configuration.';
        }
        if (status === 403) {
            return 'API access denied. Please check you subscription.';
        }

        return message || 'Failed to fetch weather data. Please try again.';
    } else if (error.request) {
        // Request made but no response
        return 'Unable to reach weather service. Please check your internet connection.';
    } else {
        return error.message || 'An unexpected error occurred.';
    }
}

/**
 * Get user's current location using geolocation API
 * 
 * @returns {Promise} Coordinates or error
 */
export const getUserLocation = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const coords = `${position.coords.latitude},${position.coords.longitude}`;
                resolve(coords);
            },
            (error) => {
                reject(new Error('Unable to retrieve your location'));
            }
        );
    });
}