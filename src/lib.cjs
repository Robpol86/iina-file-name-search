/**
 * Common strings, functions, and objects used throughout the plugin.
 */

/**
 * Get the basename of a file URL.
 *
 * @param {string} url - URL to a file.
 *
 * @returns {string} - The basename.
 */
function getBasename(url) {
    if (!url) return "";
    const lastDelimIdx = url.lastIndexOf("/");

    // Handle filename-only.
    if (lastDelimIdx < 0) return url;

    const basename = url.slice(lastDelimIdx + 1);
    return basename;
}

// Export.
module.exports = {
    getBasename,
};
