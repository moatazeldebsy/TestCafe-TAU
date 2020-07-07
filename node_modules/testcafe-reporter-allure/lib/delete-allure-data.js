'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
var fs = require('fs');

var deleteEntireDirectory = function deleteEntireDirectory(path) {

    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file) {
            var curPath = path + '/' + file;

            if (fs.lstatSync(curPath).isDirectory()) {
                deleteEntireDirectory(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

exports.deleteEntireDirectory = deleteEntireDirectory;
var deleteAllureData = function deleteAllureData(appRootPath, allureConfig) {
    var resultDir = '' + appRootPath + allureConfig.RESULT_DIR;
    var reportDir = '' + appRootPath + allureConfig.REPORT_DIR;

    if (allure.docAllureConfig.CLEAN_REPORT_DIR) {
        if (fs.existsSync(reportDir)) {
            deleteEntireDirectory(reportDir);
        }
        if (fs.existsSync(resultDir)) {
            deleteEntireDirectory(resultDir);
        }
    }
};
exports.deleteAllureData = deleteAllureData;