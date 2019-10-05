import types from '../src/types';

const typesToTest = [
    () => 1,
    {a: 1},
    1,
    [1, 2, 3],
    'Hello',
    new Map(),
    new WeakMap(),
    new Set(),
    new WeakSet(),
    undefined,
    null,
    true,
    Symbol('a'),
    new Error('Test'),
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
    types.$FUNCTION,
    types.$OBJECT,
    types.$NUMBER,
    types.$ARRAY,
    types.$STRING,
    types.$MAP,
    types.$WEAKMAP,
    types.$SET,
    types.$WEAKSET,
    types.$UNDEFINED,
    types.$NULL,
    types.$BOOLEAN,
    types.$SYMBOL,
    types.$ERROR,
    types.$MATH,
    types.$DATE,
    types.$REGEXP,
    types.$PROMISE,
    types.$INT8ARRAY,
    types.$UINT8ARRAY,
    types.$UINT8CLAMPEDARRAY,
    types.$INT16ARRAY,
    types.$UINT16ARRAY,
    types.$INT32ARRAY,
    types.$UINT32ARRAY,
    types.$FLOAT32ARRAY,
    types.$FLOAT64ARRAY,
    types.$ARRAYBUFFER,
    types.$DATAVIEW,
    types.$JSON,
    // types.$GENERATOR,
    // types.$GENERATORFUNC,
    types.$WASM,
    // types.$ASYNCFUNC
    // types.$ASYNCGENERATOR,
    // types.$ASYNCGENERATORFUNC,
    // types.$BLOB
    types.$URL,
    types.$URLPARAMS
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

export { typesToTest, answers, getNTypes };