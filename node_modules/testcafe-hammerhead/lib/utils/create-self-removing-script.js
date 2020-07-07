"use strict";

exports.__esModule = true;
exports.default = _default;

var _className = _interopRequireDefault(require("../shadow-ui/class-name"));

var _internalProperties = _interopRequireDefault(require("../processing/dom/internal-properties"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// -------------------------------------------------------------
// WARNING: this file is used by both the client and the server.
// Do not use any browser or node-specific API!
// -------------------------------------------------------------
function _default(script) {
  return `
        <script class="${_className.default.selfRemovingScript}">
            (function () {
                ${script}

                var currentScript = document.currentScript;
                var scriptsLength;
                var scripts;

                /* NOTE: IE11 doesn't support the 'currentScript' property */
                if (!currentScript) {
                    var hammerhead;

                    try {
                        hammerhead = parent["${_internalProperties.default.hammerhead}"] || window["${_internalProperties.default.hammerhead}"];
                    }
                    catch (e) {
                        hammerhead = window["${_internalProperties.default.hammerhead}"];
                    }

                    if (hammerhead) {
                        try {
                            scripts       = hammerhead.nativeMethods.documentScriptsGetter.call(document);
                            scriptsLength = hammerhead.nativeMethods.htmlCollectionLengthGetter.call(scripts);
                        }
                        catch (e) {}
                    }

                    scripts       = scripts || document.scripts;
                    scriptsLength = scriptsLength !== void 0 ? scriptsLength : scripts.length;
                    currentScript = scripts[scriptsLength - 1];
                }

                currentScript.parentNode.removeChild(currentScript);
            })();
        </script>
    `.replace(/\n\s*|\/\*[\S\s]*?\*\//g, '');
}

module.exports = exports.default;