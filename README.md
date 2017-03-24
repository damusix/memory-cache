# Memory Cache

Creates an object cache in memory. IE10+. Includes an es5 version with non-private functionality that works in IE9 and lower.

To support ES6 version, get polyfills for `Object.assign` and `Object.defineProperties`.
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties#Polyfill

### Usage

##### Instantiate

You can either pass an existing object and convert it into a cache, or you can start a brand new cache.

``` javascript

    // ES6
    const MemoryCache = require('memory-cache');

    // ES5 and IE support
    const MemoryCacheIE = require('memory-cache/lib/es5');

    // Brand new cache
    const cache = new MemoryCache({});

    // or

    // Convert obj to cache
    const cache = new MemoryCache( myObj || returnObj() );
```

##### Set
``` javascript

    const val = cache.set('testing', {

        val1: true,
        val2: 'hey',
        val3: { a: 1, b: 4},
        val4: [1,2,3]
    });
```

##### Get
``` javascript

    const val = cache.get('testing');
```

##### Remove
``` javascript

    cache.remove('testing');
```

##### Merge
``` javascript

    const val = cache.merge('testing', { merged: true });
```

##### Reset
``` javascript

    const val = cache.merge('testing', { merged: true });
```
