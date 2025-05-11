import { describe, expect, test } from "@jest/globals";
import { getFileNameSansExt } from "../src/lib.cjs";

describe("getFileNameSansExt", () => {
    test.each([
        ["file:///Users/me/Downloads/file.mp4", "file"],
        ["file:///Users/me/Downloads/file", "file"],
        ["file:///Users/me/Downloads/.file", ".file"],
        ["file:///Users/me/Downloads/a.b.c", "a.b"],
        ["file:///Users/me/Downloads/.a.b.c", ".a.b"],
        ["file.video.mp4", "file.video"],
        ["file.mp4", "file"],
        ["file", "file"],
        [".file", ".file"],
        ["", ""],
    ])("getFileNameSansExt::%s:%s", (filePath, basename) => {
        expect(getFileNameSansExt(filePath)).toEqual(basename);
    });
});
