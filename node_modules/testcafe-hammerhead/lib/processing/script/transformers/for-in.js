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

/*eslint-disable no-unused-vars*/

/*eslint-enable no-unused-vars*/
// Transform:
// for(obj[prop] in src), for(obj.prop in src) -->
// for(const _hh$temp0 in src) { obj[prop] = _hh$temp0; }
const transformer = {
  nodeReplacementRequireTransform: false,
  nodeTypes: _esotopeHammerhead.Syntax.ForInStatement,
  condition: node => node.left.type === _esotopeHammerhead.Syntax.MemberExpression,
  run: node => {
    const tempVarAst = (0, _nodeBuilder.createIdentifier)(_tempVariables.default.generateName());
    const varDeclaration = (0, _nodeBuilder.createVariableDeclaration)('var', [(0, _nodeBuilder.createVariableDeclarator)(tempVarAst)]);
    const assignmentExprStmt = (0, _nodeBuilder.createAssignmentExprStmt)(node.left, tempVarAst);
    if (node.body.type !== _esotopeHammerhead.Syntax.BlockStatement) (0, _replaceNode.default)(node.body, (0, _nodeBuilder.createBlockStatement)([assignmentExprStmt, node.body]), node, 'body');else (0, _replaceNode.default)(null, assignmentExprStmt, node.body, 'body');
    (0, _replaceNode.default)(node.left, varDeclaration, node, 'left');
    return null;
  }
};
var _default = transformer;
exports.default = _default;
module.exports = exports.default;