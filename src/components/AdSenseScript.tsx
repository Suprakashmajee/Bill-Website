import { useEffect } from 'react'
import { ADSENSE_CLIENT, ADSENSE_ENABLED } from '../adsense'

/** Injects the official AdSense bootstrap script once when enabled. */
export function AdSenseScript() {
  useEffect(() => {
    if (!ADSENSE_ENABLED || ADSENSE_CLIENT.includes('PENDING')) return
    if (document.querySelector('script[data-billstore-adsense]')) return

    const script = document.createElement('script')
    script.async = true
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`
    script.crossOrigin = 'anonymous'
    script.dataset.billstoreAdsense = 'true'
    document.head.appendChild(script)
  }, [])

  return null
}
