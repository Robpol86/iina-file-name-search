/**
 * Main javascript file for the plugin's preferences tab.
 */

/**
 * Show/hide error messages when input is (in)valid.
 *
 * @param {Element} input - The input text field.
 */
function validateInput(input) {
    if (input.dataset.prefKey === "url") {
        // Show error if %s is missing.
        const missing_s = document.getElementById("missing_s");
        if (input.value.includes("%s")) missing_s.classList.add("hidden");
        else missing_s.classList.remove("hidden");
        // Show error if https:// or http:// is missing.
        const missing_http = document.getElementById("missing_http");
        if (/^https?:\/\//.test(input.value)) missing_http.classList.add("hidden");
        else missing_http.classList.remove("hidden");
    } else if (input.dataset.prefKey === "regex") {
        // Show error if regex is invalid. If input is empty consider it valid, regex is optional.
        const bad_regex = document.getElementById("bad_regex");
        const bad_regex_message = document.getElementById("bad_regex_message");
        let valid = true;
        if (input.value) {
            try {
                new RegExp(input.value);
            } catch (exc) {
                bad_regex_message.textContent = exc.message;
                bad_regex.classList.remove("hidden");
                valid = false;
            }
        }
        if (valid) bad_regex.classList.add("hidden");
    }
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

// Register event listeners.
document.querySelectorAll('input[type="text"]').forEach((input) => {
    input.addEventListener("input", (event) => dispatchChangeEvent(event.target)); // Save instantly on keypress/paste/etc.
    input.addEventListener("change", (event) => validateInput(event.target)); // Show/hide error messages.
    setTimeout(() => validateInput(input), 100); // Validate on load after IINA calls preferences.get().
});
