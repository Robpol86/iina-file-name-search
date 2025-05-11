/**
 * Main entrypoint.
 */

const { getFileNameSansExt } = require("./lib.cjs");

/**
 * Event handler for iina.file-loaded.
 *
 * @param {string} currentFile - Currently loaded media file path as a URL.
 */
function onFileLoaded(currentFile) {
    iina.console.log("Url", currentFile);
    iina.console.log("Name", getFileNameSansExt(currentFile));
    iina.core.osd("Starts playing");
}

// Event handlers.
iina.event.on("iina.file-loaded", onFileLoaded);
