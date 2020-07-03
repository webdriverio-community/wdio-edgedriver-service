exports.config = {
    runner: 'local',
    specs: [
        './test/specs/**/*.js'
    ],
    capabilities: [{
        maxInstances: 2,
        browserName: 'MicrosoftEdge'
    }],
    logLevel: 'warn',
    services: ['edgedriver'],
    connectionRetryTimeout: 30000,
    connectionRetryCount: 0,
    // edgeDriverPersistent: true,
    // edgeDriverRandomPort: false,
    // port: 5555,
    edgeDriverArgs: ['--verbose'],
    edgeDriverLogs: './logs',

    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    }
}
