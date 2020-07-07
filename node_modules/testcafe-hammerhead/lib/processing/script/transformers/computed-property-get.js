"use strict";

exports.__esModule = true;
exports.default = void 0;

var _nodeBuilder = require("../node-builder");

var _esotopeHammerhead = require("esotope-hammerhead");

var _instrumented = require("../instrumented");

// -------------------------------------------------------------
// WARNING: this file is used by both the client and the server.
// Do not use any browser or node-specific API!
// -------------------------------------------------------------

/*eslint-disable no-unused-vars*/

/*eslint-enable no-unused-vars*/
// Transform:
// obj[prop] -->
// __get$(obj, prop)
const transformer = {
  nodeReplacementRequireTransform: true,
  nodeTypes: _esotopeHammerhead.Syntax.MemberExpression,
  condition: (node, parent) => {
    if (!node.computed || !parent) return false;
    if (node.property.type === _esotopeHammerhead.Syntax.Literal && !(0, _instrumented.shouldInstrumentProperty)(node.property.value)) return false; // super[prop]

    if (node.object.type === _esotopeHammerhead.Syntax.Super) return false; // object[prop] = value

    if (parent.type === _esotopeHammerhead.Syntax.AssignmentExpression && parent.left === node) return false; // delete object[prop]

    if (parent.type === _esotopeHammerhead.Syntax.UnaryExpression && parent.operator === 'delete') return false; // object[prop]++ || object[prop]-- || ++object[prop] || --object[prop]

    if (parent.type === _esotopeHammerhead.Syntax.UpdateExpression && (parent.operator === '++' || parent.operator === '--')) return false; // object[prop]()

    if (parent.type === _esotopeHammerhead.Syntax.CallExpression && parent.callee === node) return false; // new (object[prop])() || new (object[prop])

    if (parent.type === _esotopeHammerhead.Syntax.NewExpression && parent.callee === node) return false; // for(object[prop] in source)

    if (parent.type === _esotopeHammerhead.Syntax.ForInStatement && parent.left === node) return false;
    return true;
  },
  run: node => (0, _nodeBuilder.createComputedPropertyGetWrapper)(node.property, node.object)
};
var _default = transformer;
exports.default = _default;
module.exports = exports.default;