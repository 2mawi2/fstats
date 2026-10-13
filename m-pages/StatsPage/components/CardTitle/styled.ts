import { HEADER_HEIGHT } from '../../actions'

export const ui = () => {
  return {
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 1,
      // Fixed like the preview headers, so the titles line up when switching views
      height: HEADER_HEIGHT,
      mb: 1,
    },
    title: {
      fontWeight: 'medium',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    // Same as the currency chip of the preview sections
    chip: {
      display: 'inline-block',
      ml: 1,
      px: 0.75,
      border: 1,
      borderColor: 'divider',
      borderRadius: '10px',
      fontSize: 11,
      fontWeight: 400,
      lineHeight: '18px',
      verticalAlign: 'middle',
      color: 'text.secondary',
    },
    caption: {
      ml: 1,
      fontSize: 12,
      fontWeight: 400,
      color: 'text.secondary',
    },
  }
}
