import type { AdjustmentMode, InvoiceData, InvoiceTotals, LineItem } from '../types'
import { currencySymbol, formatMoney } from '../lib/invoice'

interface InvoiceEditorProps {
  invoice: InvoiceData
  totals: InvoiceTotals
  paperRef: React.RefObject<HTMLElement | null>
  onUpdate: <K extends keyof InvoiceData>(key: K, value: InvoiceData[K]) => void
  onUpdateItem: (id: string, patch: Partial<LineItem>) => void
  onAddItem: () => void
  onRemoveItem: (id: string) => void
  onSetAdjustment: (kind: 'tax' | 'discount' | 'shipping', mode: AdjustmentMode, value?: number) => void
  onSetLogo: (dataUrl: string | null) => void
}

export function InvoiceEditor({
  invoice,
  totals,
  paperRef,
  onUpdate,
  onUpdateItem,
  onAddItem,
  onRemoveItem,
  onSetAdjustment,
  onSetLogo,
}: InvoiceEditorProps) {
  const symbol = currencySymbol(invoice.currency)

  const handleLogo = (file: File | null) => {
    if (!file) return
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => onSetLogo(String(reader.result))
    reader.readAsDataURL(file)
  }

  return (
    <section id="invoice" className="invoice-paper" ref={paperRef as React.RefObject<HTMLElement>}>
      <div className="invoice-top">
        <div>
          <label className="logo-upload">
            {invoice.logoDataUrl ? (
              <img src={invoice.logoDataUrl} alt="Business logo" />
            ) : (
              <span>
                + Add Your Logo
                <br />
                <small>PNG, JPG, SVG</small>
              </span>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleLogo(e.target.files?.[0] ?? null)}
            />
          </label>
          {invoice.logoDataUrl ? (
            <div className="logo-actions">
              <button type="button" className="btn-linkish" onClick={() => onSetLogo(null)}>
                Remove logo
              </button>
            </div>
          ) : null}

          <div className="field-block" style={{ marginTop: '1rem' }}>
            <span className="field-label">From</span>
            <textarea
              className="ghost-textarea"
              rows={4}
              placeholder="Who is this from?"
              value={invoice.from}
              onChange={(e) => onUpdate('from', e.target.value)}
            />
          </div>
        </div>

        <div className="meta-grid">
          <h1 className="invoice-title" style={{ color: invoice.accentColor }}>
            {invoice.labels.invoice}
          </h1>

          <div className="meta-row">
            <label htmlFor="invoice-number">#</label>
            <input
              id="invoice-number"
              value={invoice.invoiceNumber}
              onChange={(e) => onUpdate('invoiceNumber', e.target.value)}
            />
          </div>
          <div className="meta-row">
            <label htmlFor="invoice-date">{invoice.labels.date}</label>
            <input
              id="invoice-date"
              type="date"
              value={invoice.date}
              onChange={(e) => onUpdate('date', e.target.value)}
            />
          </div>
          <div className="meta-row">
            <label htmlFor="payment-terms">{invoice.labels.paymentTerms}</label>
            <input
              id="payment-terms"
              value={invoice.paymentTerms}
              onChange={(e) => onUpdate('paymentTerms', e.target.value)}
            />
          </div>
          <div className="meta-row">
            <label htmlFor="due-date">{invoice.labels.dueDate}</label>
            <input
              id="due-date"
              type="date"
              value={invoice.dueDate}
              onChange={(e) => onUpdate('dueDate', e.target.value)}
            />
          </div>
          <div className="meta-row">
            <label htmlFor="po-number">{invoice.labels.poNumber}</label>
            <input
              id="po-number"
              value={invoice.poNumber}
              onChange={(e) => onUpdate('poNumber', e.target.value)}
            />
          </div>

          <div className="balance-chip" style={{ background: invoice.accentColor }}>
            <span>{invoice.labels.balanceDue}</span>
            <span>{formatMoney(totals.balanceDue, invoice.currency)}</span>
          </div>
        </div>
      </div>

      <div className="parties">
        <div className="field-block">
          <span className="field-label">{invoice.labels.billTo}</span>
          <textarea
            className="ghost-textarea"
            rows={4}
            placeholder="Who is this to?"
            value={invoice.billTo}
            onChange={(e) => onUpdate('billTo', e.target.value)}
          />
        </div>
        <div className="field-block">
          <span className="field-label">{invoice.labels.shipTo}</span>
          <textarea
            className="ghost-textarea"
            rows={4}
            placeholder="(optional)"
            value={invoice.shipTo}
            onChange={(e) => onUpdate('shipTo', e.target.value)}
          />
        </div>
      </div>

      <table className="items-table">
        <thead>
          <tr style={{ background: invoice.accentColor }}>
            <th>{invoice.labels.item}</th>
            <th className="col-qty">{invoice.labels.quantity}</th>
            <th className="col-rate">{invoice.labels.rate}</th>
            <th className="col-amount">{invoice.labels.amount}</th>
            <th className="col-actions" aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item) => {
            const amount = (Number(item.quantity) || 0) * (Number(item.rate) || 0)
            return (
              <tr key={item.id}>
                <td>
                  <input
                    placeholder="Description of item / service…"
                    value={item.description}
                    onChange={(e) => onUpdateItem(item.id, { description: e.target.value })}
                  />
                </td>
                <td className="col-qty">
                  <input
                    type="number"
                    min={0}
                    step="any"
                    value={item.quantity}
                    onChange={(e) => onUpdateItem(item.id, { quantity: Number(e.target.value) })}
                  />
                </td>
                <td className="col-rate">
                  <input
                    type="number"
                    min={0}
                    step="any"
                    value={item.rate}
                    onChange={(e) => onUpdateItem(item.id, { rate: Number(e.target.value) })}
                  />
                </td>
                <td className="col-amount">{formatMoney(amount, invoice.currency)}</td>
                <td className="col-actions">
                  <button
                    type="button"
                    className="icon-btn"
                    aria-label="Remove line item"
                    onClick={() => onRemoveItem(item.id)}
                  >
                    ×
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <button type="button" className="btn-linkish" onClick={onAddItem}>
        + Line Item
      </button>

      <div className="invoice-bottom">
        <div className="notes-block">
          <div className="field-block">
            <span className="field-label">{invoice.labels.notes}</span>
            <textarea
              className="ghost-textarea"
              placeholder="Notes — any relevant information not already covered"
              value={invoice.notes}
              onChange={(e) => onUpdate('notes', e.target.value)}
            />
          </div>
          <div className="field-block" style={{ marginTop: '0.85rem' }}>
            <span className="field-label">{invoice.labels.terms}</span>
            <textarea
              className="ghost-textarea"
              placeholder="Terms and conditions — late fees, payment methods, etc."
              value={invoice.terms}
              onChange={(e) => onUpdate('terms', e.target.value)}
            />
          </div>
        </div>

        <div className="totals">
          <div className="total-row">
            <span>{invoice.labels.subtotal}</span>
            <strong>{formatMoney(totals.subtotal, invoice.currency)}</strong>
          </div>

          <AdjustmentRow
            label={invoice.labels.discount}
            mode={invoice.discountMode}
            value={invoice.discountValue}
            amount={totals.discount}
            currency={invoice.currency}
            symbol={symbol}
            modes={['percent', 'flat', 'off']}
            onMode={(mode) => onSetAdjustment('discount', mode)}
            onValue={(value) => onSetAdjustment('discount', invoice.discountMode === 'off' ? 'percent' : invoice.discountMode, value)}
          />

          <AdjustmentRow
            label={invoice.labels.tax}
            mode={invoice.taxMode}
            value={invoice.taxValue}
            amount={totals.tax}
            currency={invoice.currency}
            symbol={symbol}
            modes={['percent', 'flat', 'off']}
            onMode={(mode) => onSetAdjustment('tax', mode)}
            onValue={(value) => onSetAdjustment('tax', invoice.taxMode === 'off' ? 'percent' : invoice.taxMode, value)}
          />

          <AdjustmentRow
            label={invoice.labels.shipping}
            mode={invoice.shippingMode}
            value={invoice.shippingValue}
            amount={totals.shipping}
            currency={invoice.currency}
            symbol={symbol}
            modes={['flat', 'off']}
            onMode={(mode) => onSetAdjustment('shipping', mode)}
            onValue={(value) => onSetAdjustment('shipping', invoice.shippingMode === 'off' ? 'flat' : invoice.shippingMode, value)}
          />

          <div className="total-row">
            <span>{invoice.labels.total}</span>
            <strong>{formatMoney(totals.total, invoice.currency)}</strong>
          </div>

          <div className="total-row">
            <span>{invoice.labels.amountPaid}</span>
            <input
              className="paid-input"
              type="number"
              min={0}
              step="any"
              value={invoice.amountPaid}
              onChange={(e) => onUpdate('amountPaid', Number(e.target.value))}
            />
          </div>

          <div className="total-row balance-row" style={{ background: invoice.accentColor }}>
            <span>{invoice.labels.balanceDue}</span>
            <strong>{formatMoney(totals.balanceDue, invoice.currency)}</strong>
          </div>
        </div>
      </div>
    </section>
  )
}

function AdjustmentRow({
  label,
  mode,
  value,
  amount,
  currency,
  symbol,
  modes,
  onMode,
  onValue,
}: {
  label: string
  mode: AdjustmentMode
  value: number
  amount: number
  currency: string
  symbol: string
  modes: AdjustmentMode[]
  onMode: (mode: AdjustmentMode) => void
  onValue: (value: number) => void
}) {
  return (
    <div>
      <div className="total-row">
        <span>{label}</span>
        <strong>{mode === 'off' ? formatMoney(0, currency) : formatMoney(amount, currency)}</strong>
      </div>
      <div className="adjustment-controls">
        {modes.includes('percent') ? (
          <button
            type="button"
            className={`chip${mode === 'percent' ? ' active' : ''}`}
            onClick={() => onMode('percent')}
          >
            %
          </button>
        ) : null}
        {modes.includes('flat') ? (
          <button
            type="button"
            className={`chip${mode === 'flat' ? ' active' : ''}`}
            onClick={() => onMode('flat')}
          >
            {symbol}
          </button>
        ) : null}
        <button
          type="button"
          className={`chip${mode === 'off' ? ' active' : ''}`}
          onClick={() => onMode('off')}
        >
          Off
        </button>
        {mode !== 'off' ? (
          <input
            className="adj-input"
            type="number"
            min={0}
            step="any"
            value={value}
            onChange={(e) => onValue(Number(e.target.value))}
            aria-label={`${label} value`}
          />
        ) : null}
      </div>
    </div>
  )
}
