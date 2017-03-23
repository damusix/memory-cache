
/**
 * Creates an object with storage functions to temporarily
 * cache values in memory. You can store AJAX requests, etc.
 */
function MemoryCache($cache) {

    Object.defineProperties(this, {

        // Deletes cached key value
        remove: {
            value: function value(name) {
                return delete $cache[name];
            },
            writable: false
        },

        // Gets cached key value
        get: {
            value: function value(name) {
                return $cache[name];
            },
            writable: false
        },

        // Sets cached key value
        set: {
            value: function value(name, val) {
                return $cache[name] = val;
            },
            writable: false
        },

        // Merges cached value
        merge: {
            value: function value(name, obj) {
                for (key in obj) {

                    $cache[name][key] = obj[key];
                }
            },
            writable: false
        },

        // Concatenates cached value
        concat: {
            value: function value(name, arr) {
                return $cache[name].concat(arr);
            },
            writable: false
        },

        // Concatenates cached value
        reset: {
            value: function value() {
                return $cache = {};
            },
            writable: false
        }
    });
}
