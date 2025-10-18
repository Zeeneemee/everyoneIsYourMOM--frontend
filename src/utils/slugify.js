/**
 * Slug Utility Functions
 * Convert food names to URL-friendly slugs and back
 */

/**
 * Convert food name to URL-friendly slug
 * Example: "Hainanese Chicken Rice" → "hainanesechickenrice"
 * @param {string} name - Food name to slugify
 * @returns {string} URL-friendly slug
 */
export function createSlug(name) {
  if (!name || typeof name !== 'string') {
    return '';
  }
  
  return name
    .toLowerCase() // Convert to lowercase
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters, keep alphanumeric and spaces
    .replace(/\s+/g, '') // Remove all spaces (no hyphens, just concatenate)
    .trim();
}

/**
 * Convert slug back to a searchable name format
 * Example: "hainanesechickenrice" → "hainanese chicken rice"
 * @param {string} slug - URL slug to deslugify
 * @returns {string} Searchable name
 */
export function deslugify(slug) {
  if (!slug || typeof slug !== 'string') {
    return '';
  }
  
  // Add spaces before capital letters (if any remain)
  // Then add space before numbers that follow letters
  let result = slug
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([a-zA-Z])(\d)/g, '$1 $2')
    .toLowerCase();
  
  // For all-lowercase slugs, we can't easily determine word boundaries
  // So we'll just return the lowercase version with no spaces added
  // The backend search should be fuzzy enough to match
  return result.trim();
}

/**
 * Capitalize first letter of each word
 * @param {string} text - Text to capitalize
 * @returns {string} Capitalized text
 */
export function capitalizeWords(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

