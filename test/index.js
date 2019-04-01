const chai = require('chai');

const MemoryCache = require('..');
const observable = require('../lib/observable');
const constants = require('../lib/constants');

const { expect, assert } = chai;

const testObj = () => ({
    a: { b: 'c' },
    deep: { nested: { obj: { is: { set: 'yes' }}}},
    arr: [1,2,3,4,5]
});

const noop = () => {};

describe('Observable', function () {

    it('is a function', function () {

        expect(observable).to.be.a('function');
    });

    it('returns observable functions', function () {

        const x = observable();

        expect(x.on).to.be.a('function');
        expect(x.one).to.be.a('function');
        expect(x.off).to.be.a('function');
        expect(x.trigger).to.be.a('function');
    });

    it('does not observe non-symbol event', function () {

        const x = observable();

        expect(() => {
            x.on('test', noop);
        }).to.throw();
    });

    it('observes symbol events', function () {

        const x = observable();

        expect(() => {
            x.on(constants.get, noop);
            x.one(constants.get, noop);
            x.trigger(constants.get, noop);
            x.off(constants.get, noop);
        }).to.not.throw();
    });

    it('triggers functions bound to an event', function () {

        const x = observable();
        let i = 0;

        x.on(constants.get, () => i++);
        x.trigger(constants.get)
        x.trigger(constants.get)
        x.trigger(constants.get)

        expect(i).to.equal(3);
    });

    it('passes arguments to functions bound to an event', function () {

        const x = observable();
        let args;

        x.on(constants.get, (a,b,c) => args = [a,b,c]);
        x.trigger(constants.get, 'a', 'b', 'c');

        expect(args).to.include('a', 'b', 'c')
    });

    it('removes functions bound to an event', function () {

        const x = observable();
        let passed = true;

        const fn = () => passed = false;

        x.on(constants.get, fn);
        x.off(constants.get, fn);
        x.trigger(constants.get);

        expect(passed).to.equal(true);
    });

    it('triggers functions bound to an event only one time', function () {

        const x = observable();
        let i = 0;

        x.one(constants.get, () => i++);
        x.trigger(constants.get);
        x.trigger(constants.get);
        x.trigger(constants.get);

        expect(i).to.equal(1);
    });
});

