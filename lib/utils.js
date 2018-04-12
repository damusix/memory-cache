'use strict';

var utils = {

    pathArr: function(path) {

        return (path || '').split('/');
    },

    getFirstInPath: function(path) {

        return utils.pathArr(path)[0];
    },

    findInObj: function(obj, arr) {

        var theObject = obj[arr.shift()];

        if (theObject !== undefined && arr.length) {
            theObject = utils.findInObj(theObject, arr);
        }

        return theObject;
    },

    get: function (obj, path) {

        return utils.findInObj(obj, utils.pathArr(path));
    },

    // Hapi Hoek clone
    // https://github.com/hapijs/hoek/blob/master/lib/index.js
    clone: function (obj, seen) {

        if (typeof obj !== 'object' ||
            obj === null) {

            return obj;
        }

        seen = seen || new Map();

        const lookup = seen.get(obj);
        if (lookup) {
            return lookup;
        }

        let newObj;
        let cloneDeep = false;

        if (!Array.isArray(obj)) {
            if (Buffer.isBuffer(obj)) {
                newObj = Buffer.from(obj);
            }
            else if (obj instanceof Date) {
                newObj = new Date(obj.getTime());
            }
            else if (obj instanceof RegExp) {
                newObj = new RegExp(obj);
            }
            else {
                const proto = Object.getPrototypeOf(obj);
                if (proto &&
                    proto.isImmutable) {

                    newObj = obj;
                }
                else {
                    newObj = Object.create(proto);
                    cloneDeep = true;
                }
            }
        }
        else {
            newObj = [];
            cloneDeep = true;
        }

        seen.set(obj, newObj);

        if (cloneDeep) {
            const keys = Object.getOwnPropertyNames(obj);
            for (let i = 0; i < keys.length; ++i) {
                const key = keys[i];
                const descriptor = Object.getOwnPropertyDescriptor(obj, key);
                if (descriptor &&
                    (descriptor.get ||
                        descriptor.set)) {

                    Object.defineProperty(newObj, key, descriptor);
                }
                else {
                    newObj[key] = utils.clone(obj[key], seen);
                }
            }
        }

        return newObj;
    }
};

module.exports = utils;
