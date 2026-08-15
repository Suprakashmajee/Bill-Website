import { useEffect } from 'react'
import { ADSENSE_CLIENT, ADSENSE_ENABLED } from '../adsense'

declare global {
  interface Window {
    adsbygoogle?: unknown[]
  }
}

interface AdSlotProps {
  slot?: string
  format?: string
  className?: string
}

/** Renders an AdSense unit once a real publisher id + slot are configured. */
export function AdSlot({ slot, format = 'auto', className = '' }: AdSlotProps) {
  useEffect(() => {
    if (!ADSENSE_ENABLED || !slot || ADSENSE_CLIENT.includes('PENDING')) return
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      // Ad blockers / missing script — ignore
    }
  }, [slot])

  if (!ADSENSE_ENABLED || !slot || ADSENSE_CLIENT.includes('PENDING')) {
    return null
  }

  return (
    <div className={`ad-slot ${className}`.trim()} aria-hidden>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
