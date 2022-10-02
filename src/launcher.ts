import fsp from 'node:fs/promises'
import cp, { ChildProcess } from 'child_process'

import fs from 'fs-extra'
import split2 from 'split2'
import getPort from 'get-port'
import msedgedriver from 'msedgedriver'
import logger from '@wdio/logger'
import type { Options, Capabilities } from '@wdio/types'

import { pkg } from './constants.js'
import { getFilePath, isMultiremote, isEdge } from './utils.js'
import type { EdgedriverServiceOptions } from './types'

export const DEFAULT_PATH = '/'
export const DEFAULT_LOG_FILENAME = 'wdio-edgedriver.log'

const log = logger('chromedriver')

export default class EdgedriverLauncher {
    private process?: ChildProcess

    constructor (
        private options: EdgedriverServiceOptions,
        private capabilities: Capabilities.Capabilities,
        private config: Options.Testrunner
    ) {
        log.info(`Initiate Edgedriver Launcher (v${pkg.version})`)
    }

    onPrepare () {
        return this._startDriver()
    }

    onComplete () {
        return this._stopDriver()
    }

    async #exist (filePath: string) {
        return fsp.access(filePath)
            .then(() => true, () => false)
    }

    async _startDriver () {
        const isChromiumEdge = (
            await this.#exist('c:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe') ||
            await this.#exist('c:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe')
        )

        const outputDir = this.options.outputDir || this.config.outputDir
        const logfileName = this.options.logFileName || DEFAULT_LOG_FILENAME
        const args = this.options.args || []
        const path = this.options.path || DEFAULT_PATH
        const port = (
            this.options.port ||
            await getPort()
        )

        args.push(`--port=${port}`)

        /**
         * update capability connection options to connect
         * to chromedriver
         */
        this._mapCapabilities(path, port)

        if (outputDir) {
            const logFile = getFilePath(outputDir, logfileName)
            await fs.ensureFile(logFile)
            args.push(`--log-path=${logFile}`, '--verbose')
        }

        const driverPath = this.options.edgedriverCustomPath || msedgedriver.path
        log.info(`Start Edgedriver (${driverPath}) with args ${args.join(' ')}`)
        this.process = cp.spawn(driverPath, args)
        log.info(`Edgedriver started on pid ${this.process.pid}`)

        if (typeof this.options.outputDir !== 'string') {
            this.process.stdout?.pipe(split2()).on('data', log.info)
            this.process.stderr?.pipe(split2()).on('data', log.warn)
        }

        process.on('exit', this._stopDriver.bind(this))
        process.on('SIGINT', this._stopDriver.bind(this))
        process.on('uncaughtException', this._stopDriver.bind(this))
    }

    _stopDriver () {
        if (this.process) {
            this.process.kill()
        }
    }

    _mapCapabilities (path: string, port: number) {
        if (isMultiremote(this.capabilities)) {
            for (const cap in this.capabilities) {
                if (isEdge((this.capabilities as Capabilities.MultiRemoteCapabilities)[cap].capabilities as Capabilities.Capabilities)) {
                    Object.assign((this.capabilities as Capabilities.MultiRemoteCapabilities)[cap], { port, path })
                }
            }
        } else {
            for (const cap of (this.capabilities as Capabilities.DesiredCapabilities[])) {
                if (isEdge(cap)) {
                    Object.assign(cap, { port, path })
                }
            }
        }
    }
}
