"use strict";

exports.__esModule = true;
exports.default = createShadowStylesheet;

var _css = _interopRequireDefault(require("css"));

var _className = _interopRequireDefault(require("./class-name"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ID_OR_CLASS_RE = /#[a-zA-Z0-9_-]+|\.-?[a-zA-Z0-9_][a-zA-Z0-9_-]*/g;
const ADD_POSTFIX_REPLACEMENT = '$&' + _className.default.postfix;

function transformSelector(selector) {
  return selector.replace(ID_OR_CLASS_RE, ADD_POSTFIX_REPLACEMENT);
}

function addUIClassPostfix(rules) {
  for (const node of rules) {
    if (node.type === 'rule') {
      const rule = node;
      rule.selectors = rule.selectors && rule.selectors.map(transformSelector);
    }

    const nodeWithRules = node;
    if (nodeWithRules.rules) addUIClassPostfix(nodeWithRules.rules);
  }
}

function createShadowStylesheet(cssCode) {
  const ast = _css.default.parse(cssCode, {
    silent: true
  });

  if (ast.stylesheet) addUIClassPostfix(ast.stylesheet.rules);
  return _css.default.stringify(ast, {
    compress: false
  });
}

module.exports = exports.default;