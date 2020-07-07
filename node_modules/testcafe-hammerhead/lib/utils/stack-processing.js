"use strict";

exports.__esModule = true;
exports.replaceProxiedUrlsInStack = replaceProxiedUrlsInStack;
exports.getFirstDestUrl = getFirstDestUrl;

var _url = require("./url");

const STACK_FRAME_REG_EXPS = [/^\s*at .*\((\S+)\)/, // Chrome, IE (with function name)
/^\s*at (\S+)/, // Chrome, IE (without function name)
/^.*@(\S+)/, // Safari
/(.+)/ // Any string
];
const ROW_COLUMN_NUMBER_REG_EX = /:\d+:\d+$/;

function getDestSource(source) {
  const parsedProxiedUrl = (0, _url.parseProxyUrl)(source);
  return parsedProxiedUrl && parsedProxiedUrl.destUrl;
}

function replaceUrlWithProxied(str, source) {
  source = source.replace(ROW_COLUMN_NUMBER_REG_EX, '');
  const destUrl = getDestSource(source);
  return destUrl ? str.replace(source, destUrl) : str;
}

function replaceProxiedUrlsInStack(stack) {
  if (!stack) return stack;
  const stackFrames = stack.split('\n');

  for (let i = 0; i < stackFrames.length; i++) {
    const stackFrame = stackFrames[i];

    for (const stackFrameRegExp of STACK_FRAME_REG_EXPS) {
      if (stackFrameRegExp.test(stackFrame)) {
        stackFrames[i] = stackFrame.replace(stackFrameRegExp, replaceUrlWithProxied);
        break;
      }
    }
  }

  return stackFrames.join('\n');
}

function getFirstDestUrl(stack) {
  if (!stack) return null;
  const stackFrames = stack.split('\n');

  for (const stackFrame of stackFrames) {
    for (const stackFrameRegExp of STACK_FRAME_REG_EXPS) {
      if (!stackFrameRegExp.test(stackFrame)) continue;
      let destSource = null;
      stackFrame.replace(stackFrameRegExp, (str, source) => {
        source = source.replace(ROW_COLUMN_NUMBER_REG_EX, '');
        destSource = getDestSource(source);
        return str;
      });
      if (destSource) return destSource;
    }
  }

  return null;
}