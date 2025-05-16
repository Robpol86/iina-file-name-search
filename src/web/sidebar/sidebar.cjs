/**
 * Main javascript file for the plugin's sidebar view.
 */

const openBrowserForm = document.getElementById("openBrowserForm");
const radioFileName = document.getElementById("radioFileName");
const radioRegex = document.getElementById("radioRegex");
const warningInvalidRegexContainer = document.getElementById("warningInvalidRegexContainer");
const warningInvalidRegex = document.getElementById("warningInvalidRegex");
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
 * Show/hide regex warnings.
 */
function showHideRegexWarning() {
    if (radioRegex.checked) warningInvalidRegexContainer.classList.remove("hidden");
    else warningInvalidRegexContainer.classList.add("hidden");
}
radioFileName.addEventListener("change", showHideRegexWarning);
radioRegex.addEventListener("change", showHideRegexWarning);
showHideRegexWarning();

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

/**
 * Receive file-loaded message from plugin.
 */
window.onMessageAck("file-loaded", (message) => {
    const { fileNameSansExt, prefsRegex, prefsUrl } = message;
    let defaultRadioRegex = false;

    // Submit button.
    const resultsUrl = window.validateUrl(prefsUrl);
    if (!resultsUrl.isValid) {
        openBrowserButton.dataset.invalidUrl = "true";
        window.showHideError(errorInvalidUrl, "Preferences error: check URL setting");
    } else {
        openBrowserButton.dataset.invalidUrl = "false";
        window.showHideError(errorInvalidUrl, "");
        openBrowserButton.value = `Open ${resultsUrl.url.hostname}`;
    }

    // File name radio button.
    radioFileName.dataset.searchInputValue = fileNameSansExt;

    // Regex radio button.
    if (!prefsRegex) {
        radioRegex.dataset.searchInputValue = "";
        window.showHideError(warningInvalidRegex, "No regex specified in plugin preferences");
    } else {
        const resultsRegex = window.validateRegex(prefsRegex);
        if (!resultsRegex.isValid) {
            radioRegex.dataset.searchInputValue = "";
            window.showHideError(warningInvalidRegex, "Preferences error: check regex setting");
        } else {
            const match = fileNameSansExt.match(resultsRegex.regex);
            const matchText = match ? match[0] : "";
            radioRegex.dataset.searchInputValue = matchText;
            if (!matchText) {
                window.showHideError(warningInvalidRegex, "Regex did not match");
            } else {
                window.showHideError(warningInvalidRegex, "");
                defaultRadioRegex = true;
            }
        }
    }

    // Select default radio button.
    if (defaultRadioRegex) {
        radioFileName.checked = false;
        radioRegex.checked = true;
        fillSearchInput({ target: radioRegex });
    } else {
        radioRegex.checked = false;
        radioFileName.checked = true;
        fillSearchInput({ target: radioFileName });
    }

    showHideRegexWarning();
    enableDisableButton();
});
