import { Capabilities } from '@wdio/types'

export interface EdgedriverServiceOptions {
    /**
     * The path on which the driver should run on
     */
    path?: string

    /**
     * Arguments passed to edgedriver executable.
     * Note: Do not specify port here, use `port` config option instead.
     * @example ['--verbose']
     */
    args?: string[]

    /**
     * Location of edgedriver logs.
     */
    outputDir?: string

    /**
     * The name of the log file to be written in `outputDir`.
     * @param {Capabilities.Capabilities} caps  capabilities to be used for the session
     * @param {string}                    cid   worker id
     */
    logFileName?: (caps: Capabilities.Capabilities, cid: string) => string

    /**
     * To use a custome chromedriver different than the one installed through "chromedriver npm module", provide the path.
     */
     edgedriverCustomPath?: string
}
