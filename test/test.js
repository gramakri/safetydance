#!/usr/bin/env node

'use strict';

/* global it:false */
/* global describe:false */
/* global before:false */
/* global after:false */

var safe = require('../index.js'),
    assert = require('assert'),
    expect = require('expect.js'),
    os = require('os'),
    path = require('path'),
    crypto = require('crypto'),
    url = require('url');

describe('JSON', function () {
    it('should not throw error when parsing bad JSON', function () {
        var json = safe.JSON.parse('This is totally { not json }');
        expect(json).to.be(null);
        expect(safe.error).to.not.be(null);
    });

    it('should clear error when parsing good JSON', function () {
        var json = safe.JSON.parse('{ "totally" : "json" }');
        expect(json.totally).to.be('json');
        expect(safe.error).to.be(null);
    });

    it('should not throw error when stringifying bad object', function () {
        var obj = { };
        obj.a = { b: obj }; // circular reference
        var str = safe.JSON.stringify(obj);
        expect(str).to.be(null);
        expect(safe.error).to.not.be(null);
    });
});

describe('fs', function () {
    it('should not throw error when reading non-existent file', function () {
        var fileContents = safe.fs.readFileSync('RANDOM');
        expect(fileContents).to.be(null);
    });
    it('should not throw on creating existing dir', function () {
        expect(safe.fs.mkdirSync(os.tmpdir())).to.be(false);
        expect(safe.error).to.not.be(null); // EEXIST
    });
    it('should return true for creating dir', function () {
        var tmpdirname = 'safetydance-test-' + crypto.randomBytes(4).readUInt32LE(0);
        var tmpdir = path.resolve(os.tmpdir(), tmpdirname);
        expect(safe.fs.mkdirSync(tmpdir)).to.be(true);
    });
    it('should return true for removing files', function () {
        var tmpfile = path.join(os.tmpdir(), 'safetydance-test-' + crypto.randomBytes(4).readUInt32LE(0));
        safe.fs.writeFileSync(tmpfile, 'whatever');
        expect(safe.fs.unlinkSync(tmpfile)).to.be(true);
    });
    it('should not throw when unlinking missing file', function () {
        expect(safe.fs.unlinkSync('/this/is')).to.be(false);
    });
    it('should not throw when trying to create existing file', function () {
        expect(safe.fs.openSync('/tmp')).to.be(-1);
    });
    it('should open temp files', function () {
        expect(safe.fs.openSync('/tmp/amazing', 'w')).to.not.be(-1);
    });
    it('should not throw when closing non-existent fd', function () {
        expect(safe.fs.closeSync(1242)).to.be(0);
    });
});

describe('url', function () {
    it('should not throw for parsing invalid url', function () {
        expect(safe.url.parse(undefined) === null);
        expect(safe.url.parse(NaN) === null);
        expect(safe.url.parse(43) === null);
        expect(safe.url.parse(null) === null);
        expect(safe.url.parse('random') === null);
    });

    it('should parse valid urls', function () {
        expect(safe.url.parse('http://www.forwardbias.in')).to.eql(url.parse('http://www.forwardbias.in'));
    });
});

describe('safeCall', function () {
    it('should call', function () {
        var result = safe(function () { return 1 + 2; });
        expect(result).to.be(3);
        expect(safe.error).to.be(null);
    });

    it('should return null on exception', function () {
        var result = safe(function () { throw new Error('OOPS'); });
        expect(result).to.be(null);
        expect(safe.error).to.not.be(null);
    });

    it('should set this', function () {
        var obj = { a: 10 };
        var result = safe(obj, function () { return this.a; });
        expect(result).to.be(10);
        expect(safe.error).to.be(null);
    });
});

describe('safeCall (compat)', function () {
    it('should call', function () {
        var result = safe.safeCall(function () { return 1 + 2; });
        expect(result).to.be(3);
        expect(safe.error).to.be(null);
    });

    it('should return null on exception', function () {
        var result = safe.safeCall(function () { throw new Error('OOPS'); });
        expect(result).to.be(null);
        expect(safe.error).to.not.be(null);
    });

    it('should set this', function () {
        var obj = { a: 10 };
        var result = safe.safeCall(obj, function () { return this.a; });
        expect(result).to.be(10);
        expect(safe.error).to.be(null);
    });
});

