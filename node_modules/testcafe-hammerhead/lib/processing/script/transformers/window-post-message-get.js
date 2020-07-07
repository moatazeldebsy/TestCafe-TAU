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
// const foo = window.postMessage; foo = window.postMessage; { _postMessage: window.postMessage }; return window.postMessage;
// -->
// const foo = _get$PostMessage(window.postMessage); foo = _get$PostMessage(window.postMessage); { _postMessage: _get$PostMessage(window.postMessage) }; return _get$PostMessage(window.postMessage);
const transformer = {
  nodeReplacementRequireTransform: false,
  nodeTypes: _esotopeHammerhead.Syntax.MemberExpression,
  condition: (node, parent) => {
    if (!parent) return false; // Skip: window.postMessage.field

    if (parent.type === _esotopeHammerhead.Syntax.MemberExpression && (parent.property === node || parent.object === node)) return false; // Skip: window.postMessage()

    if (parent.type === _esotopeHammerhead.Syntax.CallExpression && parent.callee === node) return false; // Skip: window.postMessage = 1, window["postMessage"] = 1

    if (parent.type === _esotopeHammerhead.Syntax.AssignmentExpression && parent.left === node) return false; // Skip already transformed: __get$PostMessage(window.postMessage), __get$PostMessage(window["postMessage"])

    if (parent.type === _esotopeHammerhead.Syntax.CallExpression && parent.callee.type === _esotopeHammerhead.Syntax.Identifier && parent.callee.name === _instruction.default.getPostMessage) return false; // window.postMessage

    if (node.property.type === _esotopeHammerhead.Syntax.Identifier && node.property.name === 'postMessage') return true; // window['postMessage']

    if (node.property.type === _esotopeHammerhead.Syntax.Literal && node.property.value === 'postMessage') return true;
    return false;
  },
  run: _nodeBuilder.createGetPostMessageMethodCall
};
var _default = transformer;
exports.default = _default;
module.exports = exports.default;