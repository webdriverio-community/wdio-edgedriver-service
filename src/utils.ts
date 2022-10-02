import path from 'node:path'
import type { Capabilities, Options } from '@wdio/types'

/**
 * Resolves the given path into a absolute path and appends the default filename as fallback when the provided path is a directory.
 * @param  {String} logPath         relative file or directory path
 * @param  {String} defaultFilename default file name when filePath is a directory
 * @return {String}                 absolute file path
 */
export function getFilePath(filePath: string, defaultFilename: string) {
    const FILE_EXTENSION_REGEX = /\.[0-9a-z]+$/i
    let absolutePath = path.resolve(filePath)
    if (!FILE_EXTENSION_REGEX.test(path.basename(absolutePath))) {
        absolutePath = path.join(absolutePath, defaultFilename)
    }
    return absolutePath
}

export const isMultiremote = (obj: Capabilities.Capabilities | Capabilities.MultiRemoteCapabilities) => {
    return (
        typeof obj === 'object' &&
        (Object.values((obj as Capabilities.MultiRemoteCapabilities))[0] as Options.Testrunner).capabilities
    )
}

export const isEdge = (capabilities: Capabilities.Capabilities | Capabilities.MultiRemoteCapabilities) => {
    const cap = capabilities as Capabilities.Capabilities
    const mcap = capabilities as Capabilities.MultiRemoteCapabilities
    if (cap.browserName && cap.browserName.toLowerCase().includes('edge')) {
        return true
    }

    for (const c in mcap) {
        const browserName = (mcap[c].capabilities as Capabilities.Capabilities).browserName
        if (browserName && browserName.includes('edge')) {
            return true
        }
    }

    return false
}
