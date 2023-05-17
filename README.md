# WDIO EdgeDriver Service [![Tests](https://github.com/webdriverio-community/wdio-edgedriver-service/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/webdriverio-community/wdio-edgedriver-service/actions/workflows/test.yml) [![Audit](https://github.com/webdriverio-community/wdio-edgedriver-service/actions/workflows/audit.yml/badge.svg)](https://github.com/webdriverio-community/wdio-edgedriver-service/actions/workflows/audit.yml)

This service helps you to run Microsoft WebDriver (Edge) seamlessly when running tests with the [WDIO testrunner](https://webdriver.io/docs/gettingstarted.html).

It does not require a Selenium server, but uses the [Microsoft WebDriver](https://developer.microsoft.com/en-us/microsoft-edge/tools/webdriver/) that is installed as a Windows Feature on Demand or as [`edgedriver`](https://www.npmjs.com/package/edgedriver) NPM package for Chromium-based Edge.

Example capabilities:

```js
capabilities: [{
    browserName: 'MicrosoftEdge'
}]
```

## Installation

```bash
npm install wdio-edgedriver-service --save-dev
```

## Configuration

By design, only Edge is available. In order to use the service you need to add `edgedriver` to your service array:

```js
// wdio.conf.js
export.config = {
    // MANDATORY: Add edgedriver to service array.
    // Default: empty array
    services: [
        'edgedriver',
        // service options
        {
            outputDir: './logs',
            // see https://github.com/webdriverio-community/node-edgedriver#options for more
            // options that can be passed into EdgeDriver directly
            edgedriverOptions: {
                verbose: true
            }
        }
    ],
};
```

## Options

### `outputDir`

The path where the output of the Safaridriver server should be stored (uses the `config.outputDir` by default when not set).

Type: `string`

### `logFileName`

The name of the log file to be written in `outputDir`. Requires `outputDir` to be set in WebdriverIO config or as service option.

Type: `string`<br />
Default: `wdio-edgedriver-service-<cid>.log`

### `edgedriverOptions`

Options that are passed into EdgeDriver. See [driver docs](https://github.com/webdriverio-community/node-edgedriver#options) for more information.

Type: `EdgedriverParameters`<br />
Default: _`{}`_


----

For more information on WebdriverIO see the [homepage](https://webdriver.io).
