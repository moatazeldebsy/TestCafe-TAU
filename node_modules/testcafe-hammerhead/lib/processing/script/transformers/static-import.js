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
// import something from 'url';   -->   import something from 'processed-url';
// export * from 'url';   -->   export * from 'processed-url';
// export { x as y } from 'url';   -->   export { x as y } from 'processed-url';
const transformer = {
  nodeReplacementRequireTransform: false,
  nodeTypes: _esotopeHammerhead.Syntax.Literal,
  condition: (node, parent) => !!parent && (parent.type === _esotopeHammerhead.Syntax.ImportDeclaration || parent.type === _esotopeHammerhead.Syntax.ExportAllDeclaration || parent.type === _esotopeHammerhead.Syntax.ExportNamedDeclaration) && parent.source === node,
  run: node => transformer.resolver ? (0, _nodeBuilder.getProxyUrlLiteral)(node, transformer.resolver) : null
};
var _default = transformer;
exports.default = _default;
module.exports = exports.default;