var fs = require('fs');

exports = module.exports = {
    safeCall: safeCall, // this is the main API, the rest are all convenience
    error: null, // the last error

    JSON: {
        parse: jsonParse,
        stringify: jsonStringify
    },
    fs: {
        readFileSync: readFileSync,
        writeFileSync: writeFileSync,
        statSync: statSync,
        existsSync: existsSync,
        mkdirSync: mkdirSync
    }
}

function _argsArray(args) {
    return Array.prototype.slice.call(args, 0);
}

function safeCall(optionalThis, func) {
    exports.error = null;

    try {
        return (arguments.length === 1) ? optionalThis() : func.call(optionalThis);
    } catch (e) {
        exports.error = e;
        return null;
    }
}

function jsonParse() {
    var args = _argsArray(arguments);
    return safeCall(null, function () { return JSON.parse.apply(JSON, args); });
}

function jsonStringify() {
    var args = _argsArray(arguments);
    return safeCall(null, function () { return JSON.stringify.apply(JSON, args); });
}

function readFileSync() {
    var args = _argsArray(arguments);
    return safeCall(null, function () { return fs.readFileSync.apply(fs, args); });
}

function writeFileSync() {
    var args = _argsArray(arguments);
    return safeCall(null, function () { return fs.writeFileSync.apply(fs, args); });
}

function statSync() {
    var args = _argsArray(arguments);
    return safeCall(null, function () { return fs.statSync.apply(fs, args); });
}

// afaik, this never throws
function existsSync() {
    var args = _argsArray(arguments);
    return safeCall(null, function () { return fs.existsSync.apply(fs, args); });
}

function mkdirSync() {
    var args = _argsArray(arguments);
    return safeCall(null, function () { return fs.mkdirSync.apply(fs, args) }) === undefined; ;
}

