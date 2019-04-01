'use strict';

const observable = require('./observable');
const constants = require('./constants');

const camelize = (str1, str2) => str1 + str2.charAt(0).toUpperCase() + str2.slice(1);

/**
 * Creates an object with storage functions to temporarily
 * cache values in memory. You can store AJAX requests, etc.
 */
module.exports = function MemoryCache($cache, opts = {}) {

    const self = this || {};

    let events = Boolean(opts.events);
    let debug = Boolean(opts.debug);

    $cache = new Map(Object.entries($cache || {}));
    const $timeouts = new Map();

    const cEntries = Object.entries(constants);
    const { on, one, off, trigger } = observable();

    const _get = (name) => $cache.get(name);
    const _set = (name, val) => $cache.set(name, val);
    const _del = (name) => $cache.delete(name);

    const _clear = () => {

        $cache.clear();
        $timeouts.clear();
    };

    const _expire = (name) => {

        $cache.delete(name);
        $timeouts.delete(name);
    };

    const _trigger = (ev, val) => {

        trigger(constants[ev], val);
    };

    const _debug = (ev, key, val) => {

        console.info('MemoryCache:', ev || '', key || '', val || '');
    };


    cEntries.forEach(([k, sym]) => {

        Object.defineProperty(self, camelize('on', k), {
            value: (fn) => on(sym, fn),
            enumerable: false,
            writable: false,
            configurable: false
        });

        Object.defineProperty(self, camelize('one', k), {
            value: (fn) => one(sym, fn),
            enumerable: false,
            writable: false,
            configurable: false
        });

        Object.defineProperty(self, camelize('off', k), {
            value: (fn) => off(sym, fn),
            enumerable: false,
            writable: false,
            configurable: false
        });
    });

    Object.defineProperty(this, 'size', {

        get() { return $cache.size },
        set() { return $cache.size },
        enumerable: false,
        configurable: false
    });

    Object.defineProperty(this, 'keys', {

        get() { return Array.from($cache.keys()); },
        set() { return Array.from($cache.keys()); },
        enumerable: false,
        configurable: false
    });

    Object.defineProperty(this, 'events', {

        get() { return events },
        set(to) { return events = Boolean(to) },
        enumerable: false,
        configurable: false
    });

    Object.defineProperty(this, 'debug', {

        get() { return debug },
        set(to) { return debug = Boolean(to) },
        enumerable: false,
        configurable: false
    });

    Object.defineProperties(this, {

        has: {
            value: (name) => $cache.has(name),
            enumerable: false,
            writable: false,
            configurable: false
        },

        each: {
            value: (fn) => $cache.forEach((v,k) => fn(v,k)),
            enumerable: false,
            writable: false,
            configurable: false
        },

        // Deletes cached key value
        remove: {
            value: (key) => {

                debug && _debug('remove', key);

                events && _trigger('remove', {
                    key: key,
                    value: $cache.get(key)
                });

                return _del(key);
            },
            enumerable: false,
            writable: false,
            configurable: false
        },

        // Gets cached key value
        get: {
            value: (key) => {

                debug && _debug('get', key);

                let value;

                // Return entire cache if true is passed
                if (key === true) {

                    value = {};

                    $cache.forEach((v, k) => {

                        value[k] = v;
                    });
                }
                else {

                    value = _get(key);
                }

                events && _trigger('get', {
                    key,
                    value
                });

                return value;
            },
            enumerable: false,
            writable: false,
            configurable: false
        },

        // Sets cached key value. Can set expire in ms.
        set: {
            value: (key, val, expires) => {

                debug && _debug('set', key, val, expires);

                _set(key, val);

                const value = _get(key);

                events && _trigger('set', {
                    key,
                    value,
                    expires
                });

                // Expire cache after time
                if (expires) {

                    self.expire(key, expires);
                }

                return value;
            },
            enumerable: false,
            writable: false,
            configurable: false
        },

        // Expires cache after ms time
        expire: {
            value: (key, ms) => {

                debug && _debug('expire', key, ms);

                let timeout = $timeouts.get(key);

                if (timeout) {
                    clearTimeout(timeout);
                }

                $timeouts.set(key, setTimeout(() => {

                    _expire(key);
                    events && _trigger('expire', {
                        key,
                        ms
                    });
                }));
            },
            enumerable: false,
            writable: false,
            configurable: false
        },

        // Merges cached value
        merge: {
            value: (key, val) => {

                debug && _debug('merge', key, val);

                const value = Object.assign(_get(key), val);

                events && _trigger('merge', {
                    key,
                    value
                });

                return value;
            },
            enumerable: false,
            writable: false,
            configurable: false
        },

        // Concatenates cached value
        concat: {
            value: (key, val) => {

                debug && _debug('concat', key, val);

                let value = _get(key);
                value = value.concat(val);

                _set(key, value);

                events && _trigger('concat', {
                    key,
                    value
                });

                return value;
            },
            enumerable: false,
            writable: false,
            configurable: false
        },

        // Resets cache
        reset: {
            value: () => {

                debug && _debug('reset');
                events && _trigger('reset');
                return _clear();
            },
            enumerable: false,
            writable: false,
            configurable: false
        }
    });
}
