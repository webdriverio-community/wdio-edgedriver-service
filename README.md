WDIO EdgeDriver Service
================================

Note - this service is targeted at WDIO v6.

----

This service helps you to run Microsoft WebDriver (Edge) seamlessly when running tests with the
[WDIO testrunner](https://webdriver.io/docs/gettingstarted.html).

This service does not require a Selenium server, but uses the
[Microsoft WebDriver](https://developer.microsoft.com/en-us/microsoft-edge/tools/webdriver/) service that is installed
as a Windows Feature on Demand or msedgedriver package for Chromium-based Edge.

Example capabilities:

```js
capabilities: [{
        browserName: 'MicrosoftEdge',
        maxInstances: 1 // must be 1 for EdgeHtml, can be more for ChromiumEdge.
    }]
```

## Installation

```bash
npm install wdio-edgedriver-service --save-dev
```

For Chromium-based Edge you also need to install msedgedriver (you can point the proper version):

```bash
npm i -D msedgedriver --edgechromiumdriver_version=81.0.416.58
```

## Configuration

By design, only Edge is available. In order to use the service you need to add `edgedriver` to your service array:

```js
// wdio.conf.js
export.config = {
    // MANDATORY: Add edgedriver to service array.
    // Default: empty array
    services: ['edgedriver'],

    // OPTIONAL: Provide custom port for edgeedriver.
    // edgeDriverRandomPort must be set to false to use this port and maxInstances must be set to 1.
    // Default: 4444
    port: 17556, // default for EdgeDriver

    // OPTIONAL: Arguments passed to edgedriver executable.
    // Note: Do not specify port here, use `port` config option instead.
    // Default: empty array
    edgeDriverArgs: ['--verbose'],

    // OPTIONAL: Location of edgedriver logs.
    // Must be a directory if using maxInstances > 1.
    // Could be a file name or a directory if maxInstances == 1.
    // Logs are saved as `EdgeDriver-{portname}.log`
    // Logs are not stored if this option is not set.
    // Default: not set
    edgeDriverLogs: './logs',

    // OPTIONAL: Launch edgedriver once for all specs if true.
    // Launch edgedriver for each spec separately if false.
    // Default: false
    edgeDriverPersistent: false,

    // OPTIONAL: Use a random port for launching edgedriver.
    // Must be set to true if maxInstances > 1.
    // Set it to false to use the `port` config option.
    // Default: true
    edgeDriverRandomPort: true,
};
```

----

For more information on WebdriverIO see the [homepage](https://webdriver.io).
