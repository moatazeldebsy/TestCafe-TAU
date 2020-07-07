"use strict";

exports.__esModule = true;
exports.default = void 0;

var _http = require("../utils/http");

var _cryptoMd = _interopRequireDefault(require("crypto-md5"));

var _url = require("../utils/url");

var _lodash = require("lodash");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const PARAM_RE = /^{(\S+)}$/;

function buildRouteParamsMap(routeMatch, paramNames) {
  return paramNames.reduce((params, paramName, i) => {
    params[paramName] = routeMatch[i + 1];
    return params;
  }, {});
}

class Router {
  constructor(options = {}) {
    _defineProperty(this, "options", void 0);

    _defineProperty(this, "routes", new Map());

    _defineProperty(this, "routesWithParams", []);

    this.options = options;
  }

  _registerRoute(route, method, handler) {
    const tokens = route.split('/');
    const isRouteWithParams = tokens.some(token => PARAM_RE.test(token));
    if (isRouteWithParams && typeof handler === 'function') this._registerRouteWithParams(tokens, method, handler);else {
      const routeName = `${method} ${route}`;

      if (typeof handler !== 'function') {
        this._processStaticContent(handler);

        handler.etag = (0, _cryptoMd.default)(handler.content);
        this.routes.set(routeName, {
          handler,
          isStatic: true
        });
      } else this.routes.set(routeName, {
        handler,
        isStatic: false
      });
    }
  }

  _prepareParamInfo(tokens, method) {
    const paramNames = [];
    const reParts = tokens.map(token => {
      const paramMatch = token.match(PARAM_RE);

      if (paramMatch) {
        paramNames.push(paramMatch[1]);
        return '(\\S+?)';
      }

      return token;
    });
    return {
      paramNames,
      re: new RegExp(`^${method} ${reParts.join('/')}$`)
    };
  }

  _registerRouteWithParams(tokens, method, handler) {
    const {
      paramNames,
      re
    } = this._prepareParamInfo(tokens, method);

    this.routesWithParams.push({
      handler,
      paramNames,
      re
    });
  }

  _unregisterRouteWithParams(tokens, method) {
    const {
      paramNames,
      re
    } = this._prepareParamInfo(tokens, method);

    const routeIndex = this.routesWithParams.findIndex(routeWithParam => {
      return (0, _lodash.isEqual)(routeWithParam.re, re) && (0, _lodash.isEqual)(routeWithParam.paramNames, paramNames);
    });
    if (routeIndex !== -1) this.routesWithParams.splice(routeIndex, 1);
  }

  _route(req, res, serverInfo) {
    const routerQuery = `${req.method} ${(0, _url.getPathname)(req.url)}`;
    const route = this.routes.get(routerQuery);

    if (route) {
      if (route.isStatic) (0, _http.respondStatic)(req, res, route.handler, this.options.staticContentCaching);else route.handler(req, res, serverInfo);
      return true;
    }

    for (const routeWithParams of this.routesWithParams) {
      const routeMatch = routerQuery.match(routeWithParams.re);

      if (routeMatch) {
        const params = buildRouteParamsMap(routeMatch, routeWithParams.paramNames);
        routeWithParams.handler(req, res, serverInfo, params);
        return true;
      }
    }

    return false;
  }

  // API
  GET(route, handler) {
    this._registerRoute(route, 'GET', handler);
  }

  POST(route, handler) {
    this._registerRoute(route, 'POST', handler);
  }

  unRegisterRoute(route, method) {
    const tokens = route.split('/');
    const isRouteWithParams = tokens.some(token => PARAM_RE.test(token));
    if (isRouteWithParams) this._unregisterRouteWithParams(tokens, method);
    const routeName = `${method} ${route}`;
    this.routes.delete(routeName);
  }

}

exports.default = Router;
module.exports = exports.default;