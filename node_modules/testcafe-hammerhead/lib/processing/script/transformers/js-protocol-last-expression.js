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
// x = 5; "hello" --> x = 5; parent.__proc$Html(window, "hello")
// someAction(); generateHtmlPage() --> someAction(); parent.__proc$Html(window, generateHtmlPage())
const transformer = {
  nodeReplacementRequireTransform: true,
  nodeTypes: _esotopeHammerhead.Syntax.ExpressionStatement,
  condition: (node, parent) => !!transformer.wrapLastExpr && !!parent && parent.type === _esotopeHammerhead.Syntax.Program && parent.body[parent.body.length - 1] === node,
  run: node => {
    transformer.wrapLastExpr = false;
    return (0, _nodeBuilder.createHtmlProcessorWrapper)(node);
  }
};
var _default = transformer;
exports.default = _default;
module.exports = exports.default;