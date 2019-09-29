'use strict';

import types from './constants';

const SLICE_START = '[object '.length;

/**
 * Determines the type of any JavaScript element.
 * 
 * Takes the output from Object.prototype.toString() which is of the form
 * '[object @@@@@]' and returns '@@@@@'.
 * 
 * @param {*} obj Item to determine the type of
 * @returns {string}
 */
const typeOf = obj =>
    Object.prototype.toString.call(obj)
        .slice(SLICE_START, -1);

/**
 * Determines whether supplied item is iterable.
 * 
 * @param {*} obj Item to determine iterability for
 * @returns {boolean}
 */
const isIterable = obj =>
    obj ? typeOf(obj[Symbol.iterator]) === types.FUNCTION : false;

/**
 * Determines whether supplied param is a primitive type.
 * @param {*} param 
 * @returns {boolean}
 */
const isPrimitive = param => isOneOf(
        types.NUMBER,
        types.STRING,
        types.NULL,
        types.UNDEFINED,
        types.BOOLEAN,
        types.SYMBOL
    )(param);

/**
 * Checks whether an arbitrary set of parameters are of the
 * same type.
 * @param {*} params Arbitrary set of parameters
 * @returns {boolean}
 */
const areSameType = (...params) =>
    params.map(typeOf)
        .reduce((accum, type) => accum.add(type), new Set())
        .size === 1;

/**
 * Accepts a type and returns a function whose single parameter
 * is an item whose type should be checked against `type`
 * @param {string} type 
 * @returns {boolean}
 */
const is = type => itemToCheck => typeOf(itemToCheck) === type;

/**
 * Accepts a type and returns a variadic function whose parameters
 * are items whose type should be checked against `type`
 * @param {string} type 
 * @returns {Function}
 */
const are = type => (...itemsToCheck) => itemsToCheck.every(is(type));

/**
 * Accepts an arbitrary list of types and returns a function whose parameter
 * should be of a type in that list
 * @param {...string} types
 * @returns {Function}
 */
const isOneOf = (...types) =>
    itemToCheck => types.includes(typeOf(itemToCheck));

/**
 * Accepts an arbitrary list of types and returns a function whose parameters
 * should all be of types in that list
 * @param {...string} types
 * @returns {Function}
 */
const areOneOf = (...types) =>
    (...itemsToCheck) => itemsToCheck.every(isOneOf(...types));

/**
 * Accepts an arbitrary list of classes and returns a function whose parameter
 * should be an instance of a class in that list
 * @param {...Function} types
 * @returns {Function}
 */
const isInstanceOf = (..._classes) =>
    itemToCheck => _classes.some(_class => itemToCheck instanceof _class);

/**
 * Accepts an arbitrary list of classes and returns a function whose parameters
 * should be instances of any class in that list
 * @param {...Function} types
 * @returns {Function}
 */
const areInstancesOf = (..._classes) =>
    (...itemsToCheck) => itemsToCheck.every(isInstanceOf(..._classes));

/**
 * Accepts an arbitrary list of values and returns a function which accepts a value
 * and checks that that value exists in the enumerated list.
 * @param  {...any} enumValues 
 * @returns {Function}
 */
const isEnum = (...enumValues) => value => enumValues.some(enumValue => enumValue === value);

/**
 * Accepts an arbitrary list of values and returns a function whose parameters
 * should exist in the enumerated list.
 * @param  {...any} enumValues 
 * @returns {Function}
 */
const areEnum = (...enumValues) => (...values) => values.every(isEnum(...enumValues));

/**
 * Accepts an object whose values are types and returns a function whose parameter
 * should be an object with keys in the interface and values with respective types.
 * @param {Object} intfc 
 * @returns {Function}
 */
const hasInterface = intfc => object => {
    const eInterface = Object.entries(intfc);
    return eInterface.every(([key, type]) => typeOf(object[key]) === type);
};

/**
 * Accepts an object whose values are types and returns a function whose parameters
 * should be objects which at least contain all of the  keys in the interface and
 * values with respective types.
 * @param {Object} intfc 
 * @returns {Function}
 */
const haveInterface = intfc => (...objects) => objects.every(hasInterface(intfc));

/**
 * Accepts an object whose values are types and returns a function whose parameter
 * should be an object which contains exactly the keys in the shape and whose values
 * are its respective types.
 * @param {*} shape 
 * @returns {Function}
 */
const hasShape = shape => object => {
    const eShape = Object.entries(shape);
    const eObject = Object.entries(object);

    return eShape.length === eObject.length
        && hasInterface(shape)(object);
};

/**
 * Accepts an object whose values are types and returns a function whose parameters
 * should be objects which contain exactly the keys in the shape and whose values
 * are its respective types.
 * @param {*} shape 
 * @returns {Function}
 */
const haveShape = shape => (...objects) => objects.every(object => {
    const eShape = Object.entries(shape);
    const eObject = Object.entries(object);

    return eShape.length === eObject.length
        && hasInterface(shape)(object);
});

/**
 * Accepts a list of types and returns a function which accepts an array and makes sure
 * every element in the array has a type in the original list.
 * @param  {...string} types 
 * @returns {Function}
 */
const isArrayOf = (...types) => array => array.every(item => types.includes(typeOf(item)));

/**
 * Accepts a list of types and returns a function which accepts multiple arrays and makes sure
 * every element in every array has a type in the original list.
 * @param  {...string} types 
 * @returns {Function}
 */
const areArraysOf = (...types) => (...arrays) => arrays.every(isArrayOf(...types));

/**
 * Accepts a list of types and returns a function which accepts an object and makes sure
 * every value in the object is of a type in the original list.
 * @param  {...string} types 
 * @returns {Function}
 */
const isObjectOf = (...types) => object => Object.values(object).every(value => types.includes(typeOf(value)));

/**
 * Accepts a list of types and returns a function which accepts an arbitrary number of objects
 * and makes sure every value for every object is of a type in the original list.
 * @param  {...string} types 
 * @returns {Function}
 */
const areObjectsOf = (...types) => (...objects) => objects.every(isObjectOf(...types));

/**
 * Accepts a list of types and returns a function which accepts an array whose elements must
 * be of the specified type declared in their respective positions in the list of types.
 * @param  {...any} types 
 * @returns {Function}
 */
const isTuple = (...types) => tuple =>
    tuple.length === types.length && tuple.every((elem, idx) => typeOf(elem) === types[idx]);

/**
 * Accepts a list of types and returns a function which accepts an arbitrary number of tuples,
 * all of which it validates against the declared list of types.
 * @param  {...any} types 
 * @returns {Function}
 */
const areTuples = (...types) => (...tuples) => tuples.every(isTuple(...types));

export {
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
    areArraysOf,
    isObjectOf,
    areObjectsOf,
    isTuple,
    areTuples
};