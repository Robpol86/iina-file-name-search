/**
 * Main javascript file for the plugin's sidebar view.
 */

const openBrowserForm = document.getElementById("openBrowserForm");
const radioFileName = document.getElementById("radioFileName");
const radioRegex = document.getElementById("radioRegex");
const searchInput = document.getElementById("searchInput");
const errorInvalidUrl = document.getElementById("errorInvalidUrl");
const errorInvalidInput = document.getElementById("errorInvalidInput");
const openBrowserButton = document.getElementById("openBrowserButton");

/**
 * Enable or disable the Open Browser button.
 */
function enableDisableButton() {
    if (!searchInput.value) {
        openBrowserButton.disabled = true;
        window.showHideError(errorInvalidInput, "Error: search field is empty");
    } else {
        window.showHideError(errorInvalidInput, "");
        if (openBrowserButton.dataset.invalidUrl === "true") {
            openBrowserButton.disabled = true;
        } else {
            openBrowserButton.disabled = false;
        }
    }
}
searchInput.addEventListener("input", enableDisableButton); // Enable/disable when typing.
enableDisableButton(); // Enable/disable on load.

/**
 * Replace searchInput text with default value when user selects a radio button.
 *
 * User can use this to reset any changes they made to the searchInput field.
 *
 * @param {Event} event - Event information.
 */
function fillSearchInput(event) {
    const radio = event.target;
    if (radio.checked) searchInput.value = radio.dataset.searchInputValue ?? "";
    enableDisableButton();
}
radioFileName.addEventListener("change", fillSearchInput);
radioRegex.addEventListener("change", fillSearchInput);

/**
 * Tell the plugin to open a web browser with the search input value.
 */
openBrowserForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Don't clear the form.
    if (!openBrowserButton.disabled) iina.postMessage("open-browser", { search: searchInput.value });
});

// Receive file-loaded message from plugin.
window.onMessageAck("file-loaded", (message) => {
    const { fileNameSansExt, prefsRegex, prefsUrl } = message;

    // File name radio button.
    radioFileName.dataset.searchInputValue = fileNameSansExt;

    // Regex radio button.
    if (prefsRegex) {
        radioFileName.checked = false;
        radioRegex.checked = true;
        // const resultsRegex = window.validateRegex(prefsRegex);
        // if (resultsRegex.isValid) {
        //     radioRegex.dataset.searchInputValue = fileNameSansExt.match(resultsRegex.regex);
        // } else {
        //     radioRegex.dataset.searchInputValue = "";
        //     errors.push(resultsRegex.error);
        // }
    } else {
        radioRegex.checked = false;
        radioFileName.checked = true;
        radioRegex.dataset.searchInputValue = "";
    }

    // Submit button.
    const resultsUrl = window.validateUrl(prefsUrl);
    if (resultsUrl.isValid) {
        openBrowserButton.dataset.invalidUrl = "false";
        window.showHideError(errorInvalidUrl, "");
        openBrowserButton.value = `Open ${resultsUrl.url.hostname}`;
    } else {
        openBrowserButton.dataset.invalidUrl = "true";
        window.showHideError(errorInvalidUrl, "Preferences error: check URL setting");
    }

    enableDisableButton();
});
