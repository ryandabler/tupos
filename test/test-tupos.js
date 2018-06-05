////////////////////////////
// Initialize
////////////////////////////
const chai  = require("chai");
const {
    typeOf,
    isIterable
} = require("../src/tupos");
const types = require("../src/constants");

const expect = chai.expect;

////////////////////////////
// Test
////////////////////////////
describe("typeOf()", function() {
    it("Should return type of supplied parameter", function() {
        const typesToTest = [
            () => 1,
            {a: 1},
            1,
            [1, 2, 3],
            "Hello",
            new Map(),
            new WeakMap(),
            new Set(),
            new WeakSet(),
            undefined,
            null,
            true,
            Symbol("a"),
            new Error("Test"),
            Math,
            new Date(),
            /ag/,
            new Promise(() => {}),
            new Int8Array(),
            new Uint8Array(),
            new Uint8ClampedArray(),
            new Int16Array(),
            new Uint16Array(),
            new Int32Array(),
            new Uint32Array(),
            new Float32Array(),
            new Float64Array(),
            new ArrayBuffer(),
            new DataView(new ArrayBuffer()),
            JSON,
            (function* a() {})(),
            function* a() {},
            WebAssembly,
            async () => {}
        ];
        const results = typesToTest.map(typeOf);
        const answers = [
            types.FUNCTION,
            types.OBJECT,
            types.NUMBER,
            types.ARRAY,
            types.STRING,
            types.MAP,
            types.WEAKMAP,
            types.SET,
            types.WEAKSET,
            types.UNDEFINED,
            types.NULL,
            types.BOOLEAN,
            types.SYMBOL,
            types.ERROR,
            types.MATH,
            types.DATE,
            types.REGEXP,
            types.PROMISE,
            types.INT8ARRAY,
            types.UINT8ARRAY,
            types.UINT8CLAMPEDARRAY,
            types.INT16ARRAY,
            types.UINT16ARRAY,
            types.INT32ARRAY,
            types.UINT32ARRAY,
            types.FLOAT32ARRAY,
            types.FLOAT64ARRAY,
            types.ARRAYBUFFER,
            types.DATAVIEW,
            types.JSON,
            types.GENERATOR,
            types.GENERATORFUNC,
            types.WASM,
            types.ASYNCFUNC
        ];

        results.forEach((result, idx) => {
            expect(result).to.equal(answers[idx]);
        });
    });
});

describe("isIterable()", function() {
    it("Should return true", function() {
        const objectsToTest = [
            [1, 2, 3],
            new Map(),
            "Hello",
        ];
        const results = objectsToTest.map(isIterable);

        results.forEach(result => {
            expect(result).to.be.true;
        });
    });

    it("Should return false", function() {
        const objectsToTest = [
            1,
            {a: 1},
            () => {},
            null
        ];
        const results = objectsToTest.map(isIterable);

        results.forEach(result => {
            expect(result).to.be.false;
        });
    });

    it("Should return false when no arguments are supplied passed", function() {
        expect(isIterable()).to.be.false;
    });
});