/**
 * Main entrypoint.
 */

/**
 * Event handler for iina.file-loaded.
 *
 * @param {string} url - URL file path to the loaded file.
 */
function onFileLoaded(url) {
    iina.console.log("Url", url);
    iina.core.osd("Starts playing");
}

// Event handlers.
iina.event.on("iina.file-loaded", onFileLoaded);
