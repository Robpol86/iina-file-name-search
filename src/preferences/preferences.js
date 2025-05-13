/**
 * Main javascript file for the plugin's preferences tab.
 */

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
    input.addEventListener("input", (event) => dispatchChangeEvent(event.target));
});
