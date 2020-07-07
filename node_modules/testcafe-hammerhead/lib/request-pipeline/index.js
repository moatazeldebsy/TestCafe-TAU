"use strict";

exports.__esModule = true;
exports.run = run;

var _context = _interopRequireDefault(require("./context"));

var _resources = require("../processing/resources");

var _connectionResetGuard = _interopRequireDefault(require("./connection-reset-guard"));

var _sameOriginCheckFailedStatusCode = _interopRequireDefault(require("./xhr/same-origin-check-failed-status-code"));

var _http = require("../utils/http");

var _websocket = require("./websocket");

var _specialPage = _interopRequireDefault(require("./special-page"));

var _info = require("../session/events/info");

var _names = _interopRequireDefault(require("../session/events/names"));

var _configureResponseEvent = _interopRequireDefault(require("../session/events/configure-response-event"));

var _configureResponseEventOptions = _interopRequireDefault(require("../session/events/configure-response-event-options"));

var _lodash = require("lodash");

var _requestOptions = _interopRequireDefault(require("./request-options"));

var _utils = require("./utils");

var _logger = _interopRequireDefault(require("../utils/logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const EVENT_SOURCE_REQUEST_TIMEOUT = 60 * 60 * 1000;
const stages = [function handleSocketError(ctx) {
  // NOTE: In some case on MacOS, browser reset connection with server and we need to catch this exception.
  if (!ctx.isWebSocket) return;
  ctx.res.on('error', e => {
    _logger.default.proxy('Proxy error %s %o', ctx.requestId, e); // @ts-ignore


    if (e.code === 'ECONNRESET' && !ctx.mock) {
      if (ctx.destRes) ctx.destRes.destroy();else ctx.isWebSocketConnectionReset = true;
    } else throw e;
  });
}, async function fetchProxyRequestBody(ctx) {
  if (ctx.isHTMLPage) ctx.session.onPageRequest(ctx);
  ctx.reqBody = await (0, _http.fetchBody)(ctx.req);
}, async function sendDestinationRequest(ctx) {
  ctx.reqOpts = new _requestOptions.default(ctx);

  if (ctx.isSpecialPage) {
    ctx.destRes = (0, _specialPage.default)();
    return;
  }

  if (ctx.session.hasRequestEventListeners()) {
    const requestInfo = new _info.RequestInfo(ctx);
    ctx.requestFilterRules = ctx.session.getRequestFilterRules(requestInfo);
    await ctx.forEachRequestFilterRule(async rule => {
      await (0, _utils.callOnRequestEventCallback)(ctx, rule, requestInfo);
      ctx.setupMockIfNecessary(rule);
    });
  }

  if (ctx.mock) await ctx.mockResponse();else await (0, _utils.sendRequest)(ctx);
}, async function checkSameOriginPolicyCompliance(ctx) {
  ctx.buildContentInfo();
  if (ctx.isPassSameOriginPolicy()) return;
  ctx.isSameOriginPolicyFailed = true;
  await ctx.forEachRequestFilterRule(async rule => {
    const configureResponseEvent = new _configureResponseEvent.default(ctx, rule, _configureResponseEventOptions.default.DEFAULT);
    await ctx.session.callRequestEventCallback(_names.default.onConfigureResponse, rule, configureResponseEvent);
    await (0, _utils.callOnResponseEventCallbackForFailedSameOriginCheck)(ctx, rule, _configureResponseEventOptions.default.DEFAULT);
  });

  _logger.default.proxy('Proxy CORS check failed %s, responding 222', ctx.requestId);

  ctx.closeWithError(_sameOriginCheckFailedStatusCode.default);
}, async function decideOnProcessingStrategy(ctx) {
  ctx.goToNextStage = false;

  if (ctx.isWebSocket) {
    (0, _websocket.respondOnWebSocket)(ctx);
    return;
  }

  if (ctx.contentInfo.requireProcessing && ctx.destRes.statusCode === 204) ctx.destRes.statusCode = 200; // NOTE: Just pipe the content body to the browser if we don't need to process it.
  else if (!ctx.contentInfo.requireProcessing) {
      if (!ctx.isSpecialPage) {
        await (0, _utils.callOnConfigureResponseEventForNonProcessedRequest)(ctx);
        ctx.sendResponseHeaders();
        if (ctx.contentInfo.isNotModified) await (0, _utils.callOnResponseEventCallbackForMotModifiedResource)(ctx);else {
          const onResponseEventDataWithBody = ctx.getOnResponseEventData({
            includeBody: true
          });
          const onResponseEventDataWithoutBody = ctx.getOnResponseEventData({
            includeBody: false
          });
          if (onResponseEventDataWithBody.length) await (0, _utils.callOnResponseEventCallbackWithBodyForNonProcessedRequest)(ctx, onResponseEventDataWithBody);else if (onResponseEventDataWithoutBody.length) await (0, _utils.callOnResponseEventCallbackWithoutBodyForNonProcessedResource)(ctx, onResponseEventDataWithoutBody);else if (ctx.req.socket.destroyed && !ctx.isDestResReadableEnded) ctx.destRes.destroy();else {
            ctx.res.once('close', () => !ctx.isDestResReadableEnded && ctx.destRes.destroy());
            ctx.destRes.pipe(ctx.res);
          }
        } // NOTE: sets 60 minutes timeout for the "event source" requests instead of 2 minutes by default

        if (ctx.dest.isEventSource) {
          ctx.req.setTimeout(EVENT_SOURCE_REQUEST_TIMEOUT, _lodash.noop);
          ctx.req.on('close', () => ctx.destRes.destroy());
        }
      } else {
        ctx.sendResponseHeaders();
        ctx.res.end();
      }

      return;
    }
  ctx.goToNextStage = true;
}, async function fetchContent(ctx) {
  ctx.destResBody = await (0, _http.fetchBody)(ctx.destRes);
  if (ctx.requestFilterRules.length) ctx.saveNonProcessedDestResBody(ctx.destResBody);
}, async function processContent(ctx) {
  try {
    ctx.destResBody = await (0, _resources.process)(ctx);
  } catch (err) {
    (0, _utils.error)(ctx, err);
  }
}, async function sendProxyResponse(ctx) {
  const configureResponseEvents = await Promise.all(ctx.requestFilterRules.map(async rule => {
    const configureResponseEvent = new _configureResponseEvent.default(ctx, rule, _configureResponseEventOptions.default.DEFAULT);
    await ctx.session.callRequestEventCallback(_names.default.onConfigureResponse, rule, configureResponseEvent);
    return configureResponseEvent;
  }));
  ctx.sendResponseHeaders();
  (0, _connectionResetGuard.default)(async () => {
    await Promise.all(configureResponseEvents.map(async configureResponseEvent => {
      await (0, _utils.callResponseEventCallbackForProcessedRequest)(ctx, configureResponseEvent);
    }));
    const res = ctx.res;
    res.write(ctx.destResBody);
    ctx.res.end();
  });
}];

async function run(req, res, serverInfo, openSessions) {
  const ctx = new _context.default(req, res, serverInfo);

  _logger.default.proxy('Proxy request %s %s %s %j', ctx.requestId, ctx.req.method, ctx.req.url, ctx.req.headers);

  if (!ctx.dispatch(openSessions)) {
    _logger.default.proxy('Proxy error: request to proxy cannot be dispatched %s, responding 404', ctx.requestId);

    (0, _http.respond404)(res);
    return;
  }

  for (let i = 0; i < stages.length; i++) {
    await stages[i](ctx);
    if (!ctx.goToNextStage) return;
  }
}