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
// val1 += val2
// --> val1 = val1 + val2
const transformer = {
  nodeReplacementRequireTransform: true,
  nodeTypes: _esotopeHammerhead.Syntax.AssignmentExpression,
  condition: node => {
    if (node.operator !== '+=') return false;
    const left = node.left; // location

    if (left.type === _esotopeHammerhead.Syntax.Identifier) return (0, _instrumented.shouldInstrumentProperty)(left.name);

    if (left.type === _esotopeHammerhead.Syntax.MemberExpression) {
      // something['location'] or something[propname]
      if (left.computed) return left.property.type === _esotopeHammerhead.Syntax.Literal ? (0, _instrumented.shouldInstrumentProperty)(left.property.value) : left.property.type !== _esotopeHammerhead.Syntax.UpdateExpression; // something.location
      else if (left.property.type === _esotopeHammerhead.Syntax.Identifier) return (0, _instrumented.shouldInstrumentProperty)(left.property.name);
    }

    return false;
  },
  run: node => (0, _nodeBuilder.createExpandedConcatOperation)(node.left, node.right)
};
var _default = transformer;
exports.default = _default;
module.exports = exports.default;