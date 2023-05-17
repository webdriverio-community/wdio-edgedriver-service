import type { ChildProcess } from 'child_process'

import fs from 'fs-extra'
import split2 from 'split2'
import getPort from 'get-port'
import tcpPortUsed from 'tcp-port-used'
import logger from '@wdio/logger'
import { start } from 'edgedriver'
import { SevereServiceError } from 'webdriverio'
import type { Options, Capabilities } from '@wdio/types'

import { pkg } from './constants.js'
import { getFilePath, isMultiremote, isEdge } from './utils.js'
import type { EdgedriverServiceOptions } from './types'

const POLL_INTERVAL = 100
const POLL_TIMEOUT = 10000

const log = logger('edgedriver')

export default class EdgedriverService {
    #process?: ChildProcess
    #options: EdgedriverServiceOptions

    constructor (
        options: EdgedriverServiceOptions,
        _: never,
        config: Options.Testrunner
    ) {
        log.info(`Initiate Edgedriver Service (v${pkg.version})`)
        this.#options = {
            outputDir: config.outputDir,
            edgedriverOptions: {
                baseUrl: '/'
            }
        }
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

        return this.#startDriver(capabilities, cid)
    }

    afterSession () {
        return this.#stopDriver()
    }

    async #startDriver (
        capabilities: Capabilities.Capabilities | Capabilities.MultiRemoteCapabilities,
        cid: string
    ) {
        const port = this.#options.edgedriverOptions?.port || await getPort()
        const baseUrl = this.#options.edgedriverOptions?.baseUrl || '/'

        /**
         * update capability connection options to connect
         * to chromedriver
         */
        this.#mapCapabilities(capabilities, baseUrl, port)

        this.#process = await start(this.#options.edgedriverOptions)
        log.info(`Edgedriver started for worker ${process.env.WDIO_WORKER_ID} on port ${port} with args: ${this.#process.spawnargs.join(' ')}`)

        if (this.#options.outputDir) {
            const logfileName = typeof this.#options.logFileName === 'function'
                ? this.#options.logFileName(capabilities, cid)
                : `wdio-edgedriver-${port}.log`

            const logFile = getFilePath(this.#options.outputDir, logfileName)
            await fs.ensureFile(logFile)
            this.#process.stdout?.pipe(split2()).on('data', log.info)
            this.#process.stderr?.pipe(split2()).on('data', log.warn)
        }

        try {
            await tcpPortUsed.waitUntilUsed(port, POLL_INTERVAL, POLL_TIMEOUT)
        } catch (err) {
            throw new SevereServiceError(
                `Couldn't start Chromedriver: ${err.message}\n` +
                'Chromedriver failed to start.'
            )
        }

        process.on('exit', this.#stopDriver.bind(this))
        process.on('SIGINT', this.#stopDriver.bind(this))
        process.on('uncaughtException', this.#stopDriver.bind(this))
    }

    #stopDriver () {
        if (this.#process) {
            log.info(`Shutting down Edgedriver for ${process.env.WDIO_WORKER_ID}`)
            this.#process.kill()
            this.#process = undefined
        }
    }

    #mapCapabilities (capabilities: Capabilities.Capabilities | Capabilities.MultiRemoteCapabilities, path: string, port: number) {
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
