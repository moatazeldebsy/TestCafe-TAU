"use strict";

exports.__esModule = true;
exports.createIdentifier = createIdentifier;
exports.createExpressionStatement = createExpressionStatement;
exports.createAssignmentExpression = createAssignmentExpression;
exports.createSimpleCallExpression = createSimpleCallExpression;
exports.createArrayExpression = createArrayExpression;
exports.createMemberExpression = createMemberExpression;
exports.createBinaryExpression = createBinaryExpression;
exports.createSequenceExpression = createSequenceExpression;
exports.createReturnStatement = createReturnStatement;
exports.createUndefined = createUndefined;
exports.createConditionalExpression = createConditionalExpression;
exports.createSimpleLiteral = createSimpleLiteral;
exports.createAssignmentExprStmt = createAssignmentExprStmt;
exports.createBlockStatement = createBlockStatement;
exports.createVariableDeclarator = createVariableDeclarator;
exports.createVariableDeclaration = createVariableDeclaration;
exports.createProcessScriptMethodCall = createProcessScriptMethodCall;
exports.createLocationGetWrapper = createLocationGetWrapper;
exports.createLocationSetWrapper = createLocationSetWrapper;
exports.createPropertySetWrapper = createPropertySetWrapper;
exports.createMethodCallWrapper = createMethodCallWrapper;
exports.createPropertyGetWrapper = createPropertyGetWrapper;
exports.createComputedPropertyGetWrapper = createComputedPropertyGetWrapper;
exports.createComputedPropertySetWrapper = createComputedPropertySetWrapper;
exports.createGetEvalMethodCall = createGetEvalMethodCall;
exports.getProxyUrlLiteral = getProxyUrlLiteral;
exports.createGetProxyUrlMethodCall = createGetProxyUrlMethodCall;
exports.createGetPostMessageMethodCall = createGetPostMessageMethodCall;
exports.createExpandedConcatOperation = createExpandedConcatOperation;
exports.createHtmlProcessorWrapper = createHtmlProcessorWrapper;
exports.createTempVarsDeclaration = createTempVarsDeclaration;

var _esotopeHammerhead = require("esotope-hammerhead");

var _instruction = _interopRequireDefault(require("./instruction"));

var _url = require("../../utils/url");

