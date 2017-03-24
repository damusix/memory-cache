'use strict';

const utils = require('./utils');

/**
 * Creates an object with storage functions to temporarily
 * cache values in memory. You can store AJAX requests, etc.
 */
module.exports = function MemoryCache ($cache) {

    $cache = $cache || {};

    const self = this;
    let debug = false;

    Object.defineProperties(this, {

        // Deletes cached key value
        remove: {
            value: (name) => {

                if (debug) console.log('cache remove-ing', name);
                return delete($cache[name])
            },
            writable: false
        },

        // Gets cached key value
        get: {
            value: (name) => {

                if (debug) console.log('cache get-ing', name);

                // Return entire cache if true is passed
                if (name === true) {
                    return $cache;
                }

                return $cache[name];
            },
            writable: false
        },

        // Gets nested cached key value
        getIn: {
            value: (name) => {

                if (debug) console.log('cache getIn-ing', name);

                return utils.get($cache, name);
            },
            writable: false
        },

        // Sets cached key value. Can set expire in ms.
        set: {
            value: (name, val, expiresIn) => {

                if (debug) console.log('cache set-ing', name, val);

                // Expire cache after time
                if (expiresIn !== undefined && typeof expiresIn === 'number') {

                    self.expire(name, expiresIn);
                }

                return $cache[name] = val;
            },
            writable: false
        },

        // Sets nested cached key value
        setIn: {
            value: (name, val) => {

                if (debug) console.log('cache setIn-ing', name);

                const pArr = utils.pathArr(name);

                let lastKey;

                if (pArr.length > 1) {

                    lastKey = pArr.pop();
                    const key = utils.findInObj($cache, pArr);

                    return key[lastKey] = val;
                }
                else {

                    return $cache[name] = val;
                }

            },
            writable: false
        },

        // Expires cache after ms time
        expire: {
            value: (name, ms) => {

                const wasSet = self.get(`__timeout-${name}`);

                if (wasSet) {
                    clearTimeout(wasSet);
                }

                self.set(`__timeout-${name}`, setTimeout(() => {

                    self.remove(name);
                }));
            },
            writable: false
        },

        // Merges cached value
        merge: {
            value: (name, obj) => {

                if (debug) console.log('cache merge-ing', name, obj);
                return Object.assign($cache[name], obj);
            },
            writable: false
        },

        // Merges nested cached value
        mergeIn: {
            value: (name, obj) => {

                if (debug) console.log('cache mergeIn-ing', name, obj);
                const find = self.getIn(name);

                return Object.assign(find, obj);
            },
            writable: false
        },

        // Concatenates cached value
        concat: {
            value: (name, arr) => {

                if (debug) console.log('cache concat-ing', name, arr);

                for (var i = 0; arr.length > i; i++) {

                    $cache[name].push(arr[i]);
                };

                return $cache[name];
            },
            writable: false
        },

        // Concatenates nested cached value
        concatIn: {
            value: (name, arr) => {

                if (debug) console.log('cache concatIn-ing', name, arr);

                const find = self.getIn(name);

                for (var i = 0; arr.length > i; i++) {

                    find.push(arr[i]);
                };

                return find;
            },
            writable: false
        },

        // Resets cache
        reset: {
            value: () => {

                if (debug) console.log('cache reset-ing');
                return $cache = {};
            },
            writable: false
        },

        // Turns on logging
        debug: {
            value: (bool) => debug = bool,
            writable: false
        }

    });
}
