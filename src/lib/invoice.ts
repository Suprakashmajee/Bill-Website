import type { AdjustmentMode, InvoiceData, InvoiceTotals, LineItem } from '../types'

export const CURRENCIES = [
  'USD', 'EUR', 'GBP', 'INR', 'AUD', 'CAD', 'JPY', 'CNY', 'CHF', 'SEK',
  'NZD', 'SGD', 'HKD', 'NOK', 'KRW', 'TRY', 'RUB', 'BRL', 'ZAR', 'MXN',
  'AED', 'SAR', 'DKK', 'PLN', 'THB', 'IDR', 'MYR', 'PHP', 'VND', 'PKR',
  'BDT', 'EGP', 'NGN', 'KES', 'GHS', 'ILS', 'CZK', 'HUF', 'RON', 'CLP',
  'COP', 'ARS', 'PEN', 'TWD', 'QAR', 'KWD', 'BHD', 'OMR', 'LKR', 'NPR',
] as const

export const ACCENT_PRESETS = [
  '#0F766E',
  '#1D4ED8',
  '#B45309',
  '#BE123C',
  '#4338CA',
  '#0F172A',
  '#047857',
  '#C2410C',
]

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function dueInDays(days: number) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export function createLineItem(partial?: Partial<LineItem>): LineItem {
  return {
    id: crypto.randomUUID(),
    description: '',
    quantity: 1,
    rate: 0,
    ...partial,
  }
}

export function createDefaultInvoice(): InvoiceData {
  return {
    from: '',
    billTo: '',
    shipTo: '',
    invoiceNumber: '1',
    date: todayISO(),
    paymentTerms: 'Net 30',
    dueDate: dueInDays(30),
    poNumber: '',
    items: [createLineItem(), createLineItem(), createLineItem()],
    notes: '',
    terms: '',
    taxMode: 'off',
    taxValue: 0,
    discountMode: 'off',
    discountValue: 0,
    shippingMode: 'off',
    shippingValue: 0,
    amountPaid: 0,
    currency: 'USD',
    accentColor: '#0F766E',
    logoDataUrl: null,
    labels: {
      invoice: 'INVOICE',
      billTo: 'Bill To',
      shipTo: 'Ship To',
      date: 'Date',
      paymentTerms: 'Payment Terms',
      dueDate: 'Due Date',
      poNumber: 'PO Number',
      item: 'Item',
      quantity: 'Quantity',
      rate: 'Rate',
      amount: 'Amount',
      notes: 'Notes',
      terms: 'Terms',
      subtotal: 'Subtotal',
      tax: 'Tax',
      discount: 'Discount',
      shipping: 'Shipping',
      total: 'Total',
      amountPaid: 'Amount Paid',
      balanceDue: 'Balance Due',
    },
  }
}

function calcAdjustment(mode: AdjustmentMode, value: number, base: number) {
  if (mode === 'off' || !value) return 0
  if (mode === 'percent') return (base * value) / 100
  return value
}

export function calculateTotals(invoice: InvoiceData): InvoiceTotals {
  const subtotal = invoice.items.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.rate) || 0),
    0,
  )
  const discount = calcAdjustment(invoice.discountMode, invoice.discountValue, subtotal)
  const afterDiscount = Math.max(subtotal - discount, 0)
  const tax = calcAdjustment(invoice.taxMode, invoice.taxValue, afterDiscount)
  const shipping = invoice.shippingMode === 'off' ? 0 : Number(invoice.shippingValue) || 0
  const total = afterDiscount + tax + shipping
  const balanceDue = Math.max(total - (Number(invoice.amountPaid) || 0), 0)

  return { subtotal, discount, tax, shipping, total, balanceDue }
}

export function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount || 0)
  } catch {
    return `${currency} ${(amount || 0).toFixed(2)}`
  }
}

export function currencySymbol(currency: string) {
  try {
    const parts = new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      currencyDisplay: 'narrowSymbol',
    }).formatToParts(0)
    return parts.find((p) => p.type === 'currency')?.value ?? currency
  } catch {
    return currency
  }
}
