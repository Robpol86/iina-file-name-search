/**
 * Shared code used in web views.
 *
 * Some APIs such as `URL` are not available in entry JS but available in web views.
 */

/**
 * Validate user-provided regex from preferences.
 *
 * @param {string} regex - Regex to validate.
 *
 * @returns {{isValid: boolean, error: string, regex: RegExp|null}} - Validation result with error message and parsed regex pattern.
 */
function validateRegex(regex) {
    const results = {
        isValid: false,
        error: "",
        regex: null,
    };

    // If regex is empty consider it valid (regex is optional).
    if (!regex) {
        results.isValid = true;
        return results;
    }

    // Check if regex is valid.
    let parsedRegex;
    try {
        parsedRegex = new RegExp(regex);
    } catch (exc) {
        results.error = exc.message;
        return results;
    }

    results.regex = parsedRegex;
    results.isValid = true;
    return results;
}

/**
 * Validate user-provided URL from preferences.
 *
 * @param {string} url - URL to validate.
 *
 * @returns {{isValid: boolean, error: string, url: URL|null}} - Validation result with error message and parsed URL.
 */
function validateUrl(url) {
    const results = {
        isValid: false,
        error: "",
        url: null,
    };

    // Check if empty.
    if (!url) {
        results.error = "A URL must be specified";
        return results;
    }

    // Check if https:// or http:// is missing from the start of the URL.
    if (!/^https?:\/\//.test(url)) {
        results.error = "URL must start with https:// or http://";
        return results;
    }

    // Check if %s is present.
    if (!url.includes("%s")) {
        results.error = "%s must be somewhere in the URL";
        return results;
    }

    // Check if URL is parsable.
    let parsedUrl;
    try {
        parsedUrl = new URL(url);
    } catch (exc) {
        results.error = exc.message;
        return results;
    }

    results.url = parsedUrl;
    results.isValid = true;
    return results;
}

/**
 * Hide or show an error message in an HTML element if the errorMessage is empty or not, respectively.
 *
 * @param {Element} element - The element to update.
 * @param {string} errorMessage - Show this error message as textContent of the element.
 */
function showHideError(element, errorMessage) {
    if (errorMessage) {
        element.textContent = errorMessage;
        element.classList.remove("hidden");
    } else {
        element.classList.add("hidden");
    }
}

// Export.
if (typeof module === "object") {
    module.exports = {
        validateUrl,
        validateRegex,
        showHideError,
    };
} else {
    window.validateUrl = validateUrl;
    window.validateRegex = validateRegex;
    window.showHideError = showHideError;
}
