import { setCustomParsers } from '@/utils/Parser'

import { getCustomParsers } from '../api'

/**
 * Registers the stored custom parsers for parsing, before files are parsed or shown.
 */
export const loadCustomParsers = async () => {
  setCustomParsers(await getCustomParsers())
}
