"use strict";

exports.__esModule = true;
exports.default = void 0;

var _instruction = _interopRequireDefault(require("../instruction"));

var _nodeBuilder = require("../node-builder");

var _esotopeHammerhead = require("esotope-hammerhead");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// -------------------------------------------------------------
// WARNING: this file is used by both the client and the server.
// Do not use any browser or node-specific API!
// -------------------------------------------------------------

/*eslint-disable no-unused-vars*/

/*eslint-enable no-unused-vars*/
// Transform:
// const foo = postMessage; foo = postMessage; { _postMessage: postMessage }; return postMessage;
// -->
// const foo = _get$PostMessage(postMessage); foo = _get$PostMessage(postMessage); { _postMessage: _get$PostMessage(postMessage) }; return _get$PostMessage(postMessage);
const transformer = {
  nodeReplacementRequireTransform: false,
  nodeTypes: _esotopeHammerhead.Syntax.Identifier,
  condition: (node, parent) => {
    if (node.name !== 'postMessage' || !parent) return false; // Skip: window.postMessage, postMessage.call

    if (parent.type === _esotopeHammerhead.Syntax.MemberExpression) return false; // Skip: class X { postMessage () {} }

    if (parent.type === _esotopeHammerhead.Syntax.MethodDefinition) return false; // Skip: class postMessage { x () {} }

    if (parent.type === _esotopeHammerhead.Syntax.ClassDeclaration) return false; // Skip: function postMessage () { ... }

    if ((parent.type === _esotopeHammerhead.Syntax.FunctionExpression || parent.type === _esotopeHammerhead.Syntax.FunctionDeclaration) && parent.id === node) return false; // Skip: function (postMessage) { ... } || function func(postMessage) { ... } || postMessage => { ... }

    if ((parent.type === _esotopeHammerhead.Syntax.FunctionExpression || parent.type === _esotopeHammerhead.Syntax.FunctionDeclaration || parent.type === _esotopeHammerhead.Syntax.ArrowFunctionExpression) && parent.params.indexOf(node) !== -1) return false; // Skip: { postMessage: value }

    if (parent.type === _esotopeHammerhead.Syntax.Property && parent.key === node) return false; // Skip: postMessage = value || function x (postMessage = value) { ... }

    if ((parent.type === _esotopeHammerhead.Syntax.AssignmentExpression || parent.type === _esotopeHammerhead.Syntax.AssignmentPattern) && parent.left === node) return false; // Skip: const postMessage = value;

    if (parent.type === _esotopeHammerhead.Syntax.VariableDeclarator && parent.id === node) return false; // Skip: postMessage++ || postMessage-- || ++postMessage || --postMessage

    if (parent.type === _esotopeHammerhead.Syntax.UpdateExpression && (parent.operator === '++' || parent.operator === '--')) return false; // Skip already transformed: __get$PostMessage(postMessage) || __call$(obj, postMessage, args...);

    if (parent.type === _esotopeHammerhead.Syntax.CallExpression && parent.callee.type === _esotopeHammerhead.Syntax.Identifier && (parent.callee.name === _instruction.default.getPostMessage || parent.callee.name === _instruction.default.callMethod && parent.arguments[1] === node)) return false; // Skip: function x (...postMessage) {}

    if (parent.type === _esotopeHammerhead.Syntax.RestElement) return false; // Skip: export { postMessage } from "module";

    if (parent.type === _esotopeHammerhead.Syntax.ExportSpecifier) return false; // Skip: import { postMessage } from "module";

    if (parent.type === _esotopeHammerhead.Syntax.ImportSpecifier) return false;
    return true;
  },
  run: _nodeBuilder.createGetPostMessageMethodCall
};
var _default = transformer;
exports.default = _default;
module.exports = exports.default;