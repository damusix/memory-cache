'use strict';

const MemoryCache = require('.');
const Benchmark = require('benchmark');
const suite = new Benchmark.Suite;

const data = require('./data.json');

const moderateData = data.slice(0,100);
const concat1 = data.slice(200,300);
const concat2 = data.slice(400,600);

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

const dataIds = [];

suite
    .add('cache.set simple boolean', function() {

        cache.set('benchmark', true);
    })
    .add('cache.get simple boolean', function() {

        cache.get('benchmark');
    })
    .add('cache.set simple object', function() {

        cache.set('test', test);
    })
    .add('cache.get simple object', function() {

        cache.get('test');
    })
    .add('cache.set a moderate amount of data', function() {

        cache.set('data', moderateData);
    })
    .add('cache.get a moderate amount of data', function() {

        cache.get('data');
    })
    .add('cache.concat a moderate amount of data', function() {

        cache.concat('data', concat1);
    })
    .add('cache.get a moderate amount of data', function() {

        cache.get('data');
    })
    .add('cache.set a large amount of data', function() {

        data.forEach((d) => {

            cache.set(d._id + +new Date, d);
        });
    })
    .add('cache.set a large amount of data prep', function() {

        let push = false;

        if (!dataIds.length) {

            push = true;
        }

        data.forEach((d) => {

            const id = d._id + +new Date;
            cache.set(id, d);
            push && dataIds.push(id);
        });
    })
    .add('cache.get a large amount of data', function() {

        dataIds.forEach((id) => {

            cache.get(id);
        });
    })
    .add('cache.replace deep nested obj', function() {

        cache.replace('test.deep.nested.obj.is.set', true);
    })
    .add('cache.find deep nested obj', function() {

        cache.find('test.deep.nested.obj.is.set');
    })

    .on('cycle', function(event) {

        console.log(String(event.target));

        // let data = cache.get('data');
        // data && console.log(data.length);
        console.log(dataIds.length);
    })

    .run({ 'async': true });
