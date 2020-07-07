"use strict";

exports.__esModule = true;
exports.default = void 0;

var _nodeBuilder = require("../node-builder");

var _esotopeHammerhead = require("esotope-hammerhead");

var _destructuring = _interopRequireDefault(require("../destructuring"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// -------------------------------------------------------------
// WARNING: this file is used by both the client and the server.
// Do not use any browser or node-specific API!
// -------------------------------------------------------------
// Transform:
// ({ location: loc } = window);
// [{ location }, item] = [window, 6]
// -->
// var _hh$temp0, _hh$temp1, _hh$temp1$0;
//
// _hh$temp0 = window, loc = _hh$temp0.location;
// _hh$temp1 = [window, 6], _hh$temp1$0 = _hh$temp1[0], location = _hh$temp1$0.location, item = _hh$temp1[1];
const transformer = {
  nodeReplacementRequireTransform: true,
  nodeTypes: _esotopeHammerhead.Syntax.AssignmentExpression,
  condition: node => node.operator === '=' && (node.left.type === _esotopeHammerhead.Syntax.ObjectPattern || node.left.type === _esotopeHammerhead.Syntax.ArrayPattern),
  run: (node, _parent, _key, tempVars) => {
    const assignments = [];
    (0, _destructuring.default)(node.left, node.right, (pattern, value, isTemp) => {
      assignments.push((0, _nodeBuilder.createAssignmentExpression)(pattern, '=', value));
      if (isTemp) tempVars.append(pattern.name);
    });
    return (0, _nodeBuilder.createSequenceExpression)(assignments);
  }
};
var _default = transformer;
exports.default = _default;
module.exports = exports.default;