describe('MemoryCache', function () {

    const test = testObj();
    let cache;

    it('should be a function', function () {

        expect(MemoryCache).to.be.a('function');
    });

    it('should have all api functions', function () {

        cache = new MemoryCache();

        // Assert all functions are set
        expect(cache).to.be.an('object');
        expect(cache.set).to.be.a('function');
        expect(cache.get).to.be.a('function');
        expect(cache.remove).to.be.a('function');
        expect(cache.expire).to.be.a('function');
        expect(cache.merge).to.be.a('function');
        expect(cache.concat).to.be.a('function');
        expect(cache.reset).to.be.a('function');
        expect(cache.has).to.be.a('function');

        expect(cache.debug).to.not.equal(undefined);
        expect(cache.events).to.not.equal(undefined);
        expect(cache.size).to.not.equal(undefined);
        expect(cache.keys).to.not.equal(undefined);

        expect(cache.onGet).to.be.a('function');
        expect(cache.oneGet).to.be.a('function');
        expect(cache.offGet).to.be.a('function');

        expect(cache.onSet).to.be.a('function');
        expect(cache.oneSet).to.be.a('function');
        expect(cache.offSet).to.be.a('function');

        expect(cache.onRemove).to.be.a('function');
        expect(cache.oneRemove).to.be.a('function');
        expect(cache.offRemove).to.be.a('function');

        expect(cache.onExpire).to.be.a('function');
        expect(cache.oneExpire).to.be.a('function');
        expect(cache.offExpire).to.be.a('function');

        expect(cache.onMerge).to.be.a('function');
        expect(cache.oneMerge).to.be.a('function');
        expect(cache.offMerge).to.be.a('function');

        expect(cache.onConcat).to.be.a('function');
        expect(cache.oneConcat).to.be.a('function');
        expect(cache.offConcat).to.be.a('function');

        expect(cache.onReset).to.be.a('function');
        expect(cache.oneReset).to.be.a('function');
        expect(cache.offReset).to.be.a('function');

    });

    it('should set a key and return it', function () {

        const returnValue = cache.set('test', test);
        expect(returnValue).to.be.an('object');
    });

    it('should get a key', function () {

        const value = cache.get('test');
        expect(value).to.be.an('object');
        expect(value.a.b).to.equal(test.a.b);
    });

    it('should get the whole cache when passed true as key', function () {

        assert.deepEqual(cache.get(true).test, test);
    });

    it('should delete a key', function () {

        cache.set('remove', test);

        assert.deepEqual(cache.get('remove'), test);
        expect(cache.remove('remove')).to.equal(true);
        expect(cache.get('remove')).to.equal(undefined);
    });

    it('should concat an array key', function () {

        cache.set('concat', [1,2,3]);
        expect(cache.get('concat')).to.not.include(4,5);
        cache.concat('concat', [4,5]);
        expect(cache.get('concat')).to.include(1,2,3,4,5);
    });

    it('should merge an object key', function () {

        cache.set('merge', { merge: true });
        expect(cache.get('merge')).to.not.have.any.keys('merged');
        cache.merge('merge', { merged: true});
        expect(cache.get('merge')).to.have.any.keys('merge','merged');
        expect(cache.get('merge')).to.deep.equal({ merge: true, merged: true });
    });

    it('should expire a set key', function (done) {

        expect(cache.get('merge')).to.deep.equal({ merge: true, merged: true });
        cache.expire('merge', 1);
        expect(cache.get('merge')).to.not.equal(undefined);

        setTimeout(() => {

            expect(cache.get('merge')).to.equal(undefined);
            done();
        }, 5);
    });

    it('should set a key and expire if time is set', function (done) {

        cache.set('set-and-expire', true, 1);

        expect(cache.get('set-and-expire')).to.equal(true);

        setTimeout(() => {

            expect(cache.get('set-and-expire')).to.equal(undefined);
            done();
        }, 5);
    });

    it('should reset cache', function () {

        expect(cache.size).to.equal(2)
        cache.reset();
        expect(cache.size).to.equal(0)
    });

    it('should return all cache keys', function () {

        cache.set('1', 1);
        cache.set('2', 2);
        cache.set('3', 3);

        expect(cache.keys).to.include('1', '2', '3');
    });

    it('should check to see if cache has a key', function () {

        expect(cache.has('1')).to.equal(true);
        expect(cache.has('4')).to.equal(false);
    });

    it('should iterate through cache', function () {

        const keys = [];
        const values = []

        cache.each((val, key) => {
            values.push(val);
            keys.push(key);
        });

        expect(values).to.include(1,2,3);
        expect(keys).to.include('1','2','3');
    });

    it('should return cache size', function () {

        expect(cache.size).to.equal(3);
    });

    it('should bind to events', function (done) {

        // Assert events
        const eventsTested = {

            get: false,
            set: false,
            merge: false,
            concat: false,
            remove: false,
            expire: false,
            reset: false
        };

        expect(cache.events).to.equal(false);
        cache.events = true;
        expect(cache.events).to.equal(true);

        // Bind events to fire 1 time. All events should set true.
        cache.oneGet(() => { eventsTested.get = true; });
        cache.oneSet(() => { eventsTested.set = true; });
        cache.oneRemove(() => { eventsTested.remove = true; });
        cache.oneExpire(() => { eventsTested.expire = true; });
        cache.oneMerge(() => { eventsTested.merge = true; });
        cache.oneConcat(() => { eventsTested.concat = true; });
        cache.oneReset(() => { eventsTested.reset = true; });

        cache.set('merge', {});
        cache.set('concat', []);
        cache.set('remove', true);
        cache.get('merge');
        cache.merge('merge', {});
        cache.concat('concat', []);
        cache.expire('remove', 0);
        cache.remove('remove');
        cache.reset();

        setTimeout(() => {

            expect(Object.values(eventsTested)).to.not.include(false);
            done();
        }, 10);
    });

    it('should cache passed object', function () {

        const c = {
            test: true,
            taste: 'good',
            tats: 'lots',
            tits: 'blitz'
        }

        cache = new MemoryCache(c);

        expect(cache.keys).to.include('test', 'taste', 'tats', 'tits');
        expect(cache.get(true)).to.deep.equal(c);
    });
});