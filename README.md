Safety Dance
============

This node.js module provides you exception safety. That is to say that
the functions of this module never ever throw.

If you are annoyed with node.js built-in API throwing exceptions and
using exceptions as multi-value return statements, this module is for you.

This module catches any exception and returns null instead for all the
sync functions in node.js. If you want access to the exception, use the
error property (just like errno).

Installation
------------
npm install safetydance

Usage
-----
You can call arbitrary functions without having to worry about exceptions.
```
var safeCall = require('safetydance').safeCall;
var result = safeCall(function () { return 1 + 2; }); // will return 3
result = safeCall(function () { throw new Error('bad'); }); // will return null
```

You can pass the 'this' as the first argument.
```
var obj = { a: 10 };
var result = safeCall(obj, function () { return obj.a; }); // will return 10
```

This module provide conveniences for commonly used functions.
```
var safe = require('safetydance');
var json = safe.JSON.parse('This is totally { not json }');
console.log(json); // will be null
console.log(safe.error); // will contain SyntaxError
```

The error gets cleared for successful operations.
```
json = safe.JSON.parse('{ "totally" : "json" }');
console.log(json); // { totally: "json" }
console.log(safe.error); // will be null
```

API
---
* safeCall(optionalThis, functionToCall)
* error - the error of the last function call
* Convenience (refer to node.js docs for details)
  * JSON.parse
  * JSON.stringify
  * fs.readFileSync
  * fs.writeFileSync
  * fs.statSync
  * fs.existsSync

