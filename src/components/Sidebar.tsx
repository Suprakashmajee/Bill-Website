import { ACCENT_PRESETS, CURRENCIES } from '../lib/invoice'

interface SidebarProps {
  currency: string
  accentColor: string
  downloading: boolean
  onCurrencyChange: (currency: string) => void
  onAccentChange: (color: string) => void
  onDownload: () => void
  onReset: () => void
}

export function Sidebar({
  currency,
  accentColor,
  downloading,
  onCurrencyChange,
  onAccentChange,
  onDownload,
  onReset,
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-card">
        <button className="btn btn-primary" style={{ width: '100%' }} onClick={onDownload} disabled={downloading}>
          {downloading ? 'Preparing PDF…' : 'Download Invoice'}
        </button>
        <button className="btn btn-ghost" style={{ width: '100%', marginTop: '0.55rem' }} onClick={onReset}>
          Reset
        </button>
      </div>

      <div className="sidebar-card">
        <h3>Currency</h3>
        <label htmlFor="currency">Invoice currency</label>
        <select
          id="currency"
          value={currency}
          onChange={(e) => onCurrencyChange(e.target.value)}
        >
          {CURRENCIES.map((code) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </select>
      </div>

      <div className="sidebar-card">
        <h3>Accent color</h3>
        <label htmlFor="accent">Header & totals</label>
        <input
          id="accent"
          type="color"
          value={accentColor}
          onChange={(e) => onAccentChange(e.target.value)}
        />
        <div className="color-row" role="list">
          {ACCENT_PRESETS.map((color) => (
            <button
              key={color}
              type="button"
              className={`swatch${accentColor.toLowerCase() === color.toLowerCase() ? ' active' : ''}`}
              style={{ background: color }}
              aria-label={`Use accent ${color}`}
              onClick={() => onAccentChange(color)}
            />
          ))}
        </div>
      </div>
    </aside>
  )
}
