/*\
title: $:/plugins/neuroforest/core/tweaks/isDate.js
type: application/javascript
module-type: startup
Fix cross-realm Date detection.
TW5 upstream changed $tw.utils.isDate to use `instanceof Date` which fails
for Date objects created in the vm sandbox context used for module execution.
This restores the cross-realm-safe check using Object.prototype.toString.
\*/
(function() {

"use strict";

exports.name = "fix-isdate";
exports.before = ["story"];
exports.synchronous = true;

exports.startup = function() {
    $tw.utils.isDate = function(value) {
        return Object.prototype.toString.call(value) === "[object Date]";
    };
};

})();
