'use client'

import { PageWrapper } from '@/components'
import { Hero } from '@/m-pages/HomePage/components'
import { useTranslation } from '@/lib/i18n'

const Component = () => {
  const { t } = useTranslation()

  return (
    <PageWrapper>
      <Hero
        titleKey="EMPTY_STATS_PAGE.TITLE"
        subtitle={t('EMPTY_STATS_PAGE.BLURB')}
        ctaLabel={t('EMPTY_STATS_PAGE.UPLOAD_FILES')}
        compact
      />
    </PageWrapper>
  )
}

export default Component
