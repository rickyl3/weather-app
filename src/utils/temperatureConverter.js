/**
 * Convert Celsius to Fahrenheit
 * @param {number} celsius - Temperature in Celsius
 * 
 * @returns {number} Temperature in Fahrenheit
 */
export const celsiusToFahrenheit = (celsius) => {
  return Math.round((celsius * 9/5) + 32);
};

/**
 * Convert Fahrenheit to Celsius
 * @param {number} fahrenheit - Temperature in Fahrenheit
 * 
 * @returns {number} Temperature in Celsius
 */
export const fahrenheitToCelsius = (fahrenheit) => {
  return Math.round((fahrenheit - 32) * 5/9);
};

/**
 * Format temperature with unit symbol
 * @param {number} temp - Temperature value
 * @param {string} unit - 'C' or 'F'
 * 
 * @returns {string} Formatted temperature string
 */
export const formatTemperature = (temp, unit) => {
  return `${Math.round(temp)}°${unit}`;
};

/**
 * Get temperature in the specified unit
 * @param {number} celsius - Temperature in Celsius (from API)
 * @param {string} unit - 'C' or 'F'
 * 
 * @returns {number} Temperature in the specified unit
 */
export const getTemperatureInUnit = (celsius, unit) => {
  return unit === 'F' ? celsiusToFahrenheit(celsius) : celsius;
};
