import { CONFIG } from '@/common'

type LogCategory = 'warn' | 'info' | 'success' | 'error'

const COLORS: Record<LogCategory, string> = {
  info: '#2196f3',
  success: '#26c281',
  warn: '#ff9800',
  error: '#d32f2f',
}

const METHODS: Record<LogCategory, 'info' | 'warn' | 'error'> = {
  info: 'info',
  success: 'info',
  warn: 'warn',
  error: 'error',
}

export const logger = (category: LogCategory, group: string, ...message: any[]) => {
  if (!CONFIG.ENABLE_CONSOLE_LOGGING) {
    return
  }

  console[METHODS[category]](
    `%c${group}`,
    `color: white; background-color: ${COLORS[category]}; padding: 2px 5px; border-radius: 2px`,
    ...message,
  )
}
