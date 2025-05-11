/**
 * Common strings, functions, and objects used throughout the plugin.
 */

/**
 * Get the file name from a URL without its file extension.
 *
 * @param {string} url - URL to a file.
 *
 * @returns {string} - The file name without the file extension.
 */
function getFileNameSansExt(url) {
    if (!url) return "";

    const lastSepIdx = url.lastIndexOf("/");
    const basename = lastSepIdx < 0 ? url : url.slice(lastSepIdx + 1);

    const lastDotIdx = basename.lastIndexOf(".");
    return lastDotIdx < 1 ? basename : basename.slice(0, lastDotIdx);
}

// Export.
module.exports = {
    getFileNameSansExt,
};
