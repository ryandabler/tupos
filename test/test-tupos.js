////////////////////////////
// Initialize
////////////////////////////
const chai  = require("chai");
const {
    typeOf,
    isIterable,
    isPrimitive,
    areSameType,
    is,
    are,
    isOneOf,
    areOneOf,
    isInstanceOf,
    areInstancesOf,
    isEnum,
    areEnum,
    hasInterface,
    haveInterface,
    hasShape,
    haveShape,
    isArrayOf,
    areArraysOf
} = require("../src/tupos");
const types = require("../src/constants");

const expect = chai.expect;

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
    // (function* a() {})(),
    // function* a() {},
    WebAssembly,
    // async () => {}
    // (async function* a() {})(),
    // async function* a() {},
    // new Blob(['abc'], { type: 'text/plain' })
    new URL('http://www.google.com'),
    new URLSearchParams('q=URLUtils.searchParams&topic=api')
];

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
    // types.GENERATOR,
    // types.GENERATORFUNC,
    types.WASM,
    // types.ASYNCFUNC
    // types.ASYNCGENERATOR,
    // types.ASYNCGENERATORFUNC,
    // types.BLOB
    types.URL,
    types.URLPARAMS
];

const getNTypes = n => {
    const types = [ ...answers ];
    const instances = [ ...typesToTest ];
    const result = [ [], [], [] ];

    while (result[0].length < n) {
        const i = Math.floor(Math.random() * types.length);
        result[0].push(...types.splice(i, 1));
        result[1].push(...instances.splice(i, 1));
    }

    while (result[2].length < n) {
        const i = Math.floor(Math.random() * instances.length);
        result[2].push(instances[i])
    }

    return result;
}

