"use strict";

exports.__esModule = true;
exports.default = void 0;

var _nodeBuilder = require("../node-builder");

var _esotopeHammerhead = require("esotope-hammerhead");

// -------------------------------------------------------------
// WARNING: this file is used by both the client and the server.
// Do not use any browser or node-specific API!
// -------------------------------------------------------------

/*eslint-disable no-unused-vars*/

/*eslint-enable no-unused-vars*/
// Transform:
// location = value -->
// (function(){ return __set$Loc(location, value) || location = value;}.apply(this))
const transformer = {
  nodeReplacementRequireTransform: false,
  nodeTypes: _esotopeHammerhead.Syntax.AssignmentExpression,
  condition: node => node.operator === '=' && node.left.type === _esotopeHammerhead.Syntax.Identifier && node.left.name === 'location',
  run: (node, parent, key) => {
    if (!parent) return null;
    const wrapWithSequence = key !== 'arguments' && key !== 'consequent' && key !== 'alternate' && ( // @ts-ignore
    parent.type !== _esotopeHammerhead.Syntax.SequenceExpression || parent.expressions[0] === node);
    return (0, _nodeBuilder.createLocationSetWrapper)(node.left, node.right, wrapWithSequence);
  }
};
var _default = transformer;
exports.default = _default;
module.exports = exports.default;