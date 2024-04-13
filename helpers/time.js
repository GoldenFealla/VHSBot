/**
 * @param {number} duration
 * @returns {string} 
 */
export const getSeconds = (duration) => {
    return Math.floor(duration % 60).toString().padStart(2, '0')
}

/**
 * @param {number} duration
 * @returns {string} 
 */
export const getMinutes = (duration) => {
    return Math.floor(duration % 3600 / 60).toString().padStart(2, '0')
}

/**
 * @param {number} duration
 * @returns {string} 
 */
export const getHours = (duration) => {
    return Math.floor(duration % 60).toString().padStart(2, '0')
}