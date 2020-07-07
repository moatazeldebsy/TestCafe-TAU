"use strict";

exports.__esModule = true;
exports.ATTRS_WITH_SPECIAL_PROXYING_LOGIC = exports.TARGET_ATTRS = exports.TARGET_ATTR_TAGS = exports.URL_ATTRS = exports.URL_ATTR_TAGS = void 0;
// -------------------------------------------------------------
// WARNING: this file is used by both the client and the server.
// Do not use any browser or node-specific API!
// -------------------------------------------------------------
const URL_ATTR_TAGS = {
  href: ['a', 'link', 'image', 'area', 'base'],
  src: ['img', 'embed', 'script', 'source', 'video', 'audio', 'input', 'frame', 'iframe'],
  action: ['form'],
  formaction: ['button', 'input'],
  manifest: ['html'],
  data: ['object']
};
exports.URL_ATTR_TAGS = URL_ATTR_TAGS;
const URL_ATTRS = ['href', 'src', 'action', 'formaction', 'manifest', 'data'];
exports.URL_ATTRS = URL_ATTRS;
const TARGET_ATTR_TAGS = {
  target: ['a', 'form', 'area', 'base'],
  formtarget: ['input', 'button']
};
exports.TARGET_ATTR_TAGS = TARGET_ATTR_TAGS;
const TARGET_ATTRS = ['target', 'formtarget'];
exports.TARGET_ATTRS = TARGET_ATTRS;
const ATTRS_WITH_SPECIAL_PROXYING_LOGIC = ['sandbox', 'autocomplete', 'target', 'formtarget', 'style'];
exports.ATTRS_WITH_SPECIAL_PROXYING_LOGIC = ATTRS_WITH_SPECIAL_PROXYING_LOGIC;