import { ColorMode, Currency, DateFormat, UserLocale } from '@/types-enums'

export const MISC = {
  CENTER_DOT: '·',
  CENTER_DOT_XL: '•',
  M_DASH: '—',
  M_DASH_ALT: '–',
  GLASS_EFFECT: 0.8,
  MAX_UPLOAD_FILE_SIZE: 5 * 1024 * 1024,
  SYSTEM_DATE_FORMAT: DateFormat.YMD_DASH,
  DEFAULT_DATE_FORMAT: DateFormat.DMY_SLASH,
  DEFAULT_LOCALE: UserLocale.EN,
  DEFAULT_CURRENCY: Currency.EUR,
  DEFAULT_COLOR_MODE: ColorMode.SYSTEM,
  DEFAULT_PERSIST_DATA: false,
  LS_I18N_LOCALE_KEY: 'fstats__i18nextLng',
  LS_MUI_COLOR_MODE_KEY: 'fstats__mui-mode',
  LS_SELECTED_FILE_IDS_KEY: 'fstats__selected_file_ids',
  LS_SIDEBAR_EXPANDED_KEY: 'fstats__sidebar_expanded',
  SS_SESSION_KEY: 'fstats__session',
  USER_KEY: 'current_user',
} as const
