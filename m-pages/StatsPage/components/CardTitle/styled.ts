import { HEADER_HEIGHT } from '../../actions'

export const ui = () => {
  return {
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 1,
      minHeight: HEADER_HEIGHT,
      mb: 1,
    },
    title: {
      fontWeight: 'medium',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    caption: {
      ml: 1,
      fontSize: 12,
      fontWeight: 400,
      color: 'text.secondary',
    },
  }
}
