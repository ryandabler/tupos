"use strict";

const types = require("./constants");

/**
 * Determines the type of any JavaScript element.
 * 
 * Takes the output from Object.prototype.toString() which is of the form
 * "[object @@@@@]" and returns "@@@@@".
 * 
 * @param {*} obj Item to determine the type of
 * @returns {string}
 */
const typeOf = obj =>
    Object.prototype.toString.call(obj)
        .split(" ")[1]
        .slice(0, -1)

/**
 * Determines whether supplied item is iterable.
 * 
 * @param {*} obj Item to determine iterability for
 * @returns {boolean}
 */
const isIterable = obj =>
    obj ? typeOf(obj[Symbol.iterator]) === types.FUNCTION : false

/**
 * Determines whether supplied param is a primitive type.
 * @param {*} param 
 * @returns {boolean}
 */
const isPrimitive = param => [
        types.NUMBER,
        types.STRING,
        types.NULL,
        types.UNDEFINED,
        types.BOOLEAN,
        types.SYMBOL
    ].includes(typeOf(param))

module.exports = {
    typeOf,
    isIterable,
    isPrimitive
}