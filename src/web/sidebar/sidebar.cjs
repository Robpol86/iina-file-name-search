/**
 * Main javascript file for the plugin's sidebar view.
 */

const radioFileName = document.getElementById("radioFileName");
const radioRegex = document.getElementById("radioRegex");
const searchInput = document.getElementById("searchInput");

/**
 * Replace searchInput text with default value when user selects a radio button.
 *
 * User can use this to reset any changes they made to the searchInput field.
 *
 * @param {Event} event - Event information.
 */
function fillSearchInput(event) {
    const radio = event.target;
    searchInput.value = radio.dataset.searchInputValue ?? "";
}
radioFileName.addEventListener("change", fillSearchInput);
radioRegex.addEventListener("change", fillSearchInput);
