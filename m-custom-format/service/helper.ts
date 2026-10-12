import type { CustomFormat } from '@/types'
import { isParsed, isUnknown, reparseFiles } from '@/m-stats-file/service'
import { isParserOfCustomFormat, setCustomBanks, toCustomBank } from '@/utils/Parser'

import { addCustomFormat, getCustomFormats, removeCustomFormat } from '../api'

/**
 * Reads the stored custom formats and makes their parsers available. Must run before files are parsed or displayed.
 */
export const loadCustomFormats = async (): Promise<CustomFormat[]> => {
  const formats = await getCustomFormats()
  setCustomBanks(formats.map(toCustomBank))
  return formats
}

/**
 * Unsupported files are re-parsed, so files of the new format are picked up.
 */
export const saveCustomFormat = async (format: CustomFormat) => {
  await addCustomFormat(format)
  await loadCustomFormats()
  await reparseFiles(isUnknown)
}

/**
 * Files of the format are re-parsed, so they become unsupported.
 */
export const deleteCustomFormat = async (format: CustomFormat) => {
  await removeCustomFormat(format.id)
  await loadCustomFormats()
  await reparseFiles(
    (file) => isParsed(file) && file.sections.some((section) => isParserOfCustomFormat(section.parserId, format)),
  )
}
