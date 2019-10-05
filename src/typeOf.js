'use strict';

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

export { typeOf };