describe('query', function () {
    it('should return self on falsy query', function () {
        var data = { x: 10, y: 20 };
        expect(safe.query(data, '')).to.equal(data);
        expect(safe.query(data, null)).to.equal(data);
    });

    it('can access top level queries', function () {
        var data = { x: 10, y: 20 };
        expect(safe.query(data, 'x')).to.equal(10);
        expect(safe.query(data, '.x')).to.equal(10);
        expect(safe.query(data, 'y')).to.equal(20);
        expect(safe.query(data, '.y')).to.equal(20);
    });

    it('can access nested queries on objects', function () {
        var data = { points: [ { x: 10, y: 20 }, { x: 40, y: 50 } ] };
        expect(safe.query(data, 'points[0].x')).to.equal(10);
        expect(safe.query(data, 'points[1].y')).to.equal(50);
        expect(safe.query(data, 'points.1.y')).to.equal(50);
        expect(safe.query(data, 'points')).to.equal(data.points);
        expect(safe.query(data, '.points')).to.equal(data.points);
        expect(safe.query(data, '.points[0]')).to.equal(data.points[0]);
    });

    it('can access nested queries on arrays', function () {
        var data = [ { x: 10, y: 20 }, { x: 40, y: 50 } ];
        expect(safe.query(data, '[0].x')).to.equal(10);
        expect(safe.query(data, '[1].y')).to.equal(50);
        expect(safe.query(data, '1.y')).to.equal(50);
        expect(safe.query(data, '')).to.equal(data);
    });

    it('does not throw for bad queries', function () {
        var data = { points: [ { x: 10, y: 20 }, { x: 40, y: 50 } ] };
        expect(safe.query(data, '.')).to.equal(undefined);
        expect(safe.query(data, 'something')).to.equal(undefined);
        expect(safe.query(data, 'points[4]')).to.equal(undefined);
        expect(safe.query(data, 'points[4].random')).to.equal(undefined);
        expect(safe.query(data, 'points.random')).to.equal(undefined);
        expect(safe.query(data, 'points.0.well')).to.equal(undefined);
        expect(safe.query(data, 'points.')).to.equal(undefined);
        expect(safe.query(data, 'points..')).to.equal(undefined);
    });

    it('should return defaultValue for bad queries', function () {
        var data = { points: [ { x: 10, y: 20 }, { x: 40, y: 50 } ] };
        var defaultValue = '34';

        expect(safe.query(data, '.', defaultValue)).to.equal(defaultValue);
        expect(safe.query(data, 'something', defaultValue)).to.equal(defaultValue);
        expect(safe.query(data, 'points[4]', defaultValue)).to.equal(defaultValue);
        expect(safe.query(data, 'points[4].random', defaultValue)).to.equal(defaultValue);
        expect(safe.query(data, 'points.random', defaultValue)).to.equal(defaultValue);
        expect(safe.query(data, 'points.0.well', defaultValue)).to.equal(defaultValue);
        expect(safe.query(data, 'points.', defaultValue)).to.equal(defaultValue);
        expect(safe.query(data, 'points..', defaultValue)).to.equal(defaultValue);
    });

    // maybe make these work someday
    it('does not work for keys with .', function () {
        var data = { '0.12': 34 };
        expect(safe.query(data, '0.12')).to.equal(undefined);
    });
});

describe('set', function () {
    it('can set any level property', function () {
        var obj = { };
        safe.set(obj, 'x', 42);
        expect(obj.x).to.equal(42);

        safe.set(obj, 'some.deep.property', 42);
        expect(obj.some.deep.property).to.equal(42);
    });

    it('returns new object if source is null', function () {
        var obj = safe.set(null, 'x', 42);
        expect(obj.x).to.equal(42);

        obj = safe.set(undefined, 'x', 42);
        expect(obj.x).to.equal(42);
    });

    it('deletes non-object properties in path', function () {
        var obj = { some: 42 };
        safe.set(obj, 'some.deep.property', 42);
        expect(obj.some.deep.property).to.equal(42);

        obj = 42;
        obj = safe.set(obj, 'some.deep.property', 42);
        expect(obj.some.deep.property).to.equal(42);
    });

    it('preserves arrays', function () {
        var obj = { some: [ 34 ] };
        safe.set(obj, 'some[0]', 42);
        expect(obj.some[0]).to.equal(42);
        expect(obj.some instanceof Array).to.be(true);
    });
});

