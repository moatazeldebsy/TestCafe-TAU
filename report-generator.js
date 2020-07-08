var reporter = require('cucumber-html-reporter');

var options = {
        theme: 'bootstrap',
        jsonFile: 'reports/report.json',
        output: 'reports/cucumber_report.html',
        reportSuiteAsScenarios: true,
        scenarioTimestamp: true,
        screenshotsDirectory: 'reports/screenshots/',
        storeScreenshots: true,
        launchReport: true,
        metadata: {
            "App Version":"1.0.0",
            "Test Environment": "STAGING",
            "Browser": "Chrome  54.0.2840.98",
            "Platform": "Mac OS",
            "Parallel": "Scenarios",
            "Executed": "Local"
        }
    };

    reporter.generate(options);