////////////////////////////
// Test
////////////////////////////
describe("typeOf()", function() {
    it("Should return type of supplied parameter", function() {
        const results = typesToTest.map(typeOf);

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

describe("isPrimitive()", function() {
    it("Should return true", function() {
        const objectsToTest = [
            1,
            "Abc",
            null,
            undefined,
            true,
            Symbol.for("a")
        ];
        const results = objectsToTest.map(isPrimitive);

        results.forEach(result => {
            expect(result).to.be.true;
        });
    });

    it("Should return false", function() {
        const objectsToTest = [
            [1],
            {},
            new Set(),
            new Map(),
            new Error(),
            new Date(),
            /a/,
            () => {}
        ];
        const results = objectsToTest.map(isPrimitive);

        results.forEach(result => {
            expect(result).to.be.false;
        });
    });
});

describe("areSameType()", function() {
    it("Should return true if only passed one param", function() {
        const objectsToTest = [
            1,
            "Abc",
            null,
            undefined,
            true,
            Symbol.for("a")
        ];
        const results = objectsToTest.map(item => areSameType(item));
        
        results.forEach(result => {
            expect(result).to.be.true;
        });
    });

    it("Should return true", function() {
        const objectsToTest = [
            [1, 2, -6],
            ["Abc", "Def"],
            [true, false],
            [() => {}, function() {}]
        ];
        const results = objectsToTest.map(obj => areSameType(...obj));

        results.forEach(result => {
            expect(result).to.be.true;
        });
    });

    it("Should return false", function() {
        const objectsToTest = [
            [1, "a"],
            ["Abc", "Def", true],
            [true, /a/, "abd", () => {}]
        ];
        const results = objectsToTest.map(areSameType);

        results.forEach(result => {
            expect(result).to.be.false;
        });
    });
});

describe("is()", function() {
    it("Should return a function when called", function() {
        const [ type ] = getNTypes(1)
        const result = is(...type);
        
        expect(result).to.be.an.instanceof(Function);
    });

    it("Should return true", function() {
        const closures = answers.map(is);

        closures.forEach((closure, idx) => {
            expect(closure(typesToTest[idx])).to.be.true;
        });
    });

    it("Should return false", function() {
        const closures = answers.map(is);

        closures.forEach((closure, idx) => {
            expect(
                closure(typesToTest[idx === 0 ? closures.length - 1 : idx - 1])
            ).to.be.false;
        });
    });
});

describe("are()", function() {
    it("Should return a function when called", function() {
        const [ type ] = getNTypes(1);
        const result = are(...type);
        
        expect(result).to.be.an.instanceof(Function);
    });

    it("Should return true", function() {
        const closures = answers.map(are);
        
        closures.forEach((closure, idx) => {
            const type = typesToTest[idx];
            expect(closure(type, type)).to.be.true;
        });
    });

    it("Should return false", function() {
        const closures = answers.map(are);

        closures.forEach((closure, idx) => {
            const type1 = typesToTest[idx];
            const type2 = typesToTest[idx === 0 ? closures.length - 1 : idx - 1]
            expect(
                closure(type1, type2)
            ).to.be.false;
        });
    });
});

describe("isOneOf()", function() {
    let number = 0;

    beforeEach(function() {
        number = Math.floor(Math.random() * 5 + 2);
    });

    afterEach(function() {
        number = 0;
    });

    it("Should return a function when called", function() {
        const [ types ] = getNTypes(number);
        const result = isOneOf(...types);
        
        expect(result).to.be.an.instanceof(Function);
    });

    it("Should return true", function() {
        const [ types, instances ] = getNTypes(number);
        const closure = isOneOf(...types);

        instances.forEach(instance => {
            expect(closure(instance)).to.be.true;
        });
    });

    it("Should return false", function() {
        const [ types, , disjointInstances ] = getNTypes(number);
        const closure = isOneOf(...types);

        disjointInstances.forEach((instance, idx) => {
            expect(
                closure(instance)
            ).to.be.false;
        });
    });
});

describe("areOneOf()", function() {
    let number = 0;

    beforeEach(function() {
        number = Math.floor(Math.random() * 5 + 2);
    });

    afterEach(function() {
        number = 0;
    });

    it("Should return a function when called", function() {
        const [ types ] = getNTypes(number);
        const result = areOneOf(...types);
        
        expect(result).to.be.an.instanceof(Function);
    });

    it("Should return true", function() {
        const [ types, instances ] = getNTypes(number);
        const closure = areOneOf(...types);
        const _instances = Array(Math.floor(Math.random() * number + 1))
            .fill(0)
            .map(
                () => instances[ Math.floor(Math.random() * instances.length) ]
            );
        expect(closure(..._instances)).to.be.true;
    });

    it("Should return false", function() {
        const [ types, , disjointInstances ] = getNTypes(number);
        const closure = areOneOf(...types);
        const _disjointInstances = Array(Math.floor(Math.random() * number + 1))
            .fill(0)
            .map(
                () => disjointInstances[ Math.floor(Math.random() * disjointInstances.length) ]
            );
        expect(closure(..._disjointInstances)).to.be.false;
    });
});

describe("isInstanceOf()", function() {
    class Dummy1 {}
    class Dummy2 {}
    class Dummy3 {}

    it("Should return a function when called", function() {
        const result = isInstanceOf(Dummy1, Dummy2);
        
        expect(result).to.be.an.instanceof(Function);
    });

    it("Should return true", function() {
        const closure = isInstanceOf(Dummy1, Dummy2);
        [ Dummy1, Dummy2 ].forEach(_class => {
            expect(closure(new _class)).to.be.true;
        })
    });

    it("Should return false", function() {
        const closure = isInstanceOf(Dummy1, Dummy2);
        expect(closure(new Dummy3())).to.be.false;
    });
});

describe("areInstancesOf()", function() {
    class Dummy1 {}
    class Dummy2 {}
    class Dummy3 {}

    it("Should return a function when called", function() {
        const result = areInstancesOf(Dummy1, Dummy2);
        
        expect(result).to.be.an.instanceof(Function);
    });

    it("Should return true", function() {
        const closure = areInstancesOf(Dummy1, Dummy2);
        var instances = [ Dummy1, Dummy2 ].map(_class => new _class);
        expect(closure(...instances)).to.be.true;
    });

    it("Should return false", function() {
        const closure = areInstancesOf(Dummy1, Dummy2);
        var instances = [ Dummy1, Dummy2 ].map(_class => new _class);
        expect(closure(...instances, new Dummy3)).to.be.false;
    });
});

describe("isEnum()", function() {
    const values = [1, 'abc', 'def', true];
    const values2 = [2, 'ghi', false];

    it("Should return a function when called", function() {
        const result = isEnum(...values);
        
        expect(result).to.be.an.instanceof(Function);
    });

    it("Should return true", function() {
        const closure = isEnum(...values);
        const result = values.every(closure);
        expect(result).to.be.true;
    });

    it("Should return false", function() {
        const closure = isEnum(...values);
        const result = values2.some(closure);
        expect(result).to.be.false;
    });
});

describe("areEnum()", function() {
    const values = [1, 'abc', 'def', true];
    const values2 = [2, 'ghi', false];

    it("Should return a function when called", function() {
        const result = areEnum(...values);
        
        expect(result).to.be.an.instanceof(Function);
    });

    it("Should return true", function() {
        const closure = areEnum(...values);
        const result = closure(...values);
        expect(result).to.be.true;
    });

    it("Should return false", function() {
        const closure = areEnum(...values);
        const result = closure(...values, ...values2);
        expect(result).to.be.false;
    });
});

describe("hasInterface()", function() {
    const _interface = {
        a: types.STRING,
        b: types.NUMBER,
        c: types.ARRAY,
        d: types.OBJECT
    };

    const doesImplement = [
        { a: 'abc', b: 123, c: [1, true], d: {} },
        { a: 'xyz', b: -321, c: [ false, '1' ], d: { key: Symbol() }, e: false }
    ];

    const doesNotImplement = [
        { a: 'abc', b: '123', c: [1, true], d: {} },
        { a: 'xyz', c: [ false, '1' ], d: { key: Symbol() }, e: false }
    ];

    it("Should return a function when called", function() {
        const result = hasInterface(_interface);
        
        expect(result).to.be.an.instanceof(Function);
    });

    it("Should return true", function() {
        const closure = hasInterface(_interface);
        const result = doesImplement.every(closure);
        expect(result).to.be.true;
    });

    it("Should return false", function() {
        const closure = hasInterface(_interface);
        const result = doesNotImplement.some(closure);
        expect(result).to.be.false;
    });
});

describe("haveInterface()", function() {
    const _interface = {
        a: types.STRING,
        b: types.NUMBER,
        c: types.ARRAY,
        d: types.OBJECT
    };

    const doesImplement = [
        { a: 'abc', b: 123, c: [1, true], d: {} },
        { a: 'xyz', b: -321, c: [ false, '1' ], d: { key: Symbol() }, e: false }
    ];

    const doesNotImplement = [
        { a: 'abc', b: '123', c: [1, true], d: {} },
        { a: 'xyz', c: [ false, '1' ], d: { key: Symbol() }, e: false }
    ];

    it("Should return a function when called", function() {
        const result = haveInterface(_interface);
        
        expect(result).to.be.an.instanceof(Function);
    });

    it("Should return true", function() {
        const closure = haveInterface(_interface);
        const result = closure(...doesImplement);
        expect(result).to.be.true;
    });

    it("Should return false", function() {
        const closure = haveInterface(_interface);
        const result = closure(...doesImplement, doesNotImplement[0]);
        expect(result).to.be.false;
    });
});

describe("hasShape()", function() {
    const shape = {
        a: types.STRING,
        b: types.NUMBER,
        c: types.ARRAY,
        d: types.OBJECT
    };

    const isOfShape = [
        { a: 'abc', b: 123, c: [1, true], d: {} }
    ];

    const isNotOfShape = [
        { a: 'abc', b: '123', c: [1, true], d: {} },
        { a: 'xyz', b: 123, c: [ false, '1' ], d: { key: Symbol() }, e: false },
        { a: 'xyz', c: [ false, '1' ], d: { key: Symbol() } }
    ];

    it("Should return a function when called", function() {
        const result = hasShape(shape);
        
        expect(result).to.be.an.instanceof(Function);
    });

    it("Should return true", function() {
        const closure = hasShape(shape);
        const result = isOfShape.every(closure);
        expect(result).to.be.true;
    });

    it("Should return false", function() {
        const closure = hasShape(shape);
        const result = isNotOfShape.some(closure);
        expect(result).to.be.false;
    });
});

describe("haveShape()", function() {
    const shape = {
        a: types.STRING,
        b: types.NUMBER,
        c: types.ARRAY,
        d: types.OBJECT
    };

    const isOfShape = [
        { a: 'abc', b: 123, c: [1, true], d: {} },
        { a: 'xyz', b: -321, c: ['a', false], d: { key: Symbol('value') } }
    ];

    const isNotOfShape = [
        { a: 'abc', b: '123', c: [1, true], d: {} }
    ];

    it("Should return a function when called", function() {
        const result = haveShape(shape);
        
        expect(result).to.be.an.instanceof(Function);
    });

    it("Should return true", function() {
        const closure = haveShape(shape);
        const result = closure(...isOfShape);
        expect(result).to.be.true;
    });

    it("Should return false", function() {
        const closure = haveShape(shape);
        const result = closure(...isOfShape, isNotOfShape[0]);
        expect(result).to.be.false;
    });
});

describe("isArrayOf()", function() {
    const _types = [ types.STRING, types.SYMBOL, types.OBJECT ];
    const matchingArrays = [
        [],
        [ 'abc' ],
        [ '0', Symbol(), { a: -12 } ],
        [ Symbol(), { a: -12 } ]
    ];
    const nonMatchingArrays = [
        [ Symbol(), { a: -12 }, [] ],
        [ 1 ]
    ];

    it("Should return a function when called", function() {
        const result = isArrayOf(..._types);
        
        expect(result).to.be.an.instanceof(Function);
    });

    it("Should return true", function() {
        const closure = isArrayOf(..._types);
        const result = matchingArrays.every(closure);
        expect(result).to.be.true;
    });

    it("Should return false", function() {
        const closure = isArrayOf(..._types);
        const result = nonMatchingArrays.every(closure);
        expect(result).to.be.false;
    });
});

describe("areArraysOf()", function() {
    const _types = [ types.STRING, types.SYMBOL, types.OBJECT ];
    const matchingArrays = [
        [],
        [ 'abc' ],
        [ '0', Symbol(), { a: -12 } ],
        [ Symbol(), { a: -12 } ]
    ];
    const nonMatchingArray = [ Symbol(), { a: -12 }, [] ];

    it("Should return a function when called", function() {
        const result = areArraysOf(..._types);
        
        expect(result).to.be.an.instanceof(Function);
    });

    it("Should return true", function() {
        const closure = areArraysOf(..._types);
        const result = closure(...matchingArrays);
        expect(result).to.be.true;
    });

    it("Should return false", function() {
        const closure = areArraysOf(..._types);
        const result = closure(...matchingArrays, nonMatchingArray);
        expect(result).to.be.false;
    });
});