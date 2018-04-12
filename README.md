# Memory Cache

Instantiates a mutable object cache in memory. I wrote this to use as memory store to share data among components, for use with tools like RiotJS, VueJS, and native browser apps.

##### NOTE: Version 2 drops support for anything that doesn't supporet ES6. For version 1, which has IE8 support, visit [v1 readme](v1.md). Version 1 is about 10x faster, but lacks features such as observer and immutable returns.

### Installation

``` javascript
    npm install --save memory-cache2
```

### Usage

##### Instantiate

You can either pass an existing object and convert it into a cache, or you can start a brand new cache.

``` javascript

    const MemoryCache = require('memory-cache');

    // Empty cache
    const cache = new MemoryCache;

    // or

    // Pass obj as cache
    const cache = new MemoryCache( myObj || returnObj() );
```

##### Set
Defines key value. Returns value.

``` javascript

    const val = cache.set('testing', { set: true, arr: [1,2,3] });

    // returns { set: true, arr: [1,2,3] }
```

##### Get
Returns key value.

``` javascript

    const val = cache.get('testing');

    // returns { set: true, arr: [1,2,3] }

    const entireCache = cache.get(true);
    // returns { testing: { set: true, arr: [1,2,3] }}
```

##### Remove
Remove key from cache.

``` javascript

    cache.remove('testing');

    // returns true
```

##### Reset
Resets cache object to empty object.

``` javascript

    cache.reset();

    // returns {}
```

##### Debug
Turns logging off or on.

``` javascript

    cache.debug(true);

    // cache set testing { set: true, arr: [1,2,3] }
    // cache get testing
    // cache remove testing
    // cache reset
```

##### Expire
Expire cache after a certain amount of time in miliseconds.

``` javascript
    cache.expire('testing', 3000);
    // Expires in 3 seconds
```

##### Set and Expire
Set the cache and expire after a certain amount of time in miliseconds.

``` javascript

    cache.set('testing', { value: 1 }, 3000);
    // returns { value: 1 }
    // Expires in 3 seconds
```

##### Merge
Merge objects stored in cache. Works with arrays or objects only.

``` javascript

    const val = cache.merge('testing', { merged: true });
    // returns { set: true, arr: [1,2,3], merged: true }

    // Example merge array

    cache.set('array', ['a', 'b', 'c']);
    // returns ['a', 'b', 'c']

    cache.merge('array', { 0: 'A', 2: 'Z'});
    // returns ['A', 'b', 'Z']

```

##### Concat
Concatenates cached array.

``` javascript

    cache.set('array', ['a', 'b', 'c']);
    cache.concat('array', [1,2,3]);
    // returns ['a', 'b', 'c', 1, 2, 3];
```

## It gets better

#### Lets suppose we have this object in cache:

``` javascript

    // Set nested object
    cache.set('nested', {
        obj: {
            is: {
                set: 'yes'
            }
        },
        arr: [
            { inside: 'array' },
            { set: false }
        ]
    });
```

##### Get Nested
Crawls cache to retrieve nested cached value. Can retrieve inside objects or arrays.

``` javascript

    // Get in object
    cache.getIn('nested.obj.is.set');
    // returns 'yes'

    // Get in array
    cache.getIn('nested.arr.0.inside');
    // returns 'array'
```

##### Set Nested
Crawls cache to set nested cached value. Can set inside objects or arrays.

``` javascript

    // Set in object
    cache.setIn('nested.obj.is.set', true);
    // returns true

    // Set in array
    cache.setIn('nested.arr.1.set', 'yes');
    // returns 'yes'
```

##### Merge Nested
Crawls cache to set merge cached value. Can merge inside objects or arrays.

``` javascript

    // Merge in object
    cache.mergeIn('nested.obj.is', { merged: true });
    // returns { set: true, merged: true };

    // Merge in array
    cache.mergeIn('nested.arr.1', { merged: 'yes' });
    // returns { set: 'yes', merged: 'yes' }
```


##### Concat Nested
Crawls cache to concat cached value. Can concat inside objects or arrays.

``` javascript

    // Concat in object
    cache.concatIn('nested.arr', { newItem: true });
    // returns [{ inside: 'array' }, { set: false }, { newItem: true }]

    // Concat in array
    cache.set('array', [{ of: { arrays: [] }}]);
    cache.concatIn('array.0.of.arrays', { newItem: true });
    // returns [{ newItem: true }];
```



### Contributing

- Include 100% test coverage.
- Must support older browsers.
- Submit an issue first for significant changes.
