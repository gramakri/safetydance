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
        existsSync: existsSync
    }
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

function _argsArray(args) {
    return Array.prototype.slice.call(args, 0);
}

function jsonParse() {
    var args = _argsArray(arguments);
    return safeCall(null, function () { return JSON.parse.apply(null, args); });
}

function jsonStringify() {
    var args = _argsArray(arguments);
    return safeCall(null, function () { return JSON.stringify.apply(null, args); });
}

function readFileSync() {
    var args = _argsArray(arguments);
    return safeCall(null, function () { return fs.readFileSync(null, args); });
}

function writeFileSync() {
    var args = _argsArray(arguments);
    return safeCall(null, function () { return fs.writeFileSync(null, args); });
}

function statSync() {
    var args = _argsArray(arguments);
    return safeCall(null, function () { return fs.statSync(null, args); });
}

function existsSync() {
    var args = _argsArray(arguments);
    return safeCall(null, function () { return fs.existsSync(null, args); });
}

