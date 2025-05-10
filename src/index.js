/**
 * Main entrypoint.
 */

const { console, core, event } = iina;

console.log("Hello, world!");

event.on("mpv.file-loaded", () => {
  core.osd("Starts playing");
});
