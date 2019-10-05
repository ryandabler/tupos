import { typeOf } from './typeOf';

/**
 * Accepts a type and returns a function whose single parameter
 * is an item whose type should be checked against `type`
 * @param {string} type 
 * @returns {boolean}
 */
const is = type => {
    const checker = itemToCheck => typeOf(itemToCheck) === type;
    checker.for = type;
    return checker;
};

export { is };