import { describe, expect, test } from "@jest/globals";
import { getBasename } from "../src/lib.cjs";

describe("getBasename", () => {
    test.each([
        ["file:///Users/me/Downloads/file.mp4", "file.mp4"],
        ["file.mp4", "file.mp4"],
        ["", ""],
    ])("getBasename::%s:%s", (filePath, basename) => {
        expect(getBasename(filePath)).toEqual(basename);
    });
});
