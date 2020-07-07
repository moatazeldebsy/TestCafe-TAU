"use strict";

exports.__esModule = true;
exports.default = void 0;

var _resourceProcessorBase = _interopRequireDefault(require("./resource-processor-base"));

var _style = _interopRequireDefault(require("../style"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class StylesheetProcessor extends _resourceProcessorBase.default {
  processResource(stylesheet, _ctx, _charset, urlReplacer) {
    return _style.default.process(stylesheet, urlReplacer);
  }

  shouldProcessResource(ctx) {
    return ctx.contentInfo.isCSS;
  }

}

var _default = new StylesheetProcessor();

exports.default = _default;
module.exports = exports.default;