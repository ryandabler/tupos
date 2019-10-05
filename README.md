# Tupos
[![Build Status](https://travis-ci.org/ryandabler/tupos.svg?branch=master)](https://travis-ci.org/ryandabler/tupos)
[![Coverage Status](https://coveralls.io/repos/github/ryandabler/tupos/badge.svg?branch=master)](https://coveralls.io/github/ryandabler/tupos?branch=master)
[![Maintainability](https://api.codeclimate.com/v1/badges/7ef80d23111021929c8e/maintainability)](https://codeclimate.com/github/ryandabler/tupos/maintainability)
[![npm](https://img.shields.io/npm/v/tupos.svg)](https://www.npmjs.com/package/tupos)

Tupos is a functional type-checking library whose goal is to allow for complex user-defined types to be built from smaller pieces composed together.

Taking inspiration from the likes of TypeScript and the popular `prop-types` NPM package, Tupos exposes a simple API of functions which define the set of built-in data types (numbers, strings, _etc._) as well as common structures like enumerations, tuples, and interfaces (see the full API below), which can be arbitrarily joined together.

## Requirements
Tupos will work on any environment that supports ES6 or higher.

## Installation
### Node
To install the Tupos library in a Node environment, run

```
npm install tupos
```

### Browser
Tupos can also be run in a browser environment. The easiest way is to use unpkg and include in a `<script>` tag:

```html
<script src="https://unpkg.com/browse/tupos@1.4.0/lib/tupos.min.js">
```

This script will add a `tupos` key to the `window` object, with the below API exposed through it. Only v1.4.0 or higher are bundled for a browser.

## API
### Types
Tupos has a large library of functions representing various JavaScript types. Currently the following are supported as part of the `types` object in the package:

| Function            | Value                    |
| ------------------- | ------------------------ |
| $FUNCTION           | "Function"               |
| $OBJECT             | "Object"                 |
| $NUMBER             | "Number"                 |
| $ARRAY              | "Array"                  |
| $STRING             | "String"                 |
| $MAP                | "Map"                    |
| $WEAKMAP            | "WeakMap"                |
| $SET                | "Set"                    |
| $WEAKSET            | "WeakSet"                |
| $UNDEFINED          | "Undefined"              |
| $NULL               | "Null"                   |
| $BOOLEAN            | "Boolean"                |
| $SYMBOL             | "Symbol"                 |
| $ERROR              | "Error"                  |
| $MATH               | "Math"                   |
| $DATE               | "Date"                   |
| $REGEXP             | "RegExp"                 |
| $PROMISE            | "Promise"                |
| $INT8ARRAY          | "Int8Array"              |
| $UINT8ARRAY         | "Uint8Array"             |
| $UINT8CLAMPEDARRAY  | "Uint8ClampedArray"      |
| $INT16ARRAY         | "Int16Array"             |
| $UINT16ARRAY        | "Uint16Array"            |
| $INT32ARRAY         | "Int32Array"             |
| $UINT32ARRAY        | "Uint32Array"            |
| $FLOAT32ARRAY       | "Float32Array"           |
| $FLOAT64ARRAY       | "Float64Array"           |
| $ARRAYBUFFER        | "ArrayBuffer"            |
| $DATAVIEW           | "DataView"               |
| $JSON               | "JSON"                   |
| $GENERATOR          | "Generator"              |
| $GENERATORFUNC      | "GeneratorFunction"      |
| $WASM               | "WebAssembly"            |
| $ASYNCFUNC          | "AsyncFunction"          |
| $ASYNCGENERATOR     | "AsyncGenerator"         |
| $ASYNCGENERATORFUNC | "AsyncGeneratorFunction" |
| $BLOB               | "Blob"                   |
| $URL                | "URL"                    |
| $URLPARAMS          | "URLSearchParam"         |

Each of these functions can be called on any possible JavaScript value and will return `true` if it matches and `false` if it does not.

```js
$NUMBER(1); // true
$STRING(1); // false
```

Each function as well also has a property `.for` which returns the text value listed in the table above.

### Functions
Tupos also has a number of functions to aid in type-checking:

#### `typeOf`
Determines the type of any object passed to it and returns a string indicating that type. The  possible results are listed in the table above.

```js
typeOf(1);          // 'Number';
typeOf(new Date()); // 'Date'
```

This function can also return customized strings if the object passed in as a parameter has the `Symbol.toStringTag` getter.

```js
class SomeClass {
    get [Symbol.toStringTag]() {
        return 'SomeClass';
    }
}

typeOf(new SomeClass()); // 'SomeClass';
```

#### `is`
A higher-order function which accepts a string representing a particular type and returns a function which returns `true` or `false` depending on whether its parameter matches the type specified.

```js
const isArray = is('Array');
isArray([]); // true
isArray({}); // false
```

Use of this function is discouraged and should mostly be used for creating quick type-checking functions (akin to `$STRING` or `$NUMBER` above);

```js
class SomeClass {
    get [Symbol.toStringTag]() {
        return 'SomeClass';
    }
}

const $SOME_CLASS = is('SomeClass');
$SOME_CLASS(new SomeClass()); // true
$SOME_CLASS('abc');           // false
```

#### `isOneOf`
A higher-order variadic function which takes an arbitrary list of types as its parameters and returns a function that returns `true` or `false` if its parameter's type is any one of the ones specified.

```js
const isFloatArray = isOneOf($FLOAT32ARRAY, $FLOAT64ARRAY);
const float32 = new Float32Array();
const float64 = new Float64Array();
const uint8 = new Uint8Array();

isFloatArray(float32); // true
isFloatArray(float64); // true
isFloatArray(uint8);   // false
```

#### `isInstanceOf`
A higher-order variadic function which takes a list of classes and returns a function that returns `true` or `false` if its parameter is an instance of any of those classes.

```js
class SomeClass {}
class SomeOtherClass {}
class YetAnotherClass {}

const someClass = new SomeClass();
const someOtherClass = new SomeOtherClass();
const yetAnotherClass = new YetAnotherClass();

const isSomeClass = isInstanceOf(SomeClass, YetAnotherClass);

isSomeClass(someClass);       // true
isSomeClass(someOtherClass);  // false
isSomeClass(yetAnotherClass); // true
```

#### `isArrayOf`
A higher-order variadic function which accepts a list of types and returns a function that returns `true` or `false` if all the elements of an array are of the specified types.

```js
const hasAllObjectKeyTypes = isArrayOf($STRING, $NUMBER, $SYMBOL);
const allObjectKeyTypes = [ 'abc', Symbol('abc'), 123 ];
const notAllObjectKeyTypes = [ 'abc', Symbol('abc'), true ];

hasAllObjectKeyTypes(allObjectKeyTypes);    // true
hasAllObjectKeyTypes(notAllObjectKeyTypes); // false
```

#### `isObjectOf`
A higher-order variadic function which accepts a list of types and returns a function that returns `true` or `false` if all the values of the object are of the specified types.

```js
const couldHaveDepth = isObjectOf($ARRAY, $OBJECT);
const deepObject = {
    a: {},
    b: [ 1, 2, 3 ]
};
const partiallyFlatObject = {
    a: 1,
    b: [ 1, 2, 3]
};

couldHaveDepth(deepObject);          // true
couldHaveDepth(partiallyFlatObject); // false
```

#### `isEnum`
A higher-order variadic function which takes a list of values and returns a function that returns `true` or `false` if a given value is in the specified list.

```js
const isCardSuit = isEnum('heart', 'spade', 'club', 'diamond');

isCardSuit('heart'); // true
isCardSuit('crown'); // false
```

#### `isTuple`
A higher-order variadic function which accepts a list of types and returns a function that returns `true` or `false` if its parameter's (an array) elements whose type matches their respective position in the list.

```js
const isRGB = isTuple($NUMBER, $NUMBER, $NUMBER);

isRGB([1, 2, 3]);       // true
isRGB([1, 2, 3, 4]);    // false
isRBG(['1', '2', '3']); // false
```

#### `hasInterface`
A higher-order function which accepts an object whose values are types and returns a function that returns `true` if its parameter (an object) contains at least all the keys in the interface and has matching types for the values. It returns `false` otherwise.

```js
const hasVitals = hasInterface({
    name: $STRING,
    dob: $DATE,
    ssn: $NUMBER
});

const person1 = {
    name: 'John Smith',
    dob: new Date(1972, 1, 13),
    ssn: 123456789
};
const person2 = {
    name: 'Jane Doe',
    dob: new Date(1999, 11, 21),
    ssn: 987654321,
    age: 19
};
const person3 = {
    dob: new Date()
};
const person4 = {
    name: Symbol('Jane Doe'),
    dob: new Date(1999, 11, 21),
    ssn: 987654321
};

hasVitals(person1); // true
hasVitals(person2); // true
hasVitals(person3); // false
hasVitals(person4); // false
```

#### `hasShape`
A higher-order function which accepts an object whose values are types and returns a function that returns true if its parameter (an object) contains exactly the keys in the shape template and has matching types for the values. It returns `false` otherwise.

```js
const isRGBA = hasShape({
    r: $NUMBER,
    g: $NUMBER,
    b: $NUMBER,
    a: $NUMBER
});

const color1 = { r: 1, g: 2, b: 3, a: .5 };
const color2 = { r: '1', g: 2, b: 3, a: .5 };
const color3 = { r: 1, g: 2, b: 3};

isRGBA(color1); // true
isRGBA(color2); // false
isRGBA(color3); // false
```

#### `isIterable`
Returns `true` or `false` depending on whether the parameter has `Symbol.iterator` set on it.

```js
isIterable(1);  // false
isIterable(''); // true
isIterable([]); // true
```

#### `isPrimitive`
Returns `true` or `false` depending on whether the parameter is a primitive JavaScript value (one of `Number`, `String`, `Boolean`, `Null`, `Undefined`, `Symbol`).

```js
isPrimitive(1);          // true
isPrimitive(new Date()); // false
```

#### `areSameType`
A variadic function which returns `true` or `false` depending on whether the supplied parameters all have the same type.

```js
areSameType(1, 2, 3);  // true
areSameType(1, [], 3); // false
```

## License
Tupos is licensed under the MIT license.