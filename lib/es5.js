'use strict';
/**
 * Creates an object with storage functions to temporarily
 * cache values in memory. You can store AJAX requests, etc.
 */
module.exports = function MemoryCache ($cache) {

    $cache = $cache || {};
    var self = this;
    var debug = false;

    var utils = {

        pathArr: function(path) {

            return (path || '').split('.');
        },

        findInObj: function(obj, arr) {

            let theObject = obj[arr.shift()];

            if (theObject !== undefined && arr.length) {
                theObject = utils.findInObj(theObject, arr);
            }

            return theObject;
        },

        get: function (obj, path) {

            return utils.findInObj(obj, utils.pathArr(path));
        }
    };


    // Deletes cached key value
    this.remove = function (name) {

        if (debug) console.log('cache remove-ing', name);
        return delete($cache[name])
    };

    // Gets cached key value
    this.get = function (name) {

        if (debug) console.log('cache get-ing', name);

        // Return entire cache if true is passed
        if (name === true) {
            return $cache;
        }

        return utils.get($cache, name);
    };

    // Gets nested cached key value
    this.getIn = function (name) {

        if (debug) console.log('cache getIn-ing', name);

        return utils.get($cache, name);
    };

    // Sets cachwed key value
    this.set = function (name, val, expiresIn) {

        if (debug) console.log('cache set-ing', name, val);

        // Expire cache after time
        if (expiresIn !== undefined && typeof expiresIn === 'number') {

            self.expire(name, expiresIn);
        }

        return $cache[name] = val;
    };

    // Sets deep cached key value
    this.setIn = function (name, val) {

        if (debug) console.log('cache setIn-ing', name);

        var pArr = utils.pathArr(name);

        if (pArr.length > 1) {

            var lastKey = pArr.pop();
            var key = utils.findInObj($cache, pArr);

            return key[lastKey] = val;
        }
        else {

            return $cache[name] = val;
        }

    };

    // Expires cache after ms time
    this.expire = function (name, ms) {

        var wasSet = self.get('__timeout-'+name);

        if (wasSet) {
            clearTimeout(wasSet);
        }

        self.set('__timeout-'+name, setTimeout(function() {

            self.remove(name);
        }));
    };

    // Merges cached value
    this.merge = function (name, obj) {

        if (debug) console.log('cache merge-ing', name, obj);

        for (var key in obj) {

            $cache[name][key] = obj[key]
        }

        return $cache[name];
    };

    // Merges nested cached value
    this.mergeIn = function (name, obj) {

        if (debug) console.log('cache mergeIn-ing', name, obj);
        var find = self.getIn(name);

        return Object.assign(find, obj);
    };

    // Concatenates cached value
    this.concat = function (name, arr) {

        if (debug) console.log('cache concat-ing', name, arr);

        for (var i = 0; arr.length > i; i++) {

            $cache[name].push(arr[i]);
        };

        return $cache[name];
    };

    // Concatenates nested cached value
    this.concatIn = function (name, arr) {

        if (debug) console.log('cache concatIn-ing', name, arr);

        var find = self.getIn(name);

        for (var i = 0; arr.length > i; i++) {

            find.push(arr[i]);
        };

        return find;
    };

    // Concatenates cached value
    this.reset = function () {

        if (debug) console.log('cache reset-ing');
        return $cache = {};
    };

    // Concatenates cached value
    this.debug = function (bool) {

        debug = bool
    };

    return this;
}
