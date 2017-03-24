
const chai = require('chai');
const expect = chai.expect;
const utils = require('./lib/utils');

let test = {
    a: { b: 'c' },
    deep: { nested: { obj: { is: { set: 'yes' }}}},
    arr: [1,2,3,4,5]
};

expect(utils.pathArr).to.be.a('function');
expect(utils.findInObj).to.be.a('function');
expect(utils.get).to.be.a('function');

let pArr = utils.pathArr('a.b');

expect(pArr).to.have.lengthOf(2);
expect(utils.findInObj(test, pArr)).to.equal('c');
expect(utils.get(test, 'a.b')).to.equal('c');

const data = require('./data.json').slice(0,5);

// Test both the es6 and es5 versions
['.', './lib/es5'].forEach((path) => {

const MemoryCache = require(path);


expect(MemoryCache).to.be.a('function');

// Reset test
test = {
    a: { b: 'c' },
    deep: { nested: { obj: { is: { set: 'yes' }}}},
    arr: [1,2,3,4,5]
};

data[0].name.last = 'Rasmussen';

let cache = new MemoryCache;

// Assert all functions are set
expect(cache).to.be.an('object');
expect(cache.set).to.be.a('function');
expect(cache.get).to.be.a('function');
expect(cache.remove).to.be.a('function');
expect(cache.expire).to.be.a('function');
expect(cache.getIn).to.be.a('function');
expect(cache.setIn).to.be.a('function');
expect(cache.merge).to.be.a('function');
expect(cache.mergeIn).to.be.a('function');
expect(cache.concat).to.be.a('function');
expect(cache.concatIn).to.be.a('function');
expect(cache.reset).to.be.a('function');
expect(cache.debug).to.be.a('function');

let returnValue = cache.set('test', test);

// Assert return value
expect(returnValue).to.be.an('object');
expect(cache.get('test')).to.be.an('object');
expect(cache.get('test').a.b).to.equal(returnValue.a.b);

// Assert return full cache
expect(cache.get(true).test).to.equal(test);

// Assert delete from cache
cache.set('remove', test);
expect(cache.remove('remove')).to.equal(true);
expect(cache.get('remove')).to.equal(undefined);

// Assert find deep nested value
expect(cache.getIn('test.a.b')).to.equal('c');
expect(cache.getIn('test.deep.nested.obj.is.set')).to.equal('yes');

// Assert replace deep nested value
expect(cache.setIn('test.deep.nested.obj.is.set', true)).to.equal(true);
expect(cache.getIn('test.deep.nested.obj.is.set')).to.equal(true);
expect(cache.get('test').deep.nested.obj.is.set).to.equal(true);
expect(test.deep.nested.obj.is.set).to.equal(true);

// Assert array functions
cache.set('data', data);
expect(cache.get('data')).to.be.an('array');
expect(cache.get('data').length).to.equal(data.length);
expect(cache.get('data')[0]).to.equal(data[0]);

// Assert find nested values
expect(cache.getIn('data.0')).to.equal(data[0]);
expect(cache.getIn('data.0.name.last')).to.equal('Rasmussen');

// Assert replace nested values
expect(cache.setIn('data.0.name.last', 'Alonso')).to.equal('Alonso');
expect(cache.getIn('data.0.name.last')).to.equal('Alonso');
expect(data[0].name.last).to.equal('Alonso');


let arrLength = data.length;

// Assert concatenation of cached array
cache.concat('data', [1,2,3,4,5]);
expect(cache.get('data').length).to.not.equal(arrLength);

arrLength = cache.getIn('test.arr').length;

// Assert concatenation of nested properties
cache.concatIn('test.arr', [6,7,8,9,0]);
expect(cache.get('test').arr.length).to.not.equal(arrLength);
expect(cache.getIn('test.arr').length).to.not.equal(arrLength);
expect(cache.getIn('test.arr').length).to.equal(arrLength + 5);
expect(cache.getIn('test.arr.8')).to.equal(9);
expect(cache.getIn('test.arr.9')).to.equal(0);

// Assert merging of cached objects
expect(cache.get('test')).to.not.have.property('merge');
cache.merge('test', { merge: true });
expect(cache.get('test')).to.have.property('merge');
expect(cache.get('test').merge).to.equal(true);

// Assert merging of nested objects
expect(cache.getIn('test.deep.nested.obj.is.deepMerged')).to.equal(undefined);
cache.mergeIn('test.deep.nested.obj.is', { deepMerged: true });
expect(cache.getIn('test.deep.nested.obj.is.deepMerged')).to.equal(true);


// Assert expiration of cached value
cache.set('expires', true);
cache.expire('expires', 100);
expect(cache.get('expires')).to.equal(true);

setTimeout(() => {

    expect(cache.set('expires')).to.equal(undefined);
}, 150);

// Assert set and expire of cached value
cache.set('set-and-expires', true, 100);
expect(cache.get('set-and-expires')).to.equal(true);

setTimeout(() => {

    expect(cache.get('set-and-expires')).to.equal(undefined);
}, 150);

arrLength = Object.keys(cache.get(true)).length;

// Assert cache reset
expect(cache.reset()).to.be.an('object');
expect(Object.keys(cache.get(true)).length).to.not.equal(arrLength);
expect(Object.keys(cache.get(true)).length).to.equal(0);

// Assert object can be passed as initial cache
cache = new MemoryCache(test);

expect(cache.get('a')).to.be.an('object');
expect(cache.getIn('deep.nested.obj.is.set')).to.equal(true);

setTimeout(() => {

    console.log(`No errors found with "${path}"`);
}, 500);

});
