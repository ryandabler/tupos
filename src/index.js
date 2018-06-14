"use strict";

const types = require("./constants");
const {
    typeOf,
    isIterable,
    isPrimitive,
    areSameType
} = require("./tupos");

module.exports = {
    types,
    typeOf,
    isIterable,
    isPrimitive,
    areSameType
}