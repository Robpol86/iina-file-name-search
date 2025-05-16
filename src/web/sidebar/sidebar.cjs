/**
 * Main javascript file for the plugin's sidebar view.
 */

const openBrowserForm = document.getElementById("openBrowserForm");
const radioFileName = document.getElementById("radioFileName");
const radioRegex = document.getElementById("radioRegex");
const warningInvalidRegexContainer = document.getElementById("warningInvalidRegexContainer");
const searchInput = document.getElementById("searchInput");
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
        openBrowserButton.disabled = false;
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
