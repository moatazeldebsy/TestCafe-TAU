"use strict";

exports.__esModule = true;
exports.shouldInstrumentMethod = shouldInstrumentMethod;
exports.shouldInstrumentProperty = shouldInstrumentProperty;
exports.PROPERTIES = exports.METHODS = void 0;
// -------------------------------------------------------------
// WARNING: this file is used by both the client and the server.
// Do not use any browser or node-specific API!
// -------------------------------------------------------------
// NOTE: constants are exported for the testing purposes
const METHODS = ['postMessage', 'replace', 'assign'];
exports.METHODS = METHODS;
const PROPERTIES = ['href', 'location'];
exports.PROPERTIES = PROPERTIES;
const INSTRUMENTED_METHOD_RE = new RegExp(`^(${METHODS.join('|')})$`);
const INSTRUMENTED_PROPERTY_RE = new RegExp(`^(${PROPERTIES.join('|')})$`); // NOTE: Mootools framework contains code that removes the RegExp.prototype.test
// method and restores it later.
//    delete z[A]; // z = RegExp.prototype, A = "test"
//    __set$(z, A, x.protect()); // x.protect - returns the removed method
// The __set$ function calls the test method of the regular expression. (GH-331)

const reTest = RegExp.prototype.test; // NOTE: The Function.prototype.call method can also be removed.
// But only one of the methods can be removed at a time.

const test = (regexp, str) => regexp.test ? regexp.test(str) : reTest.call(regexp, str); // NOTE: we can't use the map approach here, because
// cases like `WRAPPABLE_METHOD['toString']` will fail.
// We could use the hasOwnProperty test, but it is
// significantly slower than the regular expression test


function shouldInstrumentMethod(name) {
  return test(INSTRUMENTED_METHOD_RE, String(name));
}

function shouldInstrumentProperty(name) {
  return test(INSTRUMENTED_PROPERTY_RE, String(name));
}