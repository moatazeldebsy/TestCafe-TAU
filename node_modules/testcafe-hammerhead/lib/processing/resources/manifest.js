"use strict";

exports.__esModule = true;
exports.default = void 0;

var _resourceProcessorBase = _interopRequireDefault(require("./resource-processor-base"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ManifestProcessor extends _resourceProcessorBase.default {
  processResource(manifest, _ctx, _charset, urlReplacer) {
    const lines = manifest.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line && line !== 'CACHE MANIFEST' && line !== 'NETWORK:' && line !== 'FALLBACK:' && line !== 'CACHE:' && line[0] !== '#' && line !== '*') {
        const isFallbackItem = line.includes(' ');

        if (isFallbackItem) {
          const urls = line.split(' ');
          lines[i] = urlReplacer(urls[0]) + ' ' + urlReplacer(urls[1]);
        } else lines[i] = urlReplacer(line);
      }
    }

    return lines.join('\n');
  }

  shouldProcessResource(ctx) {
    return ctx.contentInfo.isManifest;
  }

}

var _default = new ManifestProcessor();

exports.default = _default;
module.exports = exports.default;