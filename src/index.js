const fs = require('fs-extra');
const path = require('path');

const DEFAULT_LOG_FILENAME = 'EdgeDriver.txt'
const FILE_EXTENSION_REGEX = /\.[0-9a-z]+$/i

/**
 * Resolves the given path into a absolute path and appends the default filename as fallback when the provided path is a directory.
 * @param  {String} logPath         relative file or directory path
 * @param  {String} defaultFilename default file name when filePath is a directory
 * @return {String}                 absolute file path
 */
function getFilePath(filePath, defaultFilename) {
    let absolutePath = path.resolve(filePath)
    if (!FILE_EXTENSION_REGEX.test(path.basename(absolutePath))) {
        absolutePath = path.join(absolutePath, defaultFilename);
    }
    return absolutePath;
}

exports.default = class EdgeService {
    constructor() {
        this.edgeDriverLogs = null;
        this.edgeDriverArgs = null;
        this.logToStdout = false;
        return this;
    }

    onPrepare(config) {
        this.edgeDriverArgs = config.edgeDriverArgs || [];
        this.edgeDriverLogs = config.edgeDriverLogs;

        if (!this.edgeDriverArgs.find(arg => arg.startsWith('--port')) && config.port) {
            this.edgeDriverArgs.push(`--port=${config.port}`);
        }

        const path = process.platform === 'win32' ?
            (fs.existsSync('c:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe') ||
                fs.existsSync('c:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe') ? require('msedgedriver').path : 'MicrosoftWebDriver.exe') :
            'msedgedriver';

        this.process = require('child_process').execFile(path, this.edgeDriverArgs);

        if (typeof this.edgeDriverLogs === 'string') {
            this._redirectLogStream();
        }
    }

    onComplete() {
        if (this.process !== null) {
            this.process.kill();
        }
    }

    _redirectLogStream() {
        const logFile = getFilePath(this.edgeDriverLogs, DEFAULT_LOG_FILENAME);
        fs.ensureFileSync(logFile);
        const logStream = fs.createWriteStream(logFile, { flags: 'w' });
        this.process.stdout.pipe(logStream);
        this.process.stderr.pipe(logStream);
    }
}

exports.launcher = exports.default