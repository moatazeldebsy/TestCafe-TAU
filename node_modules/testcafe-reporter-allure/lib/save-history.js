'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
var copydir = require('copy-dir');
var fs = require('fs');

exports['default'] = function (appRootPath, allureConfig) {
    var reportDir = '' + appRootPath + allureConfig.REPORT_DIR;
    var resultDir = '' + appRootPath + allureConfig.RESULT_DIR;
    var reportHistory = reportDir + '/history';
    var resultHistory = resultDir + '/history';

    if (fs.existsSync(reportHistory)) {
        if (!fs.existsSync(resultHistory)) {
            fs.mkdirSync(resultHistory);
        }
        copydir.sync(reportHistory, resultHistory);
    }
};

module.exports = exports['default'];