var _tempVariables = _interopRequireDefault(require("./transformers/temp-variables"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// -------------------------------------------------------------
// WARNING: this file is used by both the client and the server.
// Do not use any browser or node-specific API!
// -------------------------------------------------------------
function createIdentifier(name) {
  return {
    type: _esotopeHammerhead.Syntax.Identifier,
    name
  };
}

function createExpressionStatement(expression) {
  return {
    type: _esotopeHammerhead.Syntax.ExpressionStatement,
    expression
  };
}

function createAssignmentExpression(left, operator, right) {
  return {
    type: _esotopeHammerhead.Syntax.AssignmentExpression,
    operator,
    left,
    right
  };
}

function createSimpleCallExpression(callee, args) {
  return {
    type: _esotopeHammerhead.Syntax.CallExpression,
    callee,
    arguments: args
  };
}

function createArrayExpression(elements) {
  return {
    type: _esotopeHammerhead.Syntax.ArrayExpression,
    elements
  };
}

function createMemberExpression(object, property, computed) {
  return {
    type: _esotopeHammerhead.Syntax.MemberExpression,
    object,
    property,
    computed
  };
}

function createBinaryExpression(left, operator, right) {
  return {
    type: _esotopeHammerhead.Syntax.BinaryExpression,
    left,
    right,
    operator
  };
}

function createSequenceExpression(expressions) {
  return {
    type: _esotopeHammerhead.Syntax.SequenceExpression,
    expressions
  };
}

function createThisExpression() {
  return {
    type: _esotopeHammerhead.Syntax.ThisExpression
  };
}

function createLogicalExpression(left, operator, right) {
  return {
    type: _esotopeHammerhead.Syntax.LogicalExpression,
    left,
    right,
    operator
  };
}

function createReturnStatement(argument = null) {
  return {
    type: _esotopeHammerhead.Syntax.ReturnStatement,
    argument
  };
}

function createFunctionExpression(id, params, body, async = false, generator = false) {
  return {
    type: _esotopeHammerhead.Syntax.FunctionExpression,
    id,
    params,
    body,
    async,
    generator
  };
}

function createUnaryExpression(operator, argument) {
  return {
    type: _esotopeHammerhead.Syntax.UnaryExpression,
    operator,
    prefix: true,
    argument
  };
}

function createUndefined() {
  return createUnaryExpression('void', createSimpleLiteral(0));
}

function createConditionalExpression(test, consequent, alternate) {
  return {
    type: _esotopeHammerhead.Syntax.ConditionalExpression,
    test,
    consequent,
    alternate
  };
}

function createSimpleLiteral(value) {
  return {
    type: _esotopeHammerhead.Syntax.Literal,
    value
  };
}

function createAssignmentExprStmt(left, right) {
  return createExpressionStatement(createAssignmentExpression(left, '=', right));
}

function createBlockStatement(body) {
  return {
    type: _esotopeHammerhead.Syntax.BlockStatement,
    body
  };
}

function createVariableDeclarator(id, init = null) {
  return {
    type: _esotopeHammerhead.Syntax.VariableDeclarator,
    id,
    init
  };
}

function createVariableDeclaration(kind, declarations) {
  return {
    type: _esotopeHammerhead.Syntax.VariableDeclaration,
    declarations,
    kind
  };
}

function createProcessScriptMethodCall(arg, isApply) {
  const args = [arg];
  const processScriptIdentifier = createIdentifier(_instruction.default.processScript);
  if (isApply) args.push(createSimpleLiteral(true));
  return createSimpleCallExpression(processScriptIdentifier, args);
}

function createLocationGetWrapper(location) {
  const getLocationIdentifier = createIdentifier(_instruction.default.getLocation);
  return createSimpleCallExpression(getLocationIdentifier, [location]);
}

function createLocationSetWrapper(locationIdentifier, value, wrapWithSequence) {
  const tempIdentifier = createIdentifier(_tempVariables.default.generateName());
  const setLocationIdentifier = createIdentifier(_instruction.default.setLocation);
  const setLocationCall = createSimpleCallExpression(setLocationIdentifier, [locationIdentifier, tempIdentifier]);
  const locationAssignment = createAssignmentExpression(locationIdentifier, '=', tempIdentifier);
  const callIdentifier = createIdentifier('call');
  const functionWrapper = createFunctionExpression(null, [], createBlockStatement([createVariableDeclaration('var', [createVariableDeclarator(tempIdentifier, value)]), createReturnStatement(createLogicalExpression(setLocationCall, '||', locationAssignment))]));
  const functionWrapperCallMember = createMemberExpression(functionWrapper, callIdentifier, false);
  const functionWrapperCall = createSimpleCallExpression(functionWrapperCallMember, [createThisExpression()]);
  if (wrapWithSequence) return createSequenceExpression([createSimpleLiteral(0), functionWrapperCall]);
  return functionWrapperCall;
}

function createPropertySetWrapper(propertyName, obj, value) {
  const setPropertyIdentifier = createIdentifier(_instruction.default.setProperty);
  return createSimpleCallExpression(setPropertyIdentifier, [obj, createSimpleLiteral(propertyName), value]);
}

function createMethodCallWrapper(owner, method, args) {
  const callMethodIdentifier = createIdentifier(_instruction.default.callMethod);
  const methodArgsArray = createArrayExpression(args);
  return createSimpleCallExpression(callMethodIdentifier, [owner, method, methodArgsArray]);
}

function createPropertyGetWrapper(propertyName, owner) {
  const getPropertyIdentifier = createIdentifier(_instruction.default.getProperty);
  return createSimpleCallExpression(getPropertyIdentifier, [owner, createSimpleLiteral(propertyName)]);
}

function createComputedPropertyGetWrapper(property, owner) {
  const getPropertyIdentifier = createIdentifier(_instruction.default.getProperty);
  return createSimpleCallExpression(getPropertyIdentifier, [owner, property]);
}

function createComputedPropertySetWrapper(property, owner, value) {
  const setPropertyIdentifier = createIdentifier(_instruction.default.setProperty);
  return createSimpleCallExpression(setPropertyIdentifier, [owner, property, value]);
}

function createGetEvalMethodCall(node) {
  const getEvalIdentifier = createIdentifier(_instruction.default.getEval);
  return createSimpleCallExpression(getEvalIdentifier, [node]);
}

function getProxyUrlLiteral(source, resolver) {
  const proxyUrl = resolver(String(source.value), (0, _url.getResourceTypeString)({
    isScript: true
  }));
  return createSimpleLiteral(proxyUrl);
}

function createGetProxyUrlMethodCall(arg, baseUrl) {
  const getProxyUrlIdentifier = createIdentifier(_instruction.default.getProxyUrl);
  const args = [arg];
  if (baseUrl) args.push(createSimpleLiteral(baseUrl));
  return createSimpleCallExpression(getProxyUrlIdentifier, args);
}

function createGetPostMessageMethodCall(node) {
  const getPostMessageIdentifier = createIdentifier(_instruction.default.getPostMessage);
  const args = node.type === _esotopeHammerhead.Syntax.MemberExpression ? [node.object] : [createSimpleLiteral(null), node];
  return createSimpleCallExpression(getPostMessageIdentifier, args);
}

function createExpandedConcatOperation(left, right) {
  return createAssignmentExpression(left, '=', createBinaryExpression(left, '+', right));
}

function createHtmlProcessorWrapper(node) {
  const processHtmlIdentifier = createIdentifier(_instruction.default.processHtml);
  const parentIdentifier = createIdentifier('parent');
  const windowIdentifier = createIdentifier('window');
  const processHtmlThroughParent = createMemberExpression(parentIdentifier, processHtmlIdentifier, false);
  const processHtmlCall = createSimpleCallExpression(processHtmlThroughParent, [windowIdentifier, node.expression]);
  return createExpressionStatement(processHtmlCall);
}

function createTempVarsDeclaration(tempVars) {
  const declarations = [];

  for (const variable of tempVars) declarations.push(createVariableDeclarator(createIdentifier(variable)));

  return createVariableDeclaration('var', declarations);
}