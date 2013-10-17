Safety Dance node module
=======================

If you are annoyed with JavaScript functions throwing exceptions and
using exceptions as multi-value return statements, this module is for you.

This module catches any exception and returns null instead for all the
sync functions in node.js. If you want access to the exception, use the
error property (just like errno).

Installation
------------
npm install safetydance

Usage
-----
var safe = require('safetydance');
var json = safe.JSON.parse('This is totally { not json }');
console.log(json); // will be null
console.log(safe.error); // will contain SyntaxError

json = safe.JSON.parse('{ "totally" : "json" }');
console.log(json); // { totally: "json" }
console.log(safe.error); // will be null

