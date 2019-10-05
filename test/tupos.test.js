////////////////////////////
// Initialize
////////////////////////////
import { expect } from 'chai';
import {
    isIterable,
    isPrimitive,
    areSameType,
    isOneOf,
    isInstanceOf,
    isEnum,
    hasInterface,
    hasShape,
    isArrayOf,
    isObjectOf,
    isTuple
} from '../src/tupos';
import types from '../src/types';
import { getNTypes } from './utilities';

////////////////////////////
// Test
////////////////////////////
describe('isIterable()', function() {
    it('Should return true', function() {
        const objectsToTest = [
            [1, 2, 3],
            new Map(),
            'Hello',
        ];
        const results = objectsToTest.map(isIterable);

        results.forEach(result => {
            expect(result).to.be.true;
        });
    });

    it('Should return false', function() {
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

    it('Should return false when no arguments are supplied passed', function() {
        expect(isIterable()).to.be.false;
    });
});

describe('isPrimitive()', function() {
    it('Should return true', function() {
        const objectsToTest = [
            1,
            'Abc',
            null,
            undefined,
            true,
            Symbol.for('a')
        ];
        const results = objectsToTest.map(isPrimitive);

        results.forEach(result => {
            expect(result).to.be.true;
        });
    });

    it('Should return false', function() {
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

describe('areSameType()', function() {
    it('Should return true if only passed one param', function() {
        const objectsToTest = [
            1,
            'Abc',
            null,
            undefined,
            true,
            Symbol.for('a')
        ];
        const results = objectsToTest.map(item => areSameType(item));
        
        results.forEach(result => {
            expect(result).to.be.true;
        });
    });

    it('Should return true', function() {
        const objectsToTest = [
            [1, 2, -6],
            ['Abc', 'Def'],
            [true, false],
            [() => {}, function() {}]
        ];
        const results = objectsToTest.map(obj => areSameType(...obj));

        results.forEach(result => {
            expect(result).to.be.true;
        });
    });

    it('Should return false', function() {
        const objectsToTest = [
            [1, 'a'],
            ['Abc', 'Def', true],
            [true, /a/, 'abd', () => {}]
        ];
        const results = objectsToTest.map(areSameType);

        results.forEach(result => {
            expect(result).to.be.false;
        });
    });
});

describe('isOneOf()', function() {
    let number = 0;

    beforeEach(function() {
        number = Math.floor(Math.random() * 5 + 2);
    });

    afterEach(function() {
        number = 0;
    });

    it('Should return a function when called', function() {
        const [ types ] = getNTypes(number);
        const result = isOneOf(...types);
        
        expect(result).to.be.an.instanceof(Function);
    });

    it('Should return true', function() {
        const [ types, instances ] = getNTypes(number);
        const closure = isOneOf(...types);

        instances.forEach(instance => {
            expect(closure(instance)).to.be.true;
        });
    });

    it('Should return false', function() {
        const [ types, , disjointInstances ] = getNTypes(number);
        const closure = isOneOf(...types);

        disjointInstances.forEach(instance => {
            expect(
                closure(instance)
            ).to.be.false;
        });
    });
});

describe('isInstanceOf()', function() {
    class Dummy1 {}
    class Dummy2 {}
    class Dummy3 {}

    it('Should return a function when called', function() {
        const result = isInstanceOf(Dummy1, Dummy2);
        
        expect(result).to.be.an.instanceof(Function);
    });

    it('Should return true', function() {
        const closure = isInstanceOf(Dummy1, Dummy2);
        [ Dummy1, Dummy2 ].forEach(_class => {
            expect(closure(new _class)).to.be.true;
        })
    });

    it('Should return false', function() {
        const closure = isInstanceOf(Dummy1, Dummy2);
        expect(closure(new Dummy3())).to.be.false;
    });
});

describe('isEnum()', function() {
    const values = [1, 'abc', 'def', true];
    const values2 = [2, 'ghi', false];

    it('Should return a function when called', function() {
        const result = isEnum(...values);
        
        expect(result).to.be.an.instanceof(Function);
    });

    it('Should return true', function() {
        const closure = isEnum(...values);
        const result = values.every(closure);
        expect(result).to.be.true;
    });

    it('Should return false', function() {
        const closure = isEnum(...values);
        const result = values2.some(closure);
        expect(result).to.be.false;
    });
});

describe('hasInterface()', function() {
    const _interface = {
        a: types.$STRING,
        b: types.$NUMBER,
        c: types.$ARRAY,
        d: types.$OBJECT
    };

    const doesImplement = [
        { a: 'abc', b: 123, c: [1, true], d: {} },
        { a: 'xyz', b: -321, c: [ false, '1' ], d: { key: Symbol() }, e: false }
    ];

    const doesNotImplement = [
        { a: 'abc', b: '123', c: [1, true], d: {} },
        { a: 'xyz', c: [ false, '1' ], d: { key: Symbol() }, e: false }
    ];

    it('Should return a function when called', function() {
        const result = hasInterface(_interface);
        
        expect(result).to.be.an.instanceof(Function);
    });

    it('Should return true', function() {
        const closure = hasInterface(_interface);
        const result = doesImplement.every(closure);
        expect(result).to.be.true;
    });

    it('Should return false', function() {
        const closure = hasInterface(_interface);
        const result = doesNotImplement.some(closure);
        expect(result).to.be.false;
    });
});

describe('hasShape()', function() {
    const shape = {
        a: types.$STRING,
        b: types.$NUMBER,
        c: types.$ARRAY,
        d: types.$OBJECT
    };

    const isOfShape = [
        { a: 'abc', b: 123, c: [1, true], d: {} }
    ];

    const isNotOfShape = [
        { a: 'abc', b: '123', c: [1, true], d: {} },
        { a: 'xyz', b: 123, c: [ false, '1' ], d: { key: Symbol() }, e: false },
        { a: 'xyz', c: [ false, '1' ], d: { key: Symbol() } }
    ];

    it('Should return a function when called', function() {
        const result = hasShape(shape);
        
        expect(result).to.be.an.instanceof(Function);
    });

    it('Should return true', function() {
        const closure = hasShape(shape);
        const result = isOfShape.every(closure);
        expect(result).to.be.true;
    });

    it('Should return false', function() {
        const closure = hasShape(shape);
        const result = isNotOfShape.some(closure);
        expect(result).to.be.false;
    });
});

describe('isArrayOf()', function() {
    const _types = [ types.$STRING, types.$SYMBOL, types.$OBJECT ];
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

    it('Should return a function when called', function() {
        const result = isArrayOf(..._types);
        
        expect(result).to.be.an.instanceof(Function);
    });

    it('Should return true', function() {
        const closure = isArrayOf(..._types);
        const result = matchingArrays.every(closure);
        expect(result).to.be.true;
    });

    it('Should return false', function() {
        const closure = isArrayOf(..._types);
        const result = nonMatchingArrays.every(closure);
        expect(result).to.be.false;
    });
});

describe('isObjectOf()', function() {
    const _types = [ types.$STRING, types.$SYMBOL, types.$OBJECT ];
    const matchingObjects = [
        {},
        { key1: 'abc', key2: Symbol('abc'), key3: { a: [1,2,3] } }
    ];
    const nonMatchingObjects = [
        { key1: 1 },
        { key1: 1, key2: 'abc' },
    ];

    it('Should return a function when called', function() {
        const result = isObjectOf(..._types);
        
        expect(result).to.be.an.instanceof(Function);
    });

    it('Should return true', function() {
        const closure = isObjectOf(..._types);
        const result = matchingObjects.every(closure);
        expect(result).to.be.true;
    });

    it('Should return false', function() {
        const closure = isObjectOf(..._types);
        const result = nonMatchingObjects.every(closure);
        expect(result).to.be.false;
    });
});

describe('isTuple()', function() {
    const _types = [ types.$STRING, types.$SYMBOL, types.$OBJECT ];
    const matchingTuple = [ 'abc', Symbol(), { a: 1 } ];
    const nonMatchingTuples = [
        [ 'abc' ],
        [ 'abc', Symbol(), { a: 1 }, 2 ],
        [ Symbol(), 'abc', { a: 1 } ]
    ];

    it('Should return a function when called', function() {
        const result = isTuple(..._types);
        
        expect(result).to.be.an.instanceof(Function);
    });

    it('Should return true', function() {
        const closure = isTuple(..._types);
        const result = closure(matchingTuple);
        expect(result).to.be.true;
    });

    it('Should return false', function() {
        const closure = isTuple(..._types);
        const result = nonMatchingTuples.some(closure);
        expect(result).to.be.false;
    });
});
