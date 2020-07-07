"use strict";

exports.__esModule = true;
exports.default = void 0;

var _names = _interopRequireDefault(require("../session/events/names"));

var _stateSnapshot = _interopRequireDefault(require("./state-snapshot"));

var _mustache = _interopRequireDefault(require("mustache"));

var _readFileRelative = require("read-file-relative");

var _events = require("events");

var _url = require("url");

var _cookies = _interopRequireDefault(require("./cookies"));

var _storage = _interopRequireDefault(require("../upload/storage"));

var _command = _interopRequireDefault(require("./command"));

var _generateUniqueId = _interopRequireDefault(require("../utils/generate-unique-id"));

var _serviceRoutes = _interopRequireDefault(require("../proxy/service-routes"));

let _COMMAND$uploadFiles, _COMMAND$getUploadedF;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const TASK_TEMPLATE = (0, _readFileRelative.readSync)('../client/task.js.mustache');
_COMMAND$uploadFiles = _command.default.uploadFiles;
_COMMAND$getUploadedF = _command.default.getUploadedFiles;

class Session extends _events.EventEmitter {
  constructor(uploadRoots) {
    super();

    _defineProperty(this, "uploadStorage", void 0);

    _defineProperty(this, "id", (0, _generateUniqueId.default)());

    _defineProperty(this, "cookies", new _cookies.default());

    _defineProperty(this, "proxy", null);

    _defineProperty(this, "externalProxySettings", null);

    _defineProperty(this, "pageLoadCount", 0);

    _defineProperty(this, "pendingStateSnapshot", null);

    _defineProperty(this, "injectable", {
      scripts: ['/hammerhead.js'],
      styles: [],
      userScripts: []
    });

    _defineProperty(this, "requestEventListeners", new Map());

    _defineProperty(this, "mocks", new Map());

    _defineProperty(this, "disablePageCaching", false);

    _defineProperty(this, "allowMultipleWindows", false);

    _defineProperty(this, "_recordMode", false);

    _defineProperty(this, "windowId", '');

    this.uploadStorage = new _storage.default(uploadRoots);
  } // State


  getStateSnapshot() {
    return new _stateSnapshot.default(this.cookies.serializeJar(), null);
  }

  useStateSnapshot(snapshot) {
    if (!snapshot) throw new Error('"snapshot" parameter cannot be null. Use StateSnapshot.empty() instead of it.'); // NOTE: we don't perform state switch immediately, since there might be
    // pending requests from current page. Therefore, we perform switch in
    // onPageRequest handler when new page is requested.

    this.pendingStateSnapshot = snapshot;
  }

  async handleServiceMessage(msg, serverInfo) {
    if (this[msg.cmd]) return await this[msg.cmd](msg, serverInfo);
    throw new Error('Malformed service message or message handler is not implemented');
  }

  _fillTaskScriptTemplate({
    serverInfo,
    isFirstPageLoad,
    referer,
    cookie,
    iframeTaskScriptTemplate,
    payloadScript,
    allowMultipleWindows,
    isRecordMode,
    windowId
  }) {
    referer = referer && JSON.stringify(referer) || '{{{referer}}}';
    cookie = cookie || '{{{cookie}}}';
    iframeTaskScriptTemplate = iframeTaskScriptTemplate || '{{{iframeTaskScriptTemplate}}}';
    const {
      domain,
      crossDomainPort
    } = serverInfo;
    return _mustache.default.render(TASK_TEMPLATE, {
      sessionId: this.id,
      serviceMsgUrl: domain + _serviceRoutes.default.messaging,
      transportWorkerUrl: domain + _serviceRoutes.default.transportWorker,
      forceProxySrcForImage: this.hasRequestEventListeners(),
      crossDomainPort,
      isFirstPageLoad,
      referer,
      cookie,
      iframeTaskScriptTemplate,
      payloadScript,
      allowMultipleWindows,
      isRecordMode,
      windowId: windowId || ''
    });
  }

