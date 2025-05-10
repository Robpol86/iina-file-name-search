/**
 * Main entrypoint.
 */

iina.console.log("Outer");

iina.event.on("mpv.file-loaded", () => {
    iina.console.log("Inner");
    iina.core.osd("Starts playing");
});
