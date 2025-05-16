/**
 * Main javascript file for the plugin's preferences tab.
 */

/**
 * Show/hide error messages when input is (in)valid.
 *
 * @param {Element} input - The input text field.
 */
function validateInput(input) {
    let element;
    let results;

    if (input.dataset.prefKey === "url") {
        element = document.getElementById("urlError");
        results = window.validateUrl(input.value);
    } else if (input.dataset.prefKey === "regex") {
        element = document.getElementById("regexError");
        results = window.validateRegex(input.value);
    }

    window.showHideError(element, results.isValid ? "" : `Error: ${results.error}`);
}

/**
 * Programmatically trigger the "change" event on an HTML element.
 *
 * IINA saves text inputs in the "change" event. Triggering this for additional events for improved responsiveness.
 *
 * @param {Element} element - Trigger on this element.
 */
function dispatchChangeEvent(element) {
    const changeEvent = new Event("change", { bubbles: true });
    element.dispatchEvent(changeEvent);
}

/**
 * Show an input element's current value in a span with class "showValue".
 *
 * @param {Element} input - The input element to read the value from.
 */
function showValueInSpan(input) {
    input.labels.forEach((label) => {
        label.querySelectorAll("span.showValue").forEach((span) => {
            span.textContent = `${input.value} second${input.value == 1 ? "" : "s"}`;
        });
    });
}

// Register event listeners.
document.querySelectorAll('input[type="text"]').forEach((input) => {
    input.addEventListener("input", (event) => dispatchChangeEvent(event.target)); // Save instantly on keypress/paste/etc.
    input.addEventListener("change", (event) => validateInput(event.target)); // Show/hide error messages.
});
document.querySelectorAll('input[type="range"]').forEach((input) => {
    ["input", "change"].forEach((eventType) => {
        input.addEventListener(eventType, (event) => showValueInSpan(event.target)); // Show value in <span>.
    });
});
document.querySelector('input[data-pref-key="auto_enabled"]').addEventListener("change", (event) => {
    // Disable range if checkbox is unchecked.
    document.querySelector('input[data-pref-key="auto_delay"]').disabled = !event.target.checked;
});
document.querySelectorAll("input[data-pref-key]").forEach((input) => {
    // Call validators and the other event listeners on load after IINA calls preferences.get().
    setTimeout(() => dispatchChangeEvent(input), 100);
});
