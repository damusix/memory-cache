'use strict';

const { get, pathArr, findInObj, clone, getFirstInPath, attachObserver } = require('./utils');
const observable = require('./observable');

/**
 * Creates an object with storage functions to temporarily
 * cache values in memory. You can store AJAX requests, etc.
 */
module.exports = function MemoryCache ($cache, opts={}) {

    let disableEvents = opts.disableEvents;

    $cache = $cache || {};

    if (!disableEvents) {

        observable(this);
    }

    const self = this;
    const timeoutRgx = /__timeout/i;
    let debug = false;

    Object.defineProperties(this, {

        // Deletes cached key value
        remove: {
            value: (name) => {

                if (debug) console.info('MemoryCache: remove', name);

                if (!timeoutRgx.test(name) && !disableEvents) {
                    self.trigger('remove', {
                        key: name,
                        value: $cache[name]
                    });
                }

                return delete($cache[name]);
            },
            writable: false
        },

        // Gets cached key value
        get: {
            value: (name) => {

                if (debug) console.info('MemoryCache: get', name);
                let value;

                // Return entire cache if true is passed
                if (name === true) {

                    value = clone($cache);
                }
                else {

                    value = clone($cache[name]);
                }


                if (!timeoutRgx.test(name) && !disableEvents) {

                    self.trigger('get', {
                        key: name,
                        name,
                        value
                    });
                }

                return value;
            },
            writable: false
        },

        // Gets nested cached key value
        getIn: {
            value: (name) => {

                if (debug) console.info('MemoryCache: getIn', name);

                const subValue = clone(get($cache, name));
                const value = clone($cache[getFirstInPath(name)]);

                if (!disableEvents) {

                    self.trigger('get', {
                        key: getFirstInPath(name),
                        name,
                        value,
                        subValue,
                        nested: true
                    });
                }

                return subValue;
            },
            writable: false
        },

        // Sets cached key value. Can set expire in ms.
        set: {
            value: (name, val, expiresIn) => {

                if (debug) console.info('MemoryCache: set', name, val);

                // Expire cache after time
                if (expiresIn !== undefined && typeof expiresIn === 'number') {

                    self.expire(name, expiresIn);
                }

                const value = clone($cache[name] = val);

                if (!timeoutRgx.test(name) && !disableEvents) {
                    self.trigger('set', {
                        key: name,
                        name,
                        value,
                        expiresIn
                    });
                }

                return value;
            },
            writable: false
        },

        // Sets nested cached key value
        setIn: {
            value: (name, subValue) => {

                if (debug) console.info('MemoryCache: setIn', name);

                const pArr = pathArr(name);

                let lastKey, value, key;
                if (pArr.length > 1) {

                    lastKey = pArr.pop();
                    key = pArr[0]

                    const find = findInObj($cache, pArr);

                    find[lastKey] = subValue;

                    value = clone($cache[key]);
                }
                else {

                    key = name;
                    value = clone($cache[key] = subValue);
                }

                if (!disableEvents) {

                    self.trigger('set', {

                        key,
                        name,
                        value,
                        with: subValue,
                        nested: true
                    });
                }

                return value;

            },
            writable: false
        },

        // Expires cache after ms time
        expire: {
            value: (name, ms) => {

                if (debug) console.info('MemoryCache: expire', name, ms);

                const wasSet = self.get(`__timeout-${name}`);

                if (wasSet) {
                    clearTimeout(wasSet);
                }

                self.set(`__timeout-${name}`, setTimeout(() => {

                    self.remove(name);
                    self.trigger('expired', { key: name, ms });
                }));
            },
            writable: false
        },

        // Merges cached value
        merge: {
            value: (name, val) => {

                if (debug) console.info('MemoryCache: merge', name, val);
                const value = clone(Object.assign($cache[name], val));

                if (!disableEvents) {
                    self.trigger('merge', {

                        key: name,
                        name,
                        value,
                        with: val
                    });
                }

                return value;
            },
            writable: false
        },

        // Merges nested cached value
        mergeIn: {
            value: (name, val) => {

                if (debug) console.info('MemoryCache: mergeIn', name, val);

                const pArr = pathArr(name);
                const find = findInObj($cache, pArr);

                Object.assign(find, val);

                if (!disableEvents) {

                    self.trigger('merge', {

                        key: getFirstInPath(name),
                        name,
                        with: val,
                        value: clone($cache[getFirstInPath(name)]),
                        nested: true
                    });
                }

                return clone(find);
            },
            writable: false
        },

        // Concatenates cached value
        concat: {
            value: (name, arr) => {

                if (debug) console.info('MemoryCache: concat', name, arr);

                $cache[name] = $cache[name].concat(arr);

                const value = clone($cache[name]);

                if (!disableEvents) {

                    self.trigger('concat', {

                        key: name,
                        name,
                        with: arr,
                        value
                    });
                }

                return value;
            },
            writable: false
        },

        // Concatenates nested cached value
        concatIn: {
            value: (name, arr) => {

                if (debug) console.info('MemoryCache: concatIn', name, arr);

                const pArr = pathArr(name);
                const find = findInObj($cache, pArr);

                for (var i = 0; i < arr.length; i++) {

                    find.push(arr[i]);
                };

                if (!disableEvents) {

                    self.trigger('concat', {
                        key: getFirstInPath(name),
                        name,
                        with: arr,
                        value: clone($cache[getFirstInPath(name)]),
                        nested: true
                    });
                }

                return find;
            },
            writable: false
        },

        // Resets cache
        reset: {
            value: () => {

                if (debug) console.info('MemoryCache: reset');
                $cache = {};

                if (!disableEvents) {

                    self.trigger('reset');
                }

                return $cache;
            },
            writable: false
        },

        // Turns on logging
        debug: {
            value: (bool) => {

                debug = bool || false;
                console.info('MemoryCache: debug set to ', bool);
            },
            writable: false
        },

        // Disables events
        disableEvents: {
            value: (bool) => {

                disableEvents = bool || false;

                if (bool) {

                    console.info('MemoryCache: events enabled');
                }
                else {

                    console.info('MemoryCache: events disabled');
                }
            },
            writable: false
        }

    });
}
