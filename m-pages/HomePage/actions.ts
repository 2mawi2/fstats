import { LockOutlined, PersonOffOutlined, Public } from '@mui/icons-material'

export const CARD_ITEMS = [
  {
    Icon: LockOutlined,
    key: 'ON_DEVICE',
  },
  {
    Icon: Public,
    key: 'IN_BROWSER',
  },
  {
    Icon: PersonOffOutlined,
    key: 'NO_ACCOUNT',
  },
] as const

export const STEPS = [
  {
    step: 1,
    key: 'ADD_FILES',
  },
  {
    step: 2,
    key: 'CONTINUE',
  },
  {
    step: 3,
    key: 'VIEW_STATS',
  },
] as const
