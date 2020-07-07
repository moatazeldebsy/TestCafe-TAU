"use strict";

exports.__esModule = true;
exports.default = void 0;

var _nodeBuilder = require("../node-builder");

var _esotopeHammerhead = require("esotope-hammerhead");

var _instrumented = require("../instrumented");

// -------------------------------------------------------------
// WARNING: this file is used by both the client and the server.
// Do not use any browser or node-specific API!
// -------------------------------------------------------------

/*eslint-disable no-unused-vars*/

/*eslint-enable no-unused-vars*/
// Transform:
// obj.method(args...); obj[method](args...); -->
// _call$(obj, 'method', args...); _call$(obj, method, args...);
const transformer = {
  nodeReplacementRequireTransform: true,
  nodeTypes: _esotopeHammerhead.Syntax.CallExpression,
  condition: node => {
    const callee = node.callee;

    if (callee.type === _esotopeHammerhead.Syntax.MemberExpression) {
      // Skip: super.meth()
      if (callee.object.type === _esotopeHammerhead.Syntax.Super) return false;
      if (callee.computed) return callee.property.type === _esotopeHammerhead.Syntax.Literal ? (0, _instrumented.shouldInstrumentMethod)(callee.property.value) : true;
      return callee.property.type === _esotopeHammerhead.Syntax.Identifier && (0, _instrumented.shouldInstrumentMethod)(callee.property.name);
    }

    return false;
  },
  run: node => {
    const callee = node.callee;
    const method = callee.computed ? callee.property : (0, _nodeBuilder.createSimpleLiteral)(callee.property.name); // eslint-disable-line no-extra-parens

    return (0, _nodeBuilder.createMethodCallWrapper)(callee.object, method, node.arguments);
  }
};
var _default = transformer;
exports.default = _default;
module.exports = exports.default;