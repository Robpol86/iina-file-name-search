import { afterEach, beforeEach, describe, expect, jest, test } from "@jest/globals";
import { getFileNameSansExt, postMessageAck } from "../src/lib.cjs";

describe("getFileNameSansExt", () => {
    test.each([
        ["file:///Users/me/Downloads/file.mp4", "file"],
        ["file:///Users/me/Downloads/file", "file"],
        ["file:///Users/me/Downloads/.file", ".file"],
        ["file:///Users/me/Downloads/a.b.c", "a.b"],
        ["file:///Users/me/Downloads/.a.b.c", ".a.b"],
        ["file:///Users/me/Downloads/video%20file.mp4", "video file"],
        ["file.video.mp4", "file.video"],
        ["file.mp4", "file"],
        ["file", "file"],
        [".file", ".file"],
        ["", ""],
    ])("getFileNameSansExt::%s:%s", (filePath, basename) => {
        expect(getFileNameSansExt(filePath)).toEqual(basename);
    });
});
