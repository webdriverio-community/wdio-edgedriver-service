WDIO EdgeDriver Service
================================

(Based entirely on [wdio-chromedriver-service](https://www.npmjs.com/package/wdio-chromedriver-service).)

Note - this service is targeted at WDIO v5.

----

This service helps you to run Microsoft WebDriver (Edge) seamlessly when running tests with the [WDIO testrunner](http://webdriver.io/guide/testrunner/gettingstarted.html). 
It uses the [Microsoft WebDriver](https://developer.microsoft.com/en-us/microsoft-edge/tools/webdriver/) service that is installed as a Windows Feature on Demand.

Note - this service does not require a Selenium server, but uses Microsoft WebDriver to communicate with the browser directly.
Obvisously, it only supports:

```js
capabilities: [{
        browserName: 'MicrosoftEdge'
    }]
```

## Installation

The easiest way is to keep `wdio-edgedriver-service` as a devDependency in your `package.json`.

```json
{
  "devDependencies": {
    "wdio-edgedriver-service": "^1.0.0"
  }
}
```

You can simple do it by:

```bash
npm install wdio-edgedriver-service --save-dev
```

Instructions on how to install `WebdriverIO` can be found [here.](http://webdriver.io/guide/getstarted/install.html)

## Configuration

By design, only Edge is available. In order to use the service you need to add `edgedriver` to your service array:

```js
// wdio.conf.js
export.config = {
  // port to find edgedriver
  port: 17556, // default for EdgeDriver
  path: '/',
  // ...
  services: ['edgedriver'],

  // options
  edgeDriverArgs: ['--port=17556'], // default for EdgeDriver
  edgeDriverLogs: './',
  // ...
};
```

## Options

### edgeDriverArgs
Array of arguments to pass to the EdgeDriver executable.
* `--port` will use wdioConfig.port if not specified
* etc.

Type: `string[]`
### edgeDriverLogs
Path where all logs from the EdgeDriver server should be stored.

Type: `string`



----

For more information on WebdriverIO see the [homepage](http://webdriver.io).
