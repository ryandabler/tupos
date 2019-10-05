'use strict';

import typeMap from './constants';
import { is } from './is';

const types = Object.entries(typeMap)
    .map(([ key, type ]) => [ `$${key}`, is(type) ])
    .reduce((acc, [ $key, is_er ]) => {
        acc[$key] = is_er;
        return acc;
    },
    {}
);

export default types;