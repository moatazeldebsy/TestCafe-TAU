"use strict";

exports.__esModule = true;
exports.default = process;

var _esotopeHammerhead = require("esotope-hammerhead");

var _nodeBuilder = require("./node-builder");

var _tempVariables = _interopRequireDefault(require("./transformers/temp-variables"));

var _instruction = _interopRequireDefault(require("./instruction"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function processObjectProperty(prop, temp, build, baseTempName) {
  const pattern = prop.value;
  const computed = prop.computed || prop.key.type === _esotopeHammerhead.Syntax.Literal;
  const value = (0, _nodeBuilder.createMemberExpression)(temp, prop.key, computed);
  process(pattern, value, build, baseTempName);
}

function createObjectRest(tempIdentifier, keys) {
  const restObjectIdentifier = (0, _nodeBuilder.createIdentifier)(_instruction.default.restObject);
  return (0, _nodeBuilder.createSimpleCallExpression)(restObjectIdentifier, [tempIdentifier, (0, _nodeBuilder.createArrayExpression)(keys)]);
}

function createRestArray(array, startIndex) {
  const restArrayIdentifier = (0, _nodeBuilder.createIdentifier)(_instruction.default.restArray);
  return (0, _nodeBuilder.createSimpleCallExpression)(restArrayIdentifier, [array, (0, _nodeBuilder.createSimpleLiteral)(startIndex)]);
}

function createTempIdentifierOrUseExisting(value, build, baseTempName) {
  if (value.type === _esotopeHammerhead.Syntax.Identifier && _tempVariables.default.isHHTempVariable(value.name)) return value;
  const tempIdentifier = (0, _nodeBuilder.createIdentifier)(baseTempName || _tempVariables.default.generateName(baseTempName));
  build(tempIdentifier, value, true);
  return tempIdentifier;
}

function processObjectPattern(pattern, value, build, baseTempName) {
  const properties = pattern.properties; // @ts-ignore

  const hasRest = properties.length && properties[properties.length - 1].type === _esotopeHammerhead.Syntax.RestElement;
  const tempIdentifier = createTempIdentifierOrUseExisting(value, build, baseTempName);
  const propNames = [];
  if (!baseTempName) baseTempName = tempIdentifier.name;

  if (hasRest) {
    for (let i = 0; i < properties.length - 1; i++) {
      const prop = properties[i];
      const key = prop.key;
      if (key.type === _esotopeHammerhead.Syntax.Identifier) propNames.push(prop.computed ? key : (0, _nodeBuilder.createSimpleLiteral)(key.name));else if (key.type === _esotopeHammerhead.Syntax.Literal) propNames.push(key);else {
        const tempPropKey = (0, _nodeBuilder.createIdentifier)(_tempVariables.default.generateName());
        build(tempPropKey, key, true);
        propNames.push(tempPropKey);
        prop.key = tempPropKey;
      }
    }
  }

  for (let i = 0; i < properties.length; i++) {
    const prop = properties[i]; // @ts-ignore

    if (prop.type === _esotopeHammerhead.Syntax.RestElement) {
      // @ts-ignore
      build(prop.argument, createObjectRest(tempIdentifier, propNames));
    } else processObjectProperty(prop, tempIdentifier, build, _tempVariables.default.generateName(baseTempName, prop.key, i));
  }
}

function processArrayPattern(pattern, value, build, baseTempName) {
  const tempIdentifier = createTempIdentifierOrUseExisting(value, build, baseTempName);
  if (!baseTempName) baseTempName = tempIdentifier.name;

  for (let i = 0; i < pattern.elements.length; i++) {
    let elem = pattern.elements[i];
    if (!elem) continue;

    if (elem.type === _esotopeHammerhead.Syntax.RestElement) {
      value = createRestArray(tempIdentifier, i);
      elem = elem.argument;
    } else value = (0, _nodeBuilder.createMemberExpression)(tempIdentifier, (0, _nodeBuilder.createSimpleLiteral)(i), true);

    process(elem, value, build, _tempVariables.default.generateName(baseTempName, null, i));
  }
}

function processAssignmentPattern(pattern, value, build, baseTempName) {
  const {
    left,
    right
  } = pattern;
  const tempIdentifier = createTempIdentifierOrUseExisting(value, build, baseTempName);
  const tempCondition = (0, _nodeBuilder.createBinaryExpression)(tempIdentifier, '===', (0, _nodeBuilder.createUndefined)());
  const tempConditional = (0, _nodeBuilder.createConditionalExpression)(tempCondition, right, tempIdentifier);
  if (!baseTempName) baseTempName = tempIdentifier.name;
  baseTempName += '$' + 'assign';
  process(left, tempConditional, build, baseTempName);
}

function process(pattern, value, build, baseTempName) {
  if (pattern.type === _esotopeHammerhead.Syntax.ObjectPattern) processObjectPattern(pattern, value, build, baseTempName);else if (pattern.type === _esotopeHammerhead.Syntax.ArrayPattern) processArrayPattern(pattern, value, build, baseTempName);else if (pattern.type === _esotopeHammerhead.Syntax.AssignmentPattern) processAssignmentPattern(pattern, value, build, baseTempName);else build(pattern, value);
}

module.exports = exports.default;