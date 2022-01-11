import { watchTask } from '../utils'
import { join } from 'path'
import { src, dest, watch, parallel, TaskFunction } from 'gulp'

const Shared = join(__dirname, '../../../shared/')
const Flow = join(__dirname, '../../../plugins/Flow')
const Encryption = join(__dirname, '../../../encryption')
const FileService = join(__dirname, '../../../plugins/FileService')

const CopyFileService = () => src('./src/**/*.png', { cwd: FileService }).pipe(dest('./dist', { cwd: FileService }))
const CopyShared = () => src('./src/**/*.png', { cwd: Shared }).pipe(dest('./dist', { cwd: Shared }))
const CopyFlow = () => src('./src/**/*.png', { cwd: Flow }).pipe(dest('./dist', { cwd: Flow }))
const CopyEncryption = () => src('./src/**/*.png', { cwd: Encryption }).pipe(dest('./dist', { cwd: Encryption }))

export const resourceCopy: TaskFunction = parallel(CopyShared, CopyFlow, CopyFileService, CopyEncryption)
export function resourceCopyWatch() {
    watch('./src/**/*.png', { cwd: FileService }, CopyFileService)
    watch('./src/**/*.png', { cwd: Flow }, CopyFlow)
    watch('./src/**/*.png', { cwd: Encryption }, CopyEncryption)
    return watch('./src/**/*.png', { cwd: Shared }, CopyShared)
}
watchTask(resourceCopy, resourceCopyWatch, 'resource-copy', 'Copy resources')
