'use strict';

const MemoryCache = require('.');
const Benchmark = require('benchmark');

const data = require('./test/data.json');

const moderateData = data.slice(0,100);
const concat = data.slice(100,200);
const merge = data.slice(200,300);
const objs = data.slice(500,1000).reduce((acc, cur) => {

    acc[cur._id + +new Date];
    return acc;
}, {});

const objKeys = Object.keys(objs);

const test = {
    a: {
        b: 'c'
    },
    deep: {
        nested: {
            obj: {
                is: {
                    set: 'yes'
                }
            }
        }
    }
};

const cache = new MemoryCache;
cache.set('test', test);

const tests = [
    ['cache.set simple boolean', function() {

        cache.set('benchmark', true);
    }],
    ['cache.get simple boolean', function() {

        cache.get('benchmark');
    }],
    ['cache.set simple object', function() {

        cache.set('test', test);
    }],
    ['cache.get simple object', function() {

        cache.get('test');
    }],
    ['cache.set a moderate amount of data', function() {

        cache.set('data', moderateData);
    }],
    ['cache.get a moderate amount of data', function() {

        cache.get('data');
    }],
    ['cache.set a large amount of data ', function() {

        for (const key of objKeys) {

            cache.set(key, objs[key]);
        }
    }],
    ['cache.get a large amount of data', function() {

        for (const key of objKeys) {

            cache.get(key);
        }
    }]
]

const evCache = new MemoryCache({}, { events: true });
evCache.set('test', test);

const noop = () => {};

evCache.onGet(noop);
evCache.onSet(noop);

let suite = new Benchmark.Suite;

for (const [name, _test] of tests) {
    suite = suite.add(name, _test);
}

suite.on('cycle', function(event) {

    console.log(String(event.target));
})
.run({ 'async': true });


let evSuite = new Benchmark.Suite;

const evTests = [
    ['EVENTS: evCache.set simple boolean', function() {

        evCache.set('benchmark', true);
    }],
    ['EVENTS: evCache.get simple boolean', function() {

        evCache.get('benchmark');
    }],
    ['EVENTS: evCache.set simple object', function() {

        evCache.set('test', test);
    }],
    ['EVENTS: evCache.get simple object', function() {

        evCache.get('test');
    }],
    ['EVENTS: evCache.set a moderate amount of data', function() {

        evCache.set('data', moderateData);
    }],
    ['EVENTS: evCache.get a moderate amount of data', function() {

        evCache.get('data');
    }],
    ['EVENTS: evCache.set a large amount of data ', function() {

        for (const key of objKeys) {

            evCache.set(key, objs[key]);
        }
    }],
    ['EVENTS: evCache.get a large amount of data', function() {

        for (const key of objKeys) {

            evCache.get(key);
        }
    }],
]

for (const [name, _test] of evTests) {
    evSuite = evSuite.add(name, _test);
}
evSuite.on('cycle', function(event) {

    console.log(String(event.target));
})
.run({ 'async': true });
