"use strict";

exports.__esModule = true;
exports.default = void 0;

var _baseDomAdapter = _interopRequireDefault(require("./base-dom-adapter"));

var _events = _interopRequireDefault(require("events"));

var urlUtils = _interopRequireWildcard(require("../../utils/url"));

var parse5Utils = _interopRequireWildcard(require("../../utils/parse5"));

var _namespaces = require("./namespaces");

var _index = _interopRequireDefault(require("./index"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Parse5DomAdapter extends _baseDomAdapter.default {
  constructor(isIframe, crossDomainPort) {
    super();

    _defineProperty(this, "isIframe", void 0);

    _defineProperty(this, "crossDomainPort", void 0);

    this.isIframe = isIframe;
    this.crossDomainPort = crossDomainPort;
  }

  removeAttr(el, attr) {
    parse5Utils.removeAttr(el, attr);
  }

  getAttr(el, attr) {
    return parse5Utils.getAttr(el, attr);
  }

  getClassName(el) {
    return this.getAttr(el, 'class') || '';
  }

  hasAttr(el, attr) {
    return this.getAttr(el, attr) !== null;
  }

  isSVGElement(el) {
    return el.namespaceURI === _namespaces.SVG_NAMESPACE;
  }

  hasEventHandler(el) {
    for (let i = 0; i < el.attrs.length; i++) {
      if (this.EVENTS.includes(el.attrs[i].name)) return true;
    }

    return false;
  }

  getTagName(el) {
    return (el.tagName || '').toLowerCase();
  }

  setAttr(el, attr, value) {
    return parse5Utils.setAttr(el, attr, value);
  }

  setScriptContent(script, content) {
    script.childNodes = [parse5Utils.createTextNode(content, script)];
  }

  getScriptContent(script) {
    return script.childNodes.length ? script.childNodes[0].value : '';
  }

  getStyleContent(style) {
    return style.childNodes.length ? style.childNodes[0].value : '';
  }

  setStyleContent(style, content) {
    style.childNodes = [parse5Utils.createTextNode(content, style)];
  }

  needToProcessContent() {
    return true;
  }

  needToProcessUrl(tagName, target) {
    if (_index.default.isIframeFlagTag(tagName) && target === '_parent') return false;
    return true;
  }

  attachEventEmitter(domProcessor) {
    const eventEmitter = new _events.default.EventEmitter();
    domProcessor.on = eventEmitter.on.bind(eventEmitter);
    domProcessor.off = eventEmitter.removeListener.bind(eventEmitter);
    domProcessor.emit = eventEmitter.emit.bind(eventEmitter);
  }

  hasIframeParent() {
    return this.isIframe;
  }

  getCrossDomainPort() {
    return this.crossDomainPort;
  }

  getProxyUrl() {
    return urlUtils.getProxyUrl.apply(urlUtils, arguments);
  }

  isTopParentIframe() {
    return false;
  }

  sameOriginCheck(location, checkedUrl) {
    return urlUtils.sameOriginCheck(location, checkedUrl);
  }

  isExistingTarget(target, el) {
    while (el.parentNode) el = el.parentNode;

    return parse5Utils.findElement(el, e => this.getAttr(e, 'name') === target);
  }

}

exports.default = Parse5DomAdapter;
module.exports = exports.default;