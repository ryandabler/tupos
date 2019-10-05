import { terser } from 'rollup-plugin-terser';

export default {
    input: './src/index.js',
    output: [
        {
            file: './lib/tupos.esm.js',
            format: 'esm',
        },
        {
            file: './lib/tupos.umd.js',
            format: 'umd',
            name: 'tupos'
        },
        {
            file: './lib/tupos.min.js',
            format: 'iife',
            name: 'tupos'
        }
    ],
    plugins: [
        terser({
            include: ['*min*']
        })
    ]
};