var fs = require('fs');

exports = module.exports = {
    safeCall: safeCall, // this is the main API, the rest are all convenience
    error: null, // the last error

    JSON: {
        parse: jsonParse,
        stringify: jsonStringify
    },
    fs: {
        openSync: openSync,
        closeSync: closeSync,
        readFileSync: readFileSync,
        writeFileSync: writeFileSync,
        statSync: statSync,
        existsSync: existsSync,
        mkdirSync: mkdirSync,
        unlinkSync: unlinkSync
    }
}

function _argsArray(args) {
    return Array.prototype.slice.call(args, 0);
}

function safeCall(optionalThis, func, errorReturnValue) {
    exports.error = null;

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
        exports.error = e;
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