  async getIframeTaskScriptTemplate(serverInfo) {
    const taskScriptTemplate = this._fillTaskScriptTemplate({
      serverInfo,
      isFirstPageLoad: false,
      referer: null,
      cookie: null,
      iframeTaskScriptTemplate: null,
      payloadScript: await this.getIframePayloadScript(true),
      allowMultipleWindows: this.allowMultipleWindows,
      isRecordMode: this._recordMode
    });

    return JSON.stringify(taskScriptTemplate);
  }

  async getTaskScript({
    referer,
    cookieUrl,
    serverInfo,
    isIframe,
    withPayload,
    windowId
  }) {
    const cookies = JSON.stringify(this.cookies.getClientString(cookieUrl));
    let payloadScript = '';
    if (withPayload) payloadScript = isIframe ? await this.getIframePayloadScript(false) : await this.getPayloadScript();

    const taskScript = this._fillTaskScriptTemplate({
      serverInfo,
      isFirstPageLoad: this.pageLoadCount === 0,
      referer,
      cookie: cookies,
      iframeTaskScriptTemplate: await this.getIframeTaskScriptTemplate(serverInfo),
      payloadScript,
      allowMultipleWindows: this.allowMultipleWindows,
      isRecordMode: this._recordMode,
      windowId
    });

    this.pageLoadCount++;
    return taskScript;
  }

  setExternalProxySettings(proxySettings) {
    if (typeof proxySettings === 'string') proxySettings = {
      url: proxySettings
    };
    if (!proxySettings || !proxySettings.url) return;
    const {
      url,
      bypassRules
    } = proxySettings;
    const parsedUrl = (0, _url.parse)('http://' + url);
    let settings = null;

    if (parsedUrl && parsedUrl.host) {
      settings = {
        host: parsedUrl.host,
        hostname: parsedUrl.hostname
      };
      if (bypassRules) settings.bypassRules = bypassRules;
      if (parsedUrl.port) settings.port = parsedUrl.port;

      if (parsedUrl.auth) {
        settings.proxyAuth = parsedUrl.auth;
        settings.authHeader = 'Basic ' + Buffer.from(parsedUrl.auth).toString('base64');
      }
    }

    this.externalProxySettings = settings;
  }

  onPageRequest(ctx) {
    if (!this.pendingStateSnapshot) return;
    this.cookies.setJar(this.pendingStateSnapshot.cookies);
    ctx.restoringStorages = this.pendingStateSnapshot.storages;
    this.pendingStateSnapshot = null;
  } // Request hooks


  hasRequestEventListeners() {
    return !!this.requestEventListeners.size;
  }

  addRequestEventListeners(requestFilterRule, listeners, errorHandler) {
    const listenersData = {
      listeners,
      errorHandler
    };
    this.requestEventListeners.set(requestFilterRule, listenersData);
  }

  removeRequestEventListeners(requestFilterRule) {
    this.requestEventListeners.delete(requestFilterRule);
  }

  clearRequestEventListeners() {
    this.requestEventListeners.clear();
  }

  getRequestFilterRules(requestInfo) {
    const rulesArray = Array.from(this.requestEventListeners.keys());
    return rulesArray.filter(rule => rule.match(requestInfo));
  }

  async callRequestEventCallback(eventName, requestFilterRule, eventData) {
    const requestEventListenersData = this.requestEventListeners.get(requestFilterRule);
    if (!requestEventListenersData) return;
    const {
      listeners,
      errorHandler
    } = requestEventListenersData;
    const targetRequestEventCallback = listeners[eventName];
    if (typeof targetRequestEventCallback !== 'function') return;

    try {
      await targetRequestEventCallback(eventData);
    } catch (e) {
      if (typeof errorHandler !== 'function') return;
      const event = {
        error: e,
        methodName: eventName
      };
      errorHandler(event);
    }
  }

  setMock(requestFilterRule, mock) {
    this.mocks.set(requestFilterRule, mock);
  }

  getMock(requestFilterRule) {
    return this.mocks.get(requestFilterRule);
  }

  setRecordMode() {
    this._recordMode = true;
  }

  // Service message handlers
  async [_COMMAND$uploadFiles](msg) {
    return await this.uploadStorage.store(msg.fileNames, msg.data);
  }

  async [_COMMAND$getUploadedF](msg) {
    return await this.uploadStorage.get(msg.filePaths);
  }

}

exports.default = Session;
module.exports = exports.default;