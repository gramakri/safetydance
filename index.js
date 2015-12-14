'use strict';

var assert = require('assert'),
    child_process = require('child_process'),
    fs = require('fs'),
    url = require('url');

function _argsArray(args) {
    return Array.prototype.slice.call(args, 0);
}

function safeCall(optionalThis, func, errorReturnValue) {
    safeCall.error = null;

    if (typeof optionalThis === 'function') {
        errorReturnValue = func;
        func = optionalThis;
        optionalThis = null;
    }

    if (typeof errorReturnValue === 'undefined') {
        errorReturnValue = null;
    }

    try {
        return func.call(optionalThis);
    } catch (e) {
        safeCall.error = e;
        return errorReturnValue;
    }
}

function jsonParse() {
    var args = _argsArray(arguments);
    return safeCall(function () { return JSON.parse.apply(JSON, args); }, null);
}

function jsonStringify() {
    var args = _argsArray(arguments);
    return safeCall(function () { return JSON.stringify.apply(JSON, args); }, null);
}

function openSync() {
    var args = _argsArray(arguments);
    return safeCall(function () { return fs.openSync.apply(fs, args); }, -1);
}

function closeSync() {
    var args = _argsArray(arguments);
    return safeCall(function () { return fs.closeSync.apply(fs, args); }, 0);
}

function readFileSync() {
    var args = _argsArray(arguments);
    return safeCall(function () { return fs.readFileSync.apply(fs, args); }, null);
}

function writeFileSync() {
    var args = _argsArray(arguments);
    return safeCall(function () { return fs.writeFileSync.apply(fs, args); }) !== null;
}

function statSync() {
    var args = _argsArray(arguments);
    return safeCall(function () { return fs.statSync.apply(fs, args); }, null);
}

function readdirSync() {
    var args = _argsArray(arguments);
    return safeCall(function () { return fs.readdirSync.apply(fs, args); }, null);
}

// afaik, this never throws
function existsSync() {
    var args = _argsArray(arguments);
    return safeCall(function () { return fs.existsSync.apply(fs, args); }, false);
}

function mkdirSync() {
    var args = _argsArray(arguments);
    return safeCall(function () { return fs.mkdirSync.apply(fs, args); }) !== null;
}

function unlinkSync() {
    var args = _argsArray(arguments);
    return safeCall(function () { return fs.unlinkSync.apply(fs, args); }) !== null;
}

function renameSync() {
    var args = _argsArray(arguments);
    return safeCall(function () { return fs.renameSync.apply(fs, args); }) !== null;
}

function urlParse() {
    var args = _argsArray(arguments);
    return safeCall(function () { return url.parse.apply(url, args); }, null);
}

function safeRequire() {
    var args = _argsArray(arguments);
    return safeCall(function () { return require.apply(null, args); }, null);
}

function execSync() {
    var args = _argsArray(arguments);
    return safeCall(function () { return child_process.execSync.apply(child_process, args); }, null);
}

// http://stackoverflow.com/questions/6491463
// currently, '.' is assumed to be the separator
function query(o, s, defaultValue) {
    if (!s) return o;

    assert(typeof s === 'string');

    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot

    var a = s.split('.'); // always returns an array
    for (var i = 0; i < a.length; i++) {
        var n = a[i];

        if (!o || typeof o !== 'object' || !(n in o)) return defaultValue;

        o = o[n];
    }
    return o;
}

// TODO: support array format like [0].some.value
function set(o, s, value) {
    if (!s) return o;

    assert(typeof s === 'string');

    if (!o || typeof o !== 'object') o = { };

    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot

    var a = s.split('.'); // always returns an array
    var io = o;
    for (var i = 0; i < a.length - 1; i++) {
        var n = a[i];

        if (!(n in io) || !io[n] || typeof io[n] !== 'object') {
            io[n] = { };
        }

        io = io[n];
    }
    
    io[a[a.length - 1]] = value;

    return o;
}

function unset(o, s) {
    if (!s) return o;

    assert(typeof s === 'string');

    if (!o || typeof o !== 'object') return o;

    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot

    var a = s.split('.'); // always returns an array
    var io = o;
    for (var i = 0; i < a.length - 1; i++) {
        var n = a[i];

        if (!(n in io)) return o;

        if (!io[n] || typeof io[n] !== 'object') {
            delete io[n];
            return o;
        }

        io = io[n];
    }

    delete io[a[a.length - 1]];

    return o;
}

safeCall.safeCall = safeCall; // compat

safeCall.JSON = {
    parse: jsonParse,
    stringify: jsonStringify
};

safeCall.fs = {
    openSync: openSync,
    closeSync: closeSync,
    readFileSync: readFileSync,
    writeFileSync: writeFileSync,
    statSync: statSync,
    existsSync: existsSync,
    mkdirSync: mkdirSync,
    unlinkSync: unlinkSync,
    renameSync: renameSync,
    readdirSync: readdirSync
};

safeCall.child_process = {
    execSync: execSync
};

safeCall.require = safeRequire;

safeCall.url = {
    parse: urlParse
};

safeCall.query = query;
safeCall.set = set;
safeCall.unset = unset;

exports = module.exports = safeCall;

