"use strict";

exports.__esModule = true;
exports.default = void 0;

var _toughCookie = require("tough-cookie");

var _cookieLimit = _interopRequireDefault(require("./cookie-limit"));

var _lodash = require("lodash");

var _url = require("../utils/url");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const LOCALHOST_DOMAIN = 'localhost';
const LOCALHOST_IP = '127.0.0.1';

class Cookies {
  constructor() {
    _defineProperty(this, "_cookieJar", void 0);

    this._cookieJar = new _toughCookie.CookieJar();
  }

  static _hasLocalhostDomain(cookie) {
    if (cookie) return cookie.domain === LOCALHOST_DOMAIN || cookie.domain === LOCALHOST_IP;
    return false;
  }

  _set(url, cookies, isClient) {
    cookies = (0, _lodash.castArray)(cookies);
    return cookies.reduce((resultCookies, cookieStr) => {
      let cookie;

      if (!isClient) {
        if (cookieStr.length > _cookieLimit.default) return resultCookies;
        cookie = _toughCookie.Cookie.parse(cookieStr, {
          loose: true
        });
        if (!cookie) return resultCookies;
      } else cookie = cookieStr; // NOTE: If cookie.domain and url hostname are equal to localhost/127.0.0.1,
      // we should remove 'Domain=...' form cookieStr (GH-1491)


      if (Cookies._hasLocalhostDomain(cookie) && (isClient || (0, _url.parseUrl)(url).hostname === cookie.domain)) cookie.domain = '';

      const parsedCookie = this._cookieJar.setCookieSync(cookie, url, {
        http: !isClient,
        ignoreError: true,
        loose: true
      });

      if (parsedCookie) resultCookies.push(parsedCookie);
      return resultCookies;
    }, []);
  }

  serializeJar() {
    return JSON.stringify(this._cookieJar.serializeSync());
  }

  setJar(serializedJar) {
    this._cookieJar = serializedJar ? _toughCookie.CookieJar.deserializeSync(JSON.parse(serializedJar)) : new _toughCookie.CookieJar();
  }

  setByServer(url, cookies) {
    return this._set(url, cookies, false);
  }

  setByClient(syncCookies) {
    for (const syncCookie of syncCookies) {
      const cookie = new _toughCookie.Cookie(syncCookie);
      const url = {
        hostname: syncCookie.domain,
        pathname: syncCookie.path
      };

      this._set(url, cookie, true);
    }
  }

  getClientString(url) {
    return this._cookieJar.getCookieStringSync(url, {
      http: false
    });
  }

  getHeader(url) {
    return this._cookieJar.getCookieStringSync(url, {
      http: true
    }) || null;
  }

}

exports.default = Cookies;
module.exports = exports.default;