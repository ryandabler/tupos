'use strict';

import types from './types';
import { typeOf } from './typeOf';

const {
    $FUNCTION,
    $NUMBER,
    $STRING,
    $NULL,
    $UNDEFINED,
    $BOOLEAN,
    $SYMBOL,
    $ARRAY,
    $OBJECT
} = types;

/**
 * Determines whether supplied item is iterable.
 * 
 * @param {*} obj Item to determine iterability for
 * @returns {boolean}
 */
const isIterable = obj =>
    !isOneOf($NULL, $UNDEFINED)(obj) && $FUNCTION(obj[Symbol.iterator]);

/**
 * Determines whether supplied param is a primitive type.
 * @param {*} param 
 * @returns {boolean}
 */
const isPrimitive = param => isOneOf(
        $NUMBER,
        $STRING,
        $NULL,
        $UNDEFINED,
        $BOOLEAN,
        $SYMBOL
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
 * Accepts an arbitrary list of types and returns a function whose parameter
 * should be of a type in that list
 * @param {...string} types
 * @returns {Function}
 */
const isOneOf = (...$types) =>
    itemToCheck => $types.some($typeChecker => $typeChecker(itemToCheck));

/**
 * Accepts an arbitrary list of classes and returns a function whose parameter
 * should be an instance of a class in that list
 * @param {...Function} types
 * @returns {Function}
 */
const isInstanceOf = (..._classes) =>
    itemToCheck => _classes.some(_class => itemToCheck instanceof _class);

/**
 * Accepts an arbitrary list of values and returns a function which accepts a value
 * and checks that that value exists in the enumerated list.
 * @param  {...any} enumValues 
 * @returns {Function}
 */
const isEnum = (...enumValues) => value => enumValues.some(enumValue => enumValue === value);

/**
 * Accepts an object whose values are types and returns a function whose parameter
 * should be an object with keys in the interface and values with respective types.
 * @param {Object} intfc 
 * @returns {Function}
 */
const hasInterface = intfc => object => {
    const eInterface = Object.entries(intfc);
    return eInterface.every(([key, $type]) => $type(object[key]));
};

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

    return $OBJECT(object) && eShape.length === eObject.length
        && hasInterface(shape)(object);
};

/**
 * Accepts a list of types and returns a function which accepts an array and makes sure
 * every element in the array has a type in the original list.
 * @param  {...string} types 
 * @returns {Function}
 */
const isArrayOf = (...$types) =>
    array => $ARRAY(array) && array.every(item => $types.some($typeChecker => $typeChecker(item)));

/**
 * Accepts a list of types and returns a function which accepts an object and makes sure
 * every value in the object is of a type in the original list.
 * @param  {...string} types 
 * @returns {Function}
 */
const isObjectOf = (...$types) => object =>
    $OBJECT(object) && Object.values(object).every(value => $types.some($typeChecker => $typeChecker(value)));

/**
 * Accepts a list of types and returns a function which accepts an array whose elements must
 * be of the specified type declared in their respective positions in the list of types.
 * @param  {...any} types 
 * @returns {Function}
 */
const isTuple = (...$types) => tuple =>
    $ARRAY(tuple) && tuple.length === $types.length && tuple.every((elem, idx) => $types[idx](elem));

export {
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
};