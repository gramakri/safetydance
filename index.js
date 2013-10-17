var fs = require('fs');

exports = module.exports = {
    JSON: {
        parse: jsonParse,
        stringify: jsonStringify
    },
    fs: {
        readFileSync: readFileSync,
        writeFileSync: writeFileSync
    },
    error: null
}

function jsonParse() {
    exports.error = null;

    try {
        return JSON.parse.apply(null, Array.prototype.slice.call(arguments, 0));
    } catch (e) {
        exports.error = e;
        return null;
    }
}

function jsonStringify() {
    exports.error = null;

    try {
        return JSON.stringify.apply(null, Array.prototype.slice.call(arguments, 0));
    } catch (e) {
        exports.error = e;
        return null;
    }
}

function readFileSync() {
    exports.error = null;

   try {
        return fs.readFileSync.apply(null, Array.prototype.slice.call(arguments, 0));
    } catch (e) {
        exports.error = e;
        return null;
    }
}

function writeFileSync() {
    exports.error = null;

    try {
        return fs.writeFileSync.apply(null, Array.prototype.slice.call(arguments, 0));
    } catch (e) {
        exports.error = e;
        return null;
    }
}

