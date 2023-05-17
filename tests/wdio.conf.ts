import path from 'node:path'
import url from 'node:url'

import type { Options, Services } from '@wdio/types'

import EdgeDriver from '../build/index.js'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

export const config: Options.Testrunner = {
    automationProtocol: 'webdriver',
    specs: [path.resolve(__dirname, 'specs', '**', '*.ts')],
    capabilities: [{
        maxInstances: 2,
        browserName: 'MicrosoftEdge',
        'ms:edgeOptions': {
            args: ['--headless']
        }
    }],
    services: [[
        EdgeDriver, {
            outputDir: path.join(__dirname, 'logs')
        }] as Services.ServiceEntry
    ],
    connectionRetryTimeout: 30000,
    connectionRetryCount: 0,
    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    }
}
