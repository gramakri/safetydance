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
    crypto = require('crypto');

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

