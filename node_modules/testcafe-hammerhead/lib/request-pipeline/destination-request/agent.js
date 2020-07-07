"use strict";

exports.__esModule = true;
exports.assign = assign;
exports.shouldRegressHttps = shouldRegressHttps;
exports.regressHttps = regressHttps;
exports.resetKeepAliveConnections = resetKeepAliveConnections;

var _http = _interopRequireDefault(require("http"));

var _https = _interopRequireDefault(require("https"));

var _lruCache = _interopRequireDefault(require("lru-cache"));

var _tunnelAgent = _interopRequireDefault(require("tunnel-agent"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-ignore
const SSL3_HOST_CACHE_SIZE = 1000;
/* eslint-disable no-unused-vars */

var TYPE;
/* eslint-enable no-unused-vars */

(function (TYPE) {
  TYPE["SSL3"] = "SSL3";
  TYPE["TLS"] = "TLS";
  TYPE["HTTP"] = "HTTP";
})(TYPE || (TYPE = {}));

const ssl3HostCache = new _lruCache.default({
  max: SSL3_HOST_CACHE_SIZE
});
const agents = {
  [TYPE.SSL3]: {
    instance: null,
    Ctor: _https.default.Agent,
    secureProtocol: 'SSLv3_method'
  },
  [TYPE.TLS]: {
    instance: null,
    Ctor: _https.default.Agent
  },
  [TYPE.HTTP]: {
    instance: null,
    Ctor: _http.default.Agent
  }
}; // Utils

function getAgent(type) {
  const agent = agents[type];

  if (!agent.instance) {
    // @ts-ignore: Cannot use 'new' with an expression whose type lacks a call or construct signature.
    agent.instance = new agent.Ctor({
      keepAlive: true,
      secureProtocol: agent.secureProtocol
    });
  }

  return agent.instance;
}

function isSSLProtocolErr(err) {
  return !!err.message && err.message.includes('SSL routines');
} // API


function assign(reqOpts) {
  const proxy = reqOpts.proxy;

  if (proxy && reqOpts.protocol === 'https:') {
    reqOpts.agent = _tunnelAgent.default.httpsOverHttp({
      proxy,
      rejectUnauthorized: false
    });
    return;
  }

  let type = '';
  if (reqOpts.protocol === 'http:') type = TYPE.HTTP;else if (ssl3HostCache.get(reqOpts.host)) type = TYPE.SSL3;else type = TYPE.TLS;
  reqOpts.agent = getAgent(type);
}

function shouldRegressHttps(reqErr, reqOpts) {
  return reqOpts.agent === agents[TYPE.TLS] && isSSLProtocolErr(reqErr);
}

function regressHttps(reqOpts) {
  ssl3HostCache.set(reqOpts.host, true);
  reqOpts.agent = getAgent(TYPE.SSL3);
} // NOTE: Since our agents are keep-alive, we need to manually reset connections when we
// switch between servers in tests.


function resetKeepAliveConnections() {
  Object.keys(agents).forEach(type => {
    const agent = agents[type];
    if (agent.instance) agent.instance.destroy();
    agent.instance = null;
  });
}