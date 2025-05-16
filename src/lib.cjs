/**
 * Shared code used outside of web views.
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

/**
 * Guarantee that a message is sent to the target web view.
 *
 * There is a race condition when a message is sent to a sidebar that is not done initializing. This function sets a timer
 * that re-sends the message if the sidebar does not acknowledge receipt of the message.
 *
 * @param {string} target - "sidebar" or "overlay".
 * @param {string} name - Message name passed to postMessage().
 * @param {any} payload - Message payload passed to postMessage().
 * @param {number} retryIn - Retry in these many ms.
 * @param {number} timeout - Stop retrying after these many ms.
 * @param {IINA.API} _iina - iina object, for testing.
 */
function postMessageAck(target, name, payload, retryIn = 100, timeout = 1000, _iina = iina) {
    _iina.console.log(`postMessageAck(${target}, ${name}, ...)`);
    const namespace = target === "sidebar" ? _iina.sidebar : _iina.overlay;
    let timeoutId;

    // Setup ack listener.
    namespace.onMessage(`${name}::ack`, () => {
        _iina.console.log(`${target} acknowledged ${name} message`);
        clearTimeout(timeoutId);
    });

    // Setup re-send timer.
    timeoutId = setTimeout(() => {
        timeout -= retryIn;
        if (timeout < 0) {
            _iina.console.error(`${target} did not respond for ${name}, timed out, aborting message`);
            return;
        }
        _iina.console.warn(`${target} did not respond for ${name}, re-sending`);
        postMessageAck(target, name, payload, retryIn, timeout, _iina);
    }, retryIn);

    // Send the message.
    namespace.postMessage(name, payload);
}

// Export.
module.exports = {
    getFileNameSansExt,
    postMessageAck,
};
