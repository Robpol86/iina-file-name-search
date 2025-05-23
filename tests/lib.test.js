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

describe("postMessageAck", () => {
    let logs = [];
    let onMessageRegistered = new Map();
    let postMessageSent = [];
    const iina = {
        console: {
            log: (message) => logs.push(message),
            warn: (message) => logs.push(message),
            error: (message) => logs.push(message),
        },
        sidebar: {
            onMessage: (name, callback) => onMessageRegistered.set(name, callback),
            postMessage: (name) => postMessageSent.push(name),
        },
    };

    beforeEach(() => {
        jest.useFakeTimers();
        logs = [];
        onMessageRegistered = new Map();
        postMessageSent = [];
    });

    afterEach(() => {
        jest.clearAllTimers();
        jest.useRealTimers();
    });

    test("one attempt", () => {
        // Send initial message.
        postMessageAck("sidebar", "test", {}, 100, 200, iina);
        expect(logs.pop()).toEqual("postMessageAck(sidebar, test, ...)");
        expect(postMessageSent.pop()).toEqual("test");
        // Remote acknowledges.
        onMessageRegistered.get("test::ack")();
        onMessageRegistered.delete("test::ack");
        expect(logs.pop()).toEqual("sidebar acknowledged test message");
        // Confirm timer cancelled.
        jest.advanceTimersByTime(2000);
        expect(logs).toHaveLength(0);
        expect(onMessageRegistered.size).toEqual(0);
        expect(postMessageSent).toHaveLength(0);
    });

    test("two attempts", () => {
        // Send initial message.
        postMessageAck("sidebar", "test", {}, 100, 200, iina);
        expect(logs.pop()).toEqual("postMessageAck(sidebar, test, ...)");
        expect(postMessageSent.pop()).toEqual("test");
        // Advance timer to second attempt.
        jest.advanceTimersByTime(99);
        expect(logs).toHaveLength(0);
        expect(postMessageSent).toHaveLength(0);
        jest.advanceTimersByTime(1);
        expect(logs.shift()).toEqual("sidebar did not respond for test, re-sending");
        expect(logs.pop()).toEqual("postMessageAck(sidebar, test, ...)");
        expect(postMessageSent.pop()).toEqual("test");
        // Remote acknowledges.
        onMessageRegistered.get("test::ack")();
        onMessageRegistered.delete("test::ack");
        expect(logs.pop()).toEqual("sidebar acknowledged test message");
        // Confirm timer cancelled.
        jest.advanceTimersByTime(2000);
        expect(logs).toHaveLength(0);
        expect(onMessageRegistered.size).toEqual(0);
        expect(postMessageSent).toHaveLength(0);
    });

    test.each([2, 3])("timeout::attempts=%d", (attempts) => {
        // Send initial message.
        postMessageAck("sidebar", "test", {}, 100, attempts === 2 ? 200 : 201, iina);
        expect(logs.pop()).toEqual("postMessageAck(sidebar, test, ...)");
        // Advance timer to second attempt.
        jest.advanceTimersByTime(100);
        expect(logs.shift()).toEqual("sidebar did not respond for test, re-sending");
        expect(logs.pop()).toEqual("postMessageAck(sidebar, test, ...)");
        // Advance timer to third attempt.
        jest.advanceTimersByTime(100);
        if (attempts === 2) {
            // Timeout before third attempt.
            expect(logs.pop()).toEqual("sidebar did not respond for test, timed out, aborting message");
        } else {
            expect(logs.shift()).toEqual("sidebar did not respond for test, re-sending");
            expect(logs.pop()).toEqual("postMessageAck(sidebar, test, ...)");
            jest.advanceTimersByTime(100);
            expect(logs.pop()).toEqual("sidebar did not respond for test, timed out, aborting message");
        }
        // Confirm no more timers.
        jest.advanceTimersByTime(2000);
        expect(logs).toHaveLength(0);
    });
});
