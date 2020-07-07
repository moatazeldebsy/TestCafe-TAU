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
// var { location: loc } = window,
//     [{ location }, item] = [window, 6]
// -->
// var _hh$temp0 = window,
//     loc = _hh$temp0.location,
//     _hh$temp1 = [window, 6],
//     _hh$temp1$0 = _hh$temp1[0],
//     location = _hh$temp1$0.location,
//     item = _hh$temp1[1];
const transformer = {
  nodeReplacementRequireTransform: true,
  nodeTypes: _esotopeHammerhead.Syntax.VariableDeclaration,
  // @ts-ignore
  condition: (node, parent) => {
    // Skip: for (let { x } in some);
    if (parent.type === _esotopeHammerhead.Syntax.ForInStatement) return false;

    for (const declarator of node.declarations) {
      if (declarator.id.type === _esotopeHammerhead.Syntax.ObjectPattern || declarator.id.type === _esotopeHammerhead.Syntax.ArrayPattern) return true;
    }

    return false;
  },
  run: node => {
    const declarations = [];

    for (const declarator of node.declarations) {
      (0, _destructuring.default)(declarator.id, declarator.init, (pattern, value) => declarations.push((0, _nodeBuilder.createVariableDeclarator)(pattern, value)));
    }

    return (0, _nodeBuilder.createVariableDeclaration)(node.kind, declarations);
  }
};
var _default = transformer;
exports.default = _default;
module.exports = exports.default;