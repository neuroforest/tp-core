/*\
title: $:/plugins/neuroforest/core/tweaks/katex-mhchem.js
type: application/javascript
module-type: startup

Load the mhchem extension for KaTeX.

TW5 upstream commit 785086e0a removed the require() call for mhchem.min.js
from the KaTeX wrapper as an ESLint "unused variable" fix, but the require
side effect was needed to register \ce and \pu macros with KaTeX.

\*/
(function() {

"use strict";

exports.name = "katex-mhchem";
exports.before = ["render"];
exports.synchronous = true;

exports.startup = function() {
	require("$:/plugins/tiddlywiki/katex/mhchem.min.js");
};

})();
