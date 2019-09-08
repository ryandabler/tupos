# Tupos
[![Build Status](https://travis-ci.org/ryandabler/tupos.svg?branch=master)](https://travis-ci.org/ryandabler/tupos)
[![Coverage Status](https://coveralls.io/repos/github/ryandabler/tupos/badge.svg?branch=master)](https://coveralls.io/github/ryandabler/tupos?branch=master)
[![Maintainability](https://api.codeclimate.com/v1/badges/7ef80d23111021929c8e/maintainability)](https://codeclimate.com/github/ryandabler/tupos/maintainability)
[![npm](https://img.shields.io/npm/v/tupos.svg)](https://www.npmjs.com/package/tupos)

Tupos is a type-checking library meant to determine the type of a given object as well as compare objects and types against one another for more complex type management.

## Installation
To install the Tupos library run

```
npm install tupos
```

## API
### Constants
Tupos has a large library of constants representing various JavaScript objects. Currently the following are supported as part of a `types` object in the package:

| Constant           | Value                    |
| ------------------ | ------------------------ |
| FUNCTION           | "Function"               |
| OBJECT             | "Object"                 |
| NUMBER             | "Number"                 |
| ARRAY              | "Array"                  |
| STRING             | "String"                 |
| MAP                | "Map"                    |
| WEAKMAP            | "WeakMap"                |
| SET                | "Set"                    |
| WEAKSET            | "WeakSet"                |
| UNDEFINED          | "Undefined"              |
| NULL               | "Null"                   |
| BOOLEAN            | "Boolean"                |
| SYMBOL             | "Symbol"                 |
| ERROR              | "Error"                  |
| MATH               | "Math"                   |
| DATE               | "Date"                   |
| REGEXP             | "RegExp"                 |
| PROMISE            | "Promise"                |
| INT8ARRAY          | "Int8Array"              |
| UINT8ARRAY         | "Uint8Array"             |
| UINT8CLAMPEDARRAY  | "Uint8ClampedArray"      |
| INT16ARRAY         | "Int16Array"             |
| UINT16ARRAY        | "Uint16Array"            |
| INT32ARRAY         | "Int32Array"             |
| UINT32ARRAY        | "Uint32Array"            |
| FLOAT32ARRAY       | "Float32Array"           |
| FLOAT64ARRAY       | "Float64Array"           |
| ARRAYBUFFER        | "ArrayBuffer"            |
| DATAVIEW           | "DataView"               |
| JSON               | "JSON"                   |
| GENERATOR          | "Generator"              |
| GENERATORFUNC      | "GeneratorFunction"      |
| WASM               | "WebAssembly"            |
| ASYNCFUNC          | "AsyncFunction"          |
| ASYNCGENERATOR     | "AsyncGenerator"         |
| ASYNCGENERATORFUNC | "AsyncGeneratorFunction" |
| BLOB               | "Blob"                   |
| URL                | "URL"                    |
| URLPARAMS          | "URLSearchParam"         |

### Functions
Tupos also has a number of functions to aid in type-checking:

| Function           | Description                                     |
| ------------------ | ----------------------------------------------- |
| `typeOf`           | Determines the type of any object passed to it. Can also detect custom built objects if they have the `Symbol.toStringTag` getter |
| `isIterable`       | Returns `true` or `false` depending on whether the parameter has `Symbol.iterator` set on it |
| `isPrimitive`      | Returns `true` or `false` depending on whether the parameter is a primitive JavaScript value (one of `Number`, `String`, `Boolean`, `Null`, `Undefined`, `Symbol`) |
| `areSameType`      | A variadic function which returns `true` or `false` depending on whether the supplied parameters all have the same type |
| `is`               | A higher-order function which is called on a given type constant and returns a function which, when called on any parameter, returns `true` or `false` depending on whether that parameter matches the type specified in the closure |
| `are`              | Works the same as `is` except it checks multiple parameters at once against a particular type |
| `isOneOf`          | A higher-order variadic function which takes an arbitrary number of types as its parameters and returns a function which takes any parameter and returns `true` or `false` if that parameter's type is any one of the ones specified in its closure |
| `areOneOf`         | Works that same as `isOneOf` except it checks the types of an arbitrary number of parameters against the list of specified types |
| `isInstanceOf`     | A higher-order variadic function which takes a list of classes and returns a function which checks whether its parameter is an instance of any of those classes and returns `true` or `false` |
| `areInstanceOf`    | Works the same as `isInstanceOf` except it checks whether all elements of an arbitrary list are instances any of the specified classes |
| `isEnum`           | A higher-order variadic function which takes a list of values and returns a function which checks whether its parameter exists in that enumerated list and returns `true` or `false` |
| `areEnum`          | Works the same as `isEnum` except it checks whether all elements of an arbitrary list exist in the enumerated list |
| `hasInterface`     | A higher-order function which accepts an object whose values are types and returns a function which accepts an object and checks that it contains at least all the keys in the interface and whose values are of the designated type. Returns `true` or `false` |
| `haveInterface`    | Works the same as `hasInterface` except it checks multiple objects simultaneously |
| `hasShape`         | A higher-order function which accepts an object whose values are types and returns a function which accepts an object and checks that it contains exactly the keys in the shape template and whose values are of the designated type. Returns `true` or `false` |
| `haveShape`        | Works the same as `hasShape` except it checks multiple objects simultaneously |
| `isArrayOf`        | A higher-order function which accepts a list of types and returns a function which accepts an array and checks that all of its elements are of the specified types. Returns `true` or `false` |
| `areArraysOf`      | Works the same as `isArrayOf` except it checks multiple arrays simultaneously |

## License
Tupos is licensed under the MIT license.