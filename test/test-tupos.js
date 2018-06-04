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
            {a: 1},
            [1, 2, 3],
            1,
            "Hello",
            () => 1
        ];
        const results = typesToTest.map(typeOf);
        const answers = [
            types.OBJECT,
            types.ARRAY,
            types.NUMBER,
            types.STRING,
            types.FUNCTION
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