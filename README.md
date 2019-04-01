# Memory Cache

Instantiates a mutable object cache in memory. Uses `Map` and `Symbol` primitives, so it will only work on modern browsers (versions >= 2015), and node 4+. See [benchmarks here](benchmark.md).

__Note about previous versions:__

If you're using previous versions, You can find [v1 documentation here](v1.md) and [v2 documentation here](v2.md) and you can install using `memory-cache2@1` and `memory-cache2@2`. I have dropped support for functionality like `getIn`, `setIn`, `concatIn`, `mergeIn`. Instead, I opted refactoring to the more performant JS maps, only allowing `merge` and `concat`, and adding other features like `each`, `has`, and `size`. I also refactored the event emitter to only allow observing and not triggering. Triggering should only occur internally, as the cache does things.

### API
- [Instantiate](#instantiate)
- [Set](#set)
- [Get](#get)
- [Remove](#remove)
- [Reset](#reset)
- [Expire](#expire)
- [Set and Expire](#set-and-expire)
- [Merge](#merge)
- [Concat](#concat)
- [Has](#has)
- [Each](#each)
- [Keys](#keys)
- [Size](#size)
- [Debug](#debug)
- [Events](#events)


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

cache.set('testing', { set: true, arr: [1,2,3] });
```

##### Get
Returns key value.

``` javascript

const val = cache.get('testing');

// > { set: true, arr: [1,2,3] }

const entireCache = cache.get(true);
// > { testing: { set: true, arr: [1,2,3] }}
```

##### Remove
Remove key from cache.

``` javascript

cache.remove('testing');
// > true
```

##### Reset
Resets cache object to empty object.

``` javascript

cache.reset();
// > {}
```

##### Expire
Expire cache after a certain amount of time in milliseconds.

``` javascript

cache.expire('testing', 3000);
// Expires in 3 seconds
```

##### Set and Expire
Set the cache and expire after a certain amount of time in miliseconds.

``` javascript

cache.set('testing', { value: 1 }, 3000);
// > { value: 1 }
// Expires in 3 seconds
```

##### Merge
Merge objects stored in cache. Works with arrays or objects only.

``` javascript

const val = cache.merge('testing', { merged: true });
// > { set: true, arr: [1,2,3], merged: true }

```

##### Concat
Concatenates cached array.

``` javascript

cache.set('array', ['a', 'b', 'c']);
cache.concat('array', [1,2,3]);
// > ['a', 'b', 'c', 1, 2, 3];
```

##### Has
Checks to see if cache has a key

``` javascript

cache.has('array')
// > true

cache.has('what')
// > false
```

##### Each
Iterates through cache.

``` javascript

cache.each(function (value, key) {

    console.log(value, key);
});
```

##### Keys
Gets all cached keys

``` javascript

cache.keys;
// > ['testing', 'array']
```

##### Size
Get size of cache

``` javascript

cache.size;
// > 2
```

##### Debug
Turns logging off or on.

``` javascript

// Instantiate cache with debugging
const cache = new MemoryCache({}, {
    debug: true
});

// Set debugging after instantiation
cache.debug = true || false;

cache.set('testing', { set: true });
// MemoryCache: set testing { set: true }

cache.get('testing');
// MemoryCache: get testing
```

##### Events

MemoryCache events can be observed. All events return an object with at least `key` and `value`, except for `reset`. You can bind or unbind to any event using the following API:

- `cache.onGet((obj) => {})`: Binds a function to `get` event.
- `cache.oneGet((obj) => {})`: Binds a function 1 time to `get` event.
- `cache.offGet(/* instantiated fn */)`: Remove a function from `get` event.
- `cache.onSet((obj) => {})`: Binds a function to `set` event.
- `cache.oneSet((obj) => {})`: Binds a function 1 time to `set` event.
- `cache.offSet(/* instantiated fn */)`: Remove a function from `set` event.
- `cache.onRemove((obj) => {})`: Binds a function to `remove` event.
- `cache.oneRemove((obj) => {})`: Binds a function 1 time to `remove` event.
- `cache.offRemove(/* instantiated fn */)`: Remove a function from `remove` event.
- `cache.onExpire((obj) => {})`: Binds a function to `expire` event.
- `cache.oneExpire((obj) => {})`: Binds a function 1 time to `expire` event.
- `cache.offExpire(/* instantiated fn */)`: Remove a function from `expire` event.
- `cache.onMerge((obj) => {})`: Binds a function to `merge` event.
- `cache.oneMerge((obj) => {})`: Binds a function 1 time to `merge` event.
- `cache.offMerge(/* instantiated fn */)`: Remove a function from `merge` event.
- `cache.onConcat((obj) => {})`: Binds a function to `concat` event.
- `cache.oneConcat((obj) => {})`: Binds a function 1 time to `concat` event.
- `cache.offConcat(/* instantiated fn */)`: Remove a function from `concat` event.
- `cache.onReset((obj) => {})`: Binds a function to `reset` event.
- `cache.oneReset((obj) => {})`: Binds a function 1 time to `reset` event.
- `cache.offReset(/* instantiated fn */)`: Remove a function from `reset` event.


__Example:__

``` js

// Instantiate cache with event binding
const cache = new MemoryCache({}, {
    events: true
});

// Set event binding after instantiation
cache.events = true || false;

// Happens on every get
cache.onGet(function(opts) {

    fs.writeFileSync(`${opts.name}.json`, JSON.strigify(opts.value));
});

// Only happens one time
cache.oneReset(function() {

    console.warn('Cache was reset!!!');
});
```


### Contributing

- Include 100% test coverage.
- Must support older browsers.
- Submit an issue first for significant changes.
