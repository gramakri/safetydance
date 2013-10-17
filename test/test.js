#!/usr/bin/env node

'use strict';

/* global it:false */
/* global describe:false */
/* global before:false */
/* global after:false */

var safe = require('../index.js'),
    assert = require('assert'),
    expect = require('expect.js');

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
});

