/**
 * Main entrypoint.
 */

const { getFileNameSansExt } = require("./lib.cjs");

// let OVERLAY_LOADED = false; // TODO await this

function onWindowLoaded() {
    iina.console.log("onWindowLoaded");
    iina.overlay.loadFile("src/overlay.html");
}

function onOverlayLoaded() {
    iina.console.log("onOverlayLoaded");
    iina.overlay.show();
    // OVERLAY_LOADED = true;
}

/**
 * Event handler for iina.file-loaded.
 *
 * @param {string} currentFile - Currently loaded media file path as a URL.
 */
async function onFileLoaded(currentFile) {
    iina.console.log("onFileLoaded");

    if (iina.preferences.get("auto_search") !== true) {
        iina.console.log("auto_search not enabled, noop");
        return;
    }

    const prefsUrl = iina.preferences.get("url");
    if (!prefsUrl) {
        iina.console.error("PLUGIN ERROR: No URL specified");
        iina.core.osd("PLUGIN ERROR: No URL specified");
        return;
    } else if (!prefsUrl.includes("%s")) {
        iina.console.error("PLUGIN ERROR: %s is missing from url");
        iina.core.osd("PLUGIN ERROR: %s is missing from url");
        return;
    }

    let videoName = getFileNameSansExt(currentFile);
    const prefsRegex = iina.preferences.get("regex");
    if (prefsRegex) {
        let regex;
        try {
            regex = new RegExp(prefsRegex);
        } catch (exc) {
            iina.console.error(`PLUGIN ERROR: invalid regex: ${exc.message}`);
            iina.core.osd("PLUGIN ERROR: invalid regex");
            return;
        }
        const match = videoName.match(regex);
        if (!match) {
            iina.console.log("regex did not match, noop");
            return;
        }
        videoName = match[0];
    }

    // iina.utils.open(prefsUrl.replace("%s", videoName));
}

// Event handlers.
iina.event.on("iina.plugin-overlay-loaded", onOverlayLoaded);
iina.event.on("iina.window-loaded", onWindowLoaded);
iina.event.on("iina.file-loaded", onFileLoaded);
