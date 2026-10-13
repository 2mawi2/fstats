import { sxSubheaderText } from '@/styles/styled'

export const ui = () => {
  return {
    sidebar: {
      p: 1.5,
    },
    subheader: {
      px: 0.5,
      pt: 2,
      pb: 0.75,
      ...sxSubheaderText,
    },
  }
}
