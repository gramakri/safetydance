Safety Dance
============

This node.js module provides you exception safety. That is to say that
the functions of this module never ever throw.

If you are annoyed with node.js built-in API throwing exceptions and
using exceptions as multi-value return statements, this module is for you.

This module catches any exception in the function you want to call. If there
is no exception, it behaves as always. If there was an exception, it catches
it, makes it available via error property (like errno).

So, instead of:
```
try {
    var result = JSON.parse(something);
} catch (e) {
    ...
}
```

you can write:
```
var result = safe.JSON.parse(something);
if (result === null) { ... }
```

Installation
------------
npm install safetydance

Usage
-----
You can call arbitrary synchronous functions without having to worry about exceptions.
```
var safeCall = require('safetydance');
var result = safeCall(function () { return 1 + 2; }); // will return 3
result = safeCall(function () { throw new Error('bad'); }); // will return null
```

You can pass the 'this' as the first argument.
```
var obj = { a: 10 };
var result = safeCall(obj, function () { return this.a; }); // will return 10
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

safe.query
----------
safe.query can be used to access nested object properties. For example,
the code below can throw an exception if any of the nested objects does
not contain the accesses properties:
```
var capital = data.countries.norway.capital;
```

This can be rewritten as:
```
var capital = safe.query(data, 'countries.norway.capital'); // returns undefined if not found
```

You can also specify a default:
```
var capital = safe.query(data, 'countries.norway.capital', 'oslo'); // return oslo if not found
```

Works for deeply nested properties as well (use [] for array access):
```
var item = safe.query(data, 'key[0][3].some.fancy[45].nested.5.value');
```

Property names with '.' in them are not supported.

safe.set
--------
safe.set is the complement of safe.query.
```
var obj = { };
safe.set(obj, 'some.deep.value', 42);
console.log(obj.some.deep.value); // prints 42
```

If obj is not a valid object, it will create one for you
```
obj = safe.set(null, 'some.deep.value', 42);
console.log(obj.some.deep.value); // prints 42
```

If any of the values in the chain is not an object, it will get replaced.
```
var obj = { some: 43 };
safe.set(obj, 'some.deep.value', 42);
console.log(obj.some.deep.value); // prints 42; some is gone
```

safe.unset
----------
safe.unset unsets properties in objects.
```
var obj = { some: { deep: { value: 42 } } };
safe.unset(obj, 'some.deep.value');
console.log(obj); // prints { some: { deep: { } } }
```


API
---
* safeCall(optionalThis, functionToCall, valueToReturnIfErrored)
* error - the error of the last function call
* Convenience (refer to node.js docs for details)
  * JSON.parse - returns null on error, object on success
  * JSON.stringify - returns null on error, string on success
  * fs.readFileSync - returns null on error, string/buffer on success
  * fs.writeFileSync - returns false on error, true on success
  * fs.statSync - returns null on error, stat object on success
  * fs.existsSync - returns false on error, true/false on success
  * fs.mkdirSync - returns false on error, true on success
  * fs.unlinkSync - returns false on error, true on success
  * fs.renameSync - returns false on error, true on success
  * fs.readdirSync - returns null on error, file array on success
  * url.parse = returns null on error, object on success
  * require - returns null on error, module on success
  * child_process.execSync - returns null on error, stdio on success

