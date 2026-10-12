'use client'

import { Translate } from '@mui/icons-material'

import { UserLocale } from '@/types-enums'
import { useUserPreferences } from '@/hooks'
import { useTranslation } from '@/lib/i18n'

import OptionSwitcher from '../OptionSwitcher'

const LOCALES = [UserLocale.EN, UserLocale.DE]

type LanguageSwitcherProps = {
  showLabel?: boolean
}

const Component = ({ showLabel = false }: LanguageSwitcherProps) => {
  const { t, i18n } = useTranslation()
  const { setLocale } = useUserPreferences()
  const selectedLocale = i18n.language === UserLocale.DE ? UserLocale.DE.toUpperCase() : UserLocale.EN.toUpperCase()
  const activeLabel = t(`COMPONENTS.LANGUAGE_SWITCHER.LOCALE_${selectedLocale}_LANGUAGE_${selectedLocale}`)

  const onSelect = (locale: UserLocale) => {
    i18n.changeLanguage(locale)
    setLocale(locale)
  }

  return (
    <OptionSwitcher
      title={t('COMPONENTS.LANGUAGE_SWITCHER.CHANGE_LANGUAGE')}
      icon={<Translate color="secondary" sx={{ fontSize: 18 }} />}
      label={activeLabel}
      showLabel={showLabel}
      listSx={{ pt: 0 }}
      options={LOCALES.map((locale) => ({
        value: locale,
        primary: t(`COMPONENTS.LANGUAGE_SWITCHER.LOCALE_${locale.toUpperCase()}_LANGUAGE_${locale.toUpperCase()}`),
        secondary:
          i18n.language !== locale
            ? t(`COMPONENTS.LANGUAGE_SWITCHER.LOCALE_${locale.toUpperCase()}_LANGUAGE_${i18n.language.toUpperCase()}`)
            : '',
        checked: i18n.language === locale,
      }))}
      onSelect={onSelect}
    />
  )
}

export default Component
