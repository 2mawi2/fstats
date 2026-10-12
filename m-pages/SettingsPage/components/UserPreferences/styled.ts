import { sxTile } from '@/styles/styled'

export const ui = () => {
  return {
    tiles: {
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
      gap: 2,
    },

    tile: sxTile(),

    tileHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      mb: 1,
    },

    tileTitle: {
      fontWeight: 600,
      color: 'text.primary',
    },

    value: {
      fontSize: 16,
      color: 'secondary.main',
    },
  }
}
