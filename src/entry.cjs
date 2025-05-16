/**
 * Main entrypoint.
 */

const { getFileNameSansExt, postMessageAck } = require("./lib.cjs");

/**
 * Open a web browser.
 *
 * @param {{search: string}} message - Message from sidebar.
 */
function openBrowser(message) {
    iina.console.log(`openBrowser(${message.search})`);

    const prefsUrl = iina.preferences.get("url");
    iina.utils.open(prefsUrl.replace("%s", message.search));
}

/**
 * Event handler for iina.window-loaded.
 */
function onWindowLoaded() {
    iina.console.log("onWindowLoaded");
    // Initialize the sidebar.
    iina.sidebar.loadFile("src/web/sidebar/sidebar.html");
    iina.sidebar.onMessage("open-browser", openBrowser);
}

/**
 * Event handler for iina.file-loaded.
 *
 * @param {string} fileUrl - Currently loaded media file path as a URL.
 */
function onFileLoaded(fileUrl) {
    iina.console.log("onFileLoaded");

    // Update sidebar.
    postMessageAck("sidebar", "file-loaded", {
        fileNameSansExt: getFileNameSansExt(fileUrl),
        prefsRegex: iina.preferences.get("regex"),
        prefsUrl: iina.preferences.get("url"),
    });
}

// Menu items.
iina.menu.addItem(iina.menu.item("Show Sidebar", () => iina.sidebar.show()));

// Event handlers.
iina.event.on("iina.window-loaded", onWindowLoaded);
iina.event.on("iina.file-loaded", onFileLoaded);
