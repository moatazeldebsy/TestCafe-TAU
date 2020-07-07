'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
var generateConfig = function generateConfig(reporterConfig) {
    var config = {
        CLEAN_REPORT_DIR: reporterConfig.CLEAN_REPORT_DIR || false,
        COPY_HISTORY: reporterConfig.COPY_HISTORY || false,
        RESULT_DIR: reporterConfig.RESULT_DIR || '/allure/allure-results',
        REPORT_DIR: reporterConfig.REPORT_DIR || '/allure/allure-report',
        META: {
            STORY_ID: reporterConfig.META && reporterConfig.META.STORY_ID || 'STORY',
            TEST_ID: reporterConfig.META && reporterConfig.META.TEST_ID || 'ID',
            SEVERITY: reporterConfig.META && reporterConfig.META.SEVERITY || 'SEVERITY',
            TEST_RUN: reporterConfig.META && reporterConfig.META.TEST_RUN || 'TEST_RUN'
        },
        STORY_LABEL: reporterConfig.STORY_LABEL || 'JIRA story link',
        STORY_URL: reporterConfig.STORY_URL || 'https://jira.example.ca/browse/{{ID}}',
        TEST_LABEL: reporterConfig.TEST_LABEL || 'Jira test link',
        TEST_URL: reporterConfig.TEST_URL || 'https://jira.example.ca/secure/Tests.jspa#/testCase/{{ID}}',
        labels: {
            screenshotLabel: reporterConfig.labels && reporterConfig.labels.screenshotLabel || 'Screenshot',
            browserLabel: reporterConfig.labels && reporterConfig.labels.browserLabel || 'Browser',
            userAgentLabel: reporterConfig.labels && reporterConfig.labels.userAgentLabel || 'User Agent',
            allureStartMessage: reporterConfig.labels && reporterConfig.labels.allureStartMessage || 'Allure reporter started...',
            allureClosedMessage: reporterConfig.labels && reporterConfig.labels.allureClosedMessage || 'Allure reporter closed...',
            brokenTestMessage: reporterConfig.labels && reporterConfig.labels.brokenTestMessage || 'This test has been broken',
            skippedTestMessage: reporterConfig.labels && reporterConfig.labels.skippedTestMessage || 'This test has been skipped.',
            passedTestMessage: reporterConfig.labels && reporterConfig.labels.passedTestMessage || 'This test has been passed.'
        }
    };

    return config;
};
exports.generateConfig = generateConfig;