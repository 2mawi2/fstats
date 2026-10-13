'use client'

import type { PointerEvent, RefObject } from 'react'

/**
 * Pointer handler for a resize divider: reports how far the pointer moved since the drag started, in percent of the
 * container's size along `axis`, until the pointer is released.
 */
export const useResizeHandle = (containerRef: RefObject<HTMLElement | null>, axis: 'x' | 'y') => {
  return (onResize: (deltaPercent: number) => void) => (event: PointerEvent<HTMLElement>) => {
    const container = containerRef.current

    if (!container) {
      return
    }

    event.currentTarget.setPointerCapture(event.pointerId)
    const getPosition = (e: { clientX: number; clientY: number }) => (axis === 'x' ? e.clientX : e.clientY)
    const start = getPosition(event)
    const rect = container.getBoundingClientRect()
    const size = axis === 'x' ? rect.width : rect.height

    const onMove = (moveEvent: globalThis.PointerEvent) => {
      onResize(((getPosition(moveEvent) - start) / size) * 100)
    }

    const onUp = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }
}
