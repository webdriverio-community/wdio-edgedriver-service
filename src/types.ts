export interface EdgedriverServiceOptions {
    /**
     * Provide custom port for Edgeedriver. If not set a random
     * port is choosen.
     */
    port?: number

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
     * @default wdio-edgedriver.log
     */
    logFileName?: string

    /**
     * To use a custome chromedriver different than the one installed through "chromedriver npm module", provide the path.
     */
     edgedriverCustomPath?: string
}
