'use strict';

var utils = {

    pathArr: function(path) {

        return (path || '').split('.');
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
    }
};

module.exports = utils;
