/**
 * Common strings, functions, and objects used throughout the plugin.
 */

/**
 * Get the basename and dirname of a path.
 *
 * @param {string} filePath - Input file path.
 * @param {boolean} dirnameKeepSlash - Keep the trailing slash in the dirname.
 *
 * @returns {[string, string]} - The basename and the dirname.
 */
function getBasename(filePath, dirnameKeepSlash = false) {
    if (!filePath) return ["", dirnameKeepSlash ? "./" : "."];
    const lastDelimIdx = filePath.lastIndexOf("/");

    // Handle filename-only.
    if (lastDelimIdx < 0) return [filePath, dirnameKeepSlash ? "./" : "."];

    // Handle file in root.
    if (lastDelimIdx === 0) return [filePath.slice(1), "/"];

    const basename = filePath.slice(lastDelimIdx + 1);
    const dirname = filePath.slice(0, lastDelimIdx + (dirnameKeepSlash ? 1 : 0));
    return [basename, dirname];
}

// Export.
if (typeof exports === "object" && typeof module !== "undefined") {
    // For tests.
    module.exports = { getBasename };
}
