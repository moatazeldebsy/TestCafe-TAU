"use strict";

exports.__esModule = true;
exports.default = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class StateSnapshot {
  constructor(cookies, storages) {
    _defineProperty(this, "cookies", void 0);

    _defineProperty(this, "storages", void 0);

    this.cookies = cookies;
    this.storages = storages;
  }

  static empty() {
    return new StateSnapshot(null, {
      localStorage: '[[],[]]',
      sessionStorage: '[[],[]]'
    });
  }

}

exports.default = StateSnapshot;
module.exports = exports.default;