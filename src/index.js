const fs = require('fs-extra');
const path = require('path');
const getPort = require('get-port');

/**
 * Resolves the given path into a absolute path and appends the default filename as fallback when the provided path is a directory.
 * @param  {String} logPath         relative file or directory path
 * @param  {String} defaultFilename default file name when filePath is a directory
 * @return {String}                 absolute file path
 */
function getFilePath(filePath, defaultFilename) {
    const FILE_EXTENSION_REGEX = /\.[0-9a-z]+$/i;
    let absolutePath = path.resolve(filePath);
    if (!FILE_EXTENSION_REGEX.test(path.basename(absolutePath))) {
        absolutePath = path.join(absolutePath, defaultFilename);
    }
    return absolutePath;
}

exports.default = class EdgeService {
    async onPrepare(config, capabilities) {
        if (config.edgeDriverPersistent) {
            await this._startDriver(config);
            capabilities.forEach(c => {
                if (c.browserName.match(/MicrosoftEdge/i)) {
                    c.port = config.port;
                }
            });
        };
    }

    onComplete(exitCode, config) {
        if (config.edgeDriverPersistent) {
            this._stopDriver();
        }
    }

    async beforeSession(config) {
        if (!config.edgeDriverPersistent) {
            await this._startDriver(config);
        }
    }

    afterSession(config) {
        if (!config.edgeDriverPersistent) {
            this._stopDriver();
        }
    }

    async _startDriver(config) {
        let edgeDriverArgs = config.edgeDriverArgs || [];
        let edgeDriverLogs = config.edgeDriverLogs;
        const isChromiumEdge = fs.existsSync('c:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe') ||
            fs.existsSync('c:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe');

        if (config.edgeDriverRandomPort !== false) {
            config.port = await getPort();
        }

        edgeDriverArgs.push(`--port=${config.port}`);

        let options = {};
        let callback;
        if (typeof edgeDriverLogs === 'string') {
            const DEFAULT_LOG_FILENAME = `EdgeDriver-${config.port}.log`
            const logFile = getFilePath(edgeDriverLogs, DEFAULT_LOG_FILENAME);
            fs.ensureFileSync(logFile);
            if (isChromiumEdge) {
                edgeDriverArgs.push(`--log-path=${logFile}`)
            } else {
                options.maxBuffer = 10 * 1024 * 1024;
                callback = function (error, stdout, stderr) {
                    fs.writeFileSync(logFile, stdout);
                };
            }
        }

        const serverPath = process.platform === 'win32' ?
            (isChromiumEdge ? require('msedgedriver').path : 'MicrosoftWebDriver.exe') :
            'msedgedriver';
        this.process = require('child_process').execFile(serverPath, edgeDriverArgs, options, callback);
    }

    _stopDriver() {
        if (this.process !== null) {
            this.process.kill();
            this.process = null;
        }
    }
}

exports.launcher = exports.default