import path from 'node:path'
import type { Options, Services } from '@wdio/types'

// @ts-expect-error for some reason not a module
// eslint-disable-next-line import/default
import GeckoDriverLauncher from '../build/cjs/index.js'

export const config: Options.Testrunner = {
    specs: [path.resolve(__dirname, 'specs', '**', '*.ts')],
    capabilities: [{
        maxInstances: 2,
        browserName: 'MicrosoftEdge'
    }],
    services: [[
        GeckoDriverLauncher,
        {
            args: ['--verbose'],
            outputDir: './logs',
        }
    ]],
    connectionRetryTimeout: 30000,
    connectionRetryCount: 0,
    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    }
}
