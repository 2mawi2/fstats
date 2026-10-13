/**
 * Prefix all types with "RDZ" = react-dropzone
 */
import type { FileWithPath } from 'react-dropzone'
import { z } from 'zod'

export const zRDZFileWithPath = z.custom<FileWithPath>((val) => {
  return typeof File !== 'undefined' && val instanceof File
})

export type RDZFileWithPath = z.infer<typeof zRDZFileWithPath>
