import type { ChildProcess } from 'child_process'

import fs from 'fs-extra'
import split2 from 'split2'
import getPort from 'get-port'
import logger from '@wdio/logger'
import waitPort from 'wait-port'
import { start, download } from 'edgedriver'
import { SevereServiceError } from 'webdriverio'
import type { Options, Capabilities } from '@wdio/types'

import { pkg } from './constants.js'
import { getFilePath, isMultiremote, isEdge } from './utils.js'
import type { EdgedriverServiceOptions } from './types'

const POLL_INTERVAL = 100
const POLL_TIMEOUT = 10000

const log = logger('wdio-edgedriver-service')

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
            },
            ...(options || {})
        }
    }

    onPrepare () {
        return download(this.#options.edgedriverOptions?.edgeDriverVersion)
    }

    beforeSession (
        _: never,
        capabilities: Capabilities.Capabilities | Capabilities.MultiRemoteCapabilities,
        __: never,
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
         * update capability connection options to connect to EdgeDriver
         */
        this.#mapCapabilities(capabilities, baseUrl, port)

        this.#process = await start({ ...this.#options.edgedriverOptions, port, baseUrl })
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

        const { open } = await waitPort({
            timeout: POLL_TIMEOUT,
            interval: POLL_INTERVAL,
            port
        })
        if (!open) {
            throw new SevereServiceError('EdgeDriver failed to start.')
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
