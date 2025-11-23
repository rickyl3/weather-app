const FAVORITES_KEY = 'weather_app_favorites';

/**
 * Get all favorite locations from localStorage
 * 
 * @returns {Array} Array of favorite location objects
 */
export const getFavorites = () => {
    try {
        const stored = localStorage.getItem(FAVORITES_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error reading favorites from localStorage:', error);
        return [];
    }
};

/**
 * Save a location to favorites
 * @param {Object} location Location object with name, region, country
 * 
 * @returns {boolean} Success status
 */
export const addFavorite = (location) => {
    try {
        const favorites = getFavorites();

        // Check if exists
        const exists = favorites.some(
            fav => fav.name.toLowerCase() === location.name.toLowerCase() &&
                    fav.country.toLowerCase() === location.country.toLowerCase()
        );
        if (exists) {
            return false;
        }

        const updated = [
            {
                name: location.name,
                region: location.region,
                country: location.country,
                addedAt: new Date().toISOString()
            },
            ...favorites
        ];

        const limited = updated.slice(0, 10);

        localStorage.setItem(FAVORITES_KEY, JSON.stringify(limited));
        return true;
    } catch (error) {
        console.error('Error adding favorite to localStorage:', error);
        return false;
    }
};

/**
 * Remove a location from favorites
 * @param {string} locationName Name of the location to remove
 * 
 * @returns {boolean} Success status
 */
export const removeFavorite = (locationName) => {
    try {
        const favorites = getFavorites();
        const updated = favorites.filter(
            fav => fav.name.toLowerCase() !== locationName.toLowerCase()
        );

        localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
        return true;
    } catch (error) {
        console.error('Error removing favorite from localStorage:', error);
        return false;
    }
};

/**
 * Check if a location is in favorites
 * @param {string} locationName Name of the location to check
 * 
 * @returns {boolean} True if location is favorited
 */
export const isFavorite = (locationName) => {
    const favorites = getFavorites();
    return favorites.some(
        fav => fav.name.toLowerCase() === locationName.toLowerCase()
    );
};

/**
 * Clear all favorites
 * 
 * @returns {boolean} Success status
 */
export const clearFavorites = () => {
    try {
        localStorage.removeItem(FAVORITES_KEY);
        return true;
    } catch (error) {
        console.error('Error clearing favorites from localStorage:', error);
        return false;
    }
};