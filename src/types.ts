export type AdjustmentMode = 'off' | 'percent' | 'flat'

export interface LineItem {
  id: string
  description: string
  quantity: number
  rate: number
}

export interface InvoiceData {
  from: string
  billTo: string
  shipTo: string
  invoiceNumber: string
  date: string
  paymentTerms: string
  dueDate: string
  poNumber: string
  items: LineItem[]
  notes: string
  terms: string
  taxMode: AdjustmentMode
  taxValue: number
  discountMode: AdjustmentMode
  discountValue: number
  shippingMode: AdjustmentMode
  shippingValue: number
  amountPaid: number
  currency: string
  accentColor: string
  logoDataUrl: string | null
  labels: {
    invoice: string
    billTo: string
    shipTo: string
    date: string
    paymentTerms: string
    dueDate: string
    poNumber: string
    item: string
    quantity: string
    rate: string
    amount: string
    notes: string
    terms: string
    subtotal: string
    tax: string
    discount: string
    shipping: string
    total: string
    amountPaid: string
    balanceDue: string
  }
}

export interface InvoiceTotals {
  subtotal: number
  discount: number
  tax: number
  shipping: number
  total: number
  balanceDue: number
}
