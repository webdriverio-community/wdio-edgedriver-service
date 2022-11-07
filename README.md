# WDIO EdgeDriver Service [![Tests](https://github.com/webdriverio-community/wdio-edgedriver-service/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/webdriverio-community/wdio-edgedriver-service/actions/workflows/test.yml)

This service helps you to run Microsoft WebDriver (Edge) seamlessly when running tests with the [WDIO testrunner](https://webdriver.io/docs/gettingstarted.html).

This service does not require a Selenium server, but uses the
[Microsoft WebDriver](https://developer.microsoft.com/en-us/microsoft-edge/tools/webdriver/) that is installed as a Windows Feature on Demand or msedgedriver package for Chromium-based Edge.

Example capabilities:

```js
capabilities: [{
    browserName: 'MicrosoftEdge'
}]
```

## Installation

```bash
EDGECHROMIUMDRIVER_VERSION=107.0.1418.8 npm install wdio-edgedriver-service --save-dev
```

Make sure you set the right version within the `EDGECHROMIUMDRIVER_VERSION` environment variable. Check [this page](https://msedgedriver.azureedge.net/) for all available versions.

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
            // OPTIONAL: Provide custom port for edgeedriver.
            // edgeDriverRandomPort must be set to false to use this port and maxInstances must be set to 1.
            // Default: 4444
            port: 17556, // default for EdgeDriver

            // OPTIONAL: Arguments passed to edgedriver executable.
            // Note: Do not specify port here, use `port` config option instead.
            // Default: empty array
            args: ['--verbose'],

            // OPTIONAL: Location of edgedriver logs.
            // Must be a directory if using maxInstances > 1.
            // Could be a file name or a directory if maxInstances == 1.
            // Logs are saved as `EdgeDriver-{portname}.log`
            // Logs are not stored if this option is not set.
            // Default: not set
            outputDir: './logs'
        }
    ],
};
```

## Options

### `port`

Custom port to start Edgedriver on.

Type: `number`<br />
Default: _random port_

### `path`

The path on which the driver should run on.

Type: `number`<br />
Default: `/`

### `args`

Array of arguments to pass to the Geckodriver executable. Every argument should be prefixed with `--`.

Type: `string[]`<br />
Default: `[]`

### `outputDir`

The path where the output of the Safaridriver server should be stored (uses the `config.outputDir` by default when not set).

Type: `string`

### `logFileName`

The name of the log file to be written in outputDir.

Type: `string`<br />
Default: `wdio-geckodriver.log`

### `edgedriverCustomPath`

Type: `string`<br />
Default: _path to local or global installed Geckodriver_


----

For more information on WebdriverIO see the [homepage](https://webdriver.io).
