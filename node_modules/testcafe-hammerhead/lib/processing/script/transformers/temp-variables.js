"use strict";

exports.__esModule = true;
exports.default = void 0;

var _esotopeHammerhead = require("esotope-hammerhead");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const TEMP_VARIABLE_PREFIX = '_hh$temp';

class TempVariables {
  constructor() {
    _defineProperty(this, "_list", []);
  }

  static resetCounter() {
    TempVariables._counter = 0;
  }

  static generateName(baseName, key, index) {
    if (!baseName) return TEMP_VARIABLE_PREFIX + TempVariables._counter++;

    if (key) {
      if (key.type === _esotopeHammerhead.Syntax.Identifier) return baseName + '$' + key.name;
      if (key.type === _esotopeHammerhead.Syntax.Literal) return baseName + '$' + key.value.toString().replace(/[^a-zA-Z0-9]/g, '');
    }

    return baseName + '$i' + index;
  }

  static isHHTempVariable(name) {
    return name.indexOf(TEMP_VARIABLE_PREFIX) === 0;
  }

  append(name) {
    this._list.push(name);
  }

  get() {
    return this._list;
  }

}

exports.default = TempVariables;

_defineProperty(TempVariables, "_counter", 0);

module.exports = exports.default;