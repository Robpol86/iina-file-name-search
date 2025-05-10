import { describe, expect, test } from "@jest/globals";
import { getBasename } from "../src/lib.cjs";

describe("getBasename", () => {
    test.each([
        ["/tmp/file.txt", false, "file.txt", "/tmp"],
        ["/tmp/file.txt", true, "file.txt", "/tmp/"],
        ["file.txt", false, "file.txt", "."],
        ["file.txt", true, "file.txt", "./"],
        ["./file.txt", false, "file.txt", "."],
        ["./file.txt", true, "file.txt", "./"],
        ["/file.txt", false, "file.txt", "/"],
        ["/file.txt", true, "file.txt", "/"],
        ["", false, "", "."],
        ["", true, "", "./"],
    ])("getBasename::%s:%s", (filePath, keepSlash, basename, dirname) => {
        expect(getBasename(filePath, keepSlash)).toEqual([basename, dirname]);
    });
});
