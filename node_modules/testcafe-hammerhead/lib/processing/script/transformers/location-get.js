"use strict";

exports.__esModule = true;
exports.default = void 0;

var _nodeBuilder = require("../node-builder");

var _instruction = _interopRequireDefault(require("../instruction"));

var _esotopeHammerhead = require("esotope-hammerhead");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// -------------------------------------------------------------
// WARNING: this file is used by both the client and the server.
// Do not use any browser or node-specific API!
// -------------------------------------------------------------

/*eslint-disable no-unused-vars*/

/*eslint-enable no-unused-vars*/
// Transform:
// location -->
// __get$Loc(location)
const transformer = {
  nodeReplacementRequireTransform: false,
  nodeTypes: _esotopeHammerhead.Syntax.Identifier,
  condition: (node, parent) => {
    if (node.name !== 'location' || !parent) return false; // Skip: const location = value;

    if (parent.type === _esotopeHammerhead.Syntax.VariableDeclarator && parent.id === node) return false; // Skip: location = value || function x (location = value) { ... }

    if ((parent.type === _esotopeHammerhead.Syntax.AssignmentExpression || parent.type === _esotopeHammerhead.Syntax.AssignmentPattern) && parent.left === node) return false; // Skip: function location() {}

    if ((parent.type === _esotopeHammerhead.Syntax.FunctionExpression || parent.type === _esotopeHammerhead.Syntax.FunctionDeclaration) && parent.id === node) return false; // Skip: object.location || location.field

    if (parent.type === _esotopeHammerhead.Syntax.MemberExpression && parent.property === node) return false; // Skip: { location: value }

    if (parent.type === _esotopeHammerhead.Syntax.Property && parent.key === node) return false; // Skip: location++ || location-- || ++location || --location

    if (parent.type === _esotopeHammerhead.Syntax.UpdateExpression && (parent.operator === '++' || parent.operator === '--')) return false; // Skip: function (location) { ... } || function func(location) { ... } || location => { ... }

    if ((parent.type === _esotopeHammerhead.Syntax.FunctionExpression || parent.type === _esotopeHammerhead.Syntax.FunctionDeclaration || parent.type === _esotopeHammerhead.Syntax.ArrowFunctionExpression) && parent.params.indexOf(node) !== -1) return false; // Skip already transformed: __get$Loc(location)

    if (parent.type === _esotopeHammerhead.Syntax.CallExpression && parent.callee.type === _esotopeHammerhead.Syntax.Identifier && parent.callee.name === _instruction.default.getLocation) return false; // Skip: class X { location () {} }

    if (parent.type === _esotopeHammerhead.Syntax.MethodDefinition) return false; // Skip: class location { x () {} }

    if (parent.type === _esotopeHammerhead.Syntax.ClassDeclaration) return false; // Skip: function x (...location) {}

    if (parent.type === _esotopeHammerhead.Syntax.RestElement) return false; // Skip: export { location } from "module";

    if (parent.type === _esotopeHammerhead.Syntax.ExportSpecifier) return false; // Skip: import { location } from "module";

    if (parent.type === _esotopeHammerhead.Syntax.ImportSpecifier) return false;
    return true;
  },
  run: _nodeBuilder.createLocationGetWrapper
};
var _default = transformer;
exports.default = _default;
module.exports = exports.default;