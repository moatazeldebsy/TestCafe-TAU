"use strict";

exports.__esModule = true;
exports.default = void 0;

var _esotopeHammerhead = require("esotope-hammerhead");

var _nodeBuilder = require("../node-builder");

var _replaceNode = _interopRequireDefault(require("./replace-node"));

var _tempVariables = _interopRequireDefault(require("./temp-variables"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// -------------------------------------------------------------
// WARNING: this file is used by both the client and the server.
// Do not use any browser or node-specific API!
// -------------------------------------------------------------
// Transform:
// for (let {href, postMessage} of wins) {} -->
// for (let _hh$temp0 of wins) { let {href, postMessage} = _hh$temp0; }
const transformer = {
  nodeReplacementRequireTransform: false,
  nodeTypes: _esotopeHammerhead.Syntax.ForOfStatement,
  condition: node => {
    let left = node.left;
    if (left.type === _esotopeHammerhead.Syntax.VariableDeclaration) left = left.declarations[0].id;
    return left.type === _esotopeHammerhead.Syntax.ObjectPattern || left.type === _esotopeHammerhead.Syntax.ArrayPattern;
  },
  run: node => {
    const tempIdentifier = (0, _nodeBuilder.createIdentifier)(_tempVariables.default.generateName());
    const forOfLeft = node.left;
    let statementWithTempAssignment;

    if (forOfLeft.type === _esotopeHammerhead.Syntax.VariableDeclaration) {
      statementWithTempAssignment = (0, _nodeBuilder.createVariableDeclaration)(forOfLeft.kind, [(0, _nodeBuilder.createVariableDeclarator)(forOfLeft.declarations[0].id, tempIdentifier)]);
      statementWithTempAssignment.reTransform = true;
      (0, _replaceNode.default)(forOfLeft.declarations[0].id, tempIdentifier, forOfLeft.declarations[0], 'id');
    } else {
      const varDeclaration = (0, _nodeBuilder.createVariableDeclaration)('var', [(0, _nodeBuilder.createVariableDeclarator)(tempIdentifier)]);
      statementWithTempAssignment = (0, _nodeBuilder.createAssignmentExprStmt)(forOfLeft, tempIdentifier);
      (0, _replaceNode.default)(forOfLeft, varDeclaration, node, 'left');
    }

    if (node.body.type === _esotopeHammerhead.Syntax.BlockStatement) (0, _replaceNode.default)(null, statementWithTempAssignment, node.body, 'body');else (0, _replaceNode.default)(node.body, (0, _nodeBuilder.createBlockStatement)([statementWithTempAssignment, node.body]), node, 'body');
    return null;
  }
};
var _default = transformer;
exports.default = _default;
module.exports = exports.default;