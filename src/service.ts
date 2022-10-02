import cp, { ChildProcess } from 'child_process'

import fs from 'fs-extra'
import split2 from 'split2'
import getPort from 'get-port'
import tcpPortUsed from 'tcp-port-used'
import msedgedriver from 'msedgedriver'
import logger from '@wdio/logger'
import { SevereServiceError } from 'webdriverio'
import type { Options, Capabilities } from '@wdio/types'

import { pkg } from './constants.js'
import { getFilePath, isMultiremote, isEdge } from './utils.js'
import type { EdgedriverServiceOptions } from './types'

const DEFAULT_PATH = '/'
const POLL_INTERVAL = 100
const POLL_TIMEOUT = 10000

const log = logger('edgedriver')

export default class EdgedriverLauncher {
    private process?: ChildProcess

    constructor (private options: EdgedriverServiceOptions) {
        log.info(`Initiate Edgedriver Launcher (v${pkg.version})`)
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    beforeSession (
        config: Options.Testrunner,
        capabilities: Capabilities.Capabilities | Capabilities.MultiRemoteCapabilities,
        _: never,
        cid: string
    ) {
        /**
         * only start driver if session has edge as browser defined
         */
        if (!isEdge(capabilities)) {
            return
        }

        return this._startDriver(config, capabilities, cid)
    }

    afterSession () {
        return this._stopDriver()
    }

    async _startDriver (
        config: Options.Testrunner,
        capabilities: Capabilities.Capabilities | Capabilities.MultiRemoteCapabilities,
        cid: string
    ) {
        const outputDir = this.options.outputDir || config.outputDir
        const args = this.options.args || []
        const path = this.options.path || DEFAULT_PATH

        const port = await getPort()
        args.push(`--port=${port}`)

        /**
         * update capability connection options to connect
         * to chromedriver
         */
        this._mapCapabilities(capabilities, path, port)

        if (outputDir) {
            const logfileName = typeof this.options.logFileName === 'function'
                ? this.options.logFileName(capabilities, cid)
                : `wdio-edgedriver-${port}.log`

            const logFile = getFilePath(outputDir, logfileName)
            await fs.ensureFile(logFile)
            args.push(`--log-path=${logFile}`, '--verbose')
        }

        const driverPath = this.options.edgedriverCustomPath || msedgedriver.path
        log.info(`Start Edgedriver (${driverPath}) with args ${args.join(' ')}`)
        this.process = cp.spawn(driverPath, args)
        log.info(`Edgedriver started for worker ${process.env.WDIO_WORKER_ID} on port ${port}`)

        if (typeof this.options.outputDir !== 'string') {
            this.process.stdout?.pipe(split2()).on('data', log.info)
            this.process.stderr?.pipe(split2()).on('data', log.warn)
        }

        try {
            await tcpPortUsed.waitUntilUsed(port, POLL_INTERVAL, POLL_TIMEOUT)
        } catch (err) {
            throw new SevereServiceError(
                `Couldn't start Chromedriver: ${err.message}\n` +
                'Chromedriver failed to start.'
            )
        }

        process.on('exit', this._stopDriver.bind(this))
        process.on('SIGINT', this._stopDriver.bind(this))
        process.on('uncaughtException', this._stopDriver.bind(this))
    }

    _stopDriver () {
        if (this.process) {
            log.info(`Shutting down Edgedriver for ${process.env.WDIO_WORKER_ID}`)
            this.process.kill()
            delete this.process
        }
    }

    _mapCapabilities (capabilities: Capabilities.Capabilities | Capabilities.MultiRemoteCapabilities, path: string, port: number) {
        if (isMultiremote(capabilities)) {
            for (const cap in capabilities) {
                const caps = (capabilities as Capabilities.MultiRemoteCapabilities)[cap].capabilities as Capabilities.Capabilities
                if (isEdge(caps)) {
                    Object.assign(caps, { port, path })
                }
            }
            return
        }

        Object.assign(capabilities, { port, path })
    }
}
