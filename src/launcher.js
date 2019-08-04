import fs from 'fs-extra'
import EdgeDriver from './edgedriver'

import getFilePath from './utils/getFilePath'

const DEFAULT_LOG_FILENAME = 'EdgeDriver.txt'

export default class EdgeDriverLauncher {
    constructor () {
        this.edgeDriverLogs = null
        this.edgeDriverArgs = null
        this.logToStdout = false

        return this
    }

    onPrepare (config) {
        this.edgeDriverArgs = config.edgeDriverArgs || []
        this.edgeDriverLogs = config.edgeDriverLogs

        if (!this.edgeDriverArgs.find(arg => arg.startsWith('--port')) && config.port) {
            this.edgeDriverArgs.push(`--port=${config.port}`)
        }

        this.process = EdgeDriver.start(this.edgeDriverArgs)

        if (typeof this.edgeDriverLogs === 'string') {
            this._redirectLogStream()
        }
    }

    onComplete () {
        EdgeDriver.stop()
    }

    _redirectLogStream () {
        const logFile = getFilePath(this.edgeDriverLogs, DEFAULT_LOG_FILENAME)

        // ensure file & directory exists
        fs.ensureFileSync(logFile)

        const logStream = fs.createWriteStream(logFile, { flags: 'w' })
        this.process.stdout.pipe(logStream)
        this.process.stderr.pipe(logStream)
    }
}
