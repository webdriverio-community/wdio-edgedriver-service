import path from 'node:path'
import type { Capabilities } from '@wdio/types'

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

export const isMultiremote = (obj: Capabilities.Capabilities) => typeof obj === 'object' && !Array.isArray(obj)
export const isEdge = (cap: Capabilities.Capabilities) => cap.browserName && cap.browserName.toLowerCase().includes('edge')
