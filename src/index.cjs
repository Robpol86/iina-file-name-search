/**
 * Main entrypoint.
 */

const { getBasename } = require("./lib.cjs");

/**
 * Event handler for iina.file-loaded.
 *
 * @param {string} url - URL file path to the loaded file.
 */
function onFileLoaded(url) {
    iina.console.log("url", url);
    iina.console.log("basename", getBasename(url));
    iina.core.osd("Starts playing");
}

// Event handlers.
iina.event.on("iina.file-loaded", onFileLoaded);
