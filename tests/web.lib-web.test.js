import { describe, expect, test } from "@jest/globals";
import { validateRegex, validateUrl } from "../src/web/lib-web.cjs";

describe("validateRegex", () => {
    test("valid", () => {
        expect(validateRegex("^[a-z]")).toMatchObject({
            isValid: true,
            error: "",
        });
    });

    test("empty", () => {
        expect(validateRegex("")).toMatchObject({
            isValid: true,
            error: "",
        });
    });

    test("invalid", () => {
        expect(validateRegex("^[a-z")).toMatchObject({
            isValid: false,
            error: "Invalid regular expression: /^[a-z/: Unterminated character class",
        });
    });
});

describe("validateUrl", () => {
    test("valid", () => {
        expect(validateUrl("https://google.com/search?q=%s")).toMatchObject({
            isValid: true,
            error: "",
        });
    });

    test("empty", () => {
        expect(validateUrl("")).toMatchObject({
            isValid: false,
            error: "A URL must be specified",
        });
    });

    test("missing %s", () => {
        expect(validateUrl("https://google.com")).toMatchObject({
            isValid: false,
            error: "%s must be somewhere in the URL",
        });
    });

    test("missing protocol", () => {
        expect(validateUrl("google.com/search?q=%s")).toMatchObject({
            isValid: false,
            error: "URL must start with https:// or http://",
        });
    });

    test("invalid", () => {
        expect(validateUrl("https://%s")).toMatchObject({
            isValid: false,
            error: "Invalid URL",
        });
    });
});
