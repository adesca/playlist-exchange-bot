import {describe, expect, test} from "vitest";
import {rotateArray} from "./util";

describe('rotateArray', function () {
    test('should rotate an array of strings', function () {
        const rotatedArr = rotateArray(["a", "b"], 1)

        expect(rotatedArr).toEqual(["b", "a"])
    });

    test('should rotate an array once if the count is 0', function () {
        const rotatedArr = rotateArray(["a", "b", "c"], 0)

        expect(rotatedArr).toEqual(["b", "c", "a"]);
    });

    test('should rotate an array once if the count is the length', function () {
        const rotatedArr = rotateArray(["a", "b", "c"], 3)

        expect(rotatedArr).toEqual(["b", "c", "a"]);

    });

    test('should rotate an array once if the count is  greater than the length', function () {
        const rotatedArr = rotateArray(["a", "b", "c"], 3)

        expect(rotatedArr).toEqual(["b", "c", "a"]);

    });
});