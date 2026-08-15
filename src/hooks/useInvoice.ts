import { useCallback, useMemo, useState } from 'react'
import {
  calculateTotals,
  createDefaultInvoice,
  createLineItem,
} from '../lib/invoice'
import type { AdjustmentMode, InvoiceData, LineItem } from '../types'

export function useInvoice() {
  const [invoice, setInvoice] = useState<InvoiceData>(() => createDefaultInvoice())

  const totals = useMemo(() => calculateTotals(invoice), [invoice])

  const update = useCallback(<K extends keyof InvoiceData>(key: K, value: InvoiceData[K]) => {
    setInvoice((prev) => ({ ...prev, [key]: value }))
  }, [])

  const updateLabel = useCallback((key: keyof InvoiceData['labels'], value: string) => {
    setInvoice((prev) => ({
      ...prev,
      labels: { ...prev.labels, [key]: value },
    }))
  }, [])

  const updateItem = useCallback((id: string, patch: Partial<LineItem>) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }))
  }, [])

  const addItem = useCallback(() => {
    setInvoice((prev) => ({
      ...prev,
      items: [...prev.items, createLineItem()],
    }))
  }, [])

  const removeItem = useCallback((id: string) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.length <= 1 ? prev.items : prev.items.filter((item) => item.id !== id),
    }))
  }, [])

  const setAdjustment = useCallback(
    (
      kind: 'tax' | 'discount' | 'shipping',
      mode: AdjustmentMode,
      value?: number,
    ) => {
      setInvoice((prev) => {
        if (kind === 'tax') {
          return {
            ...prev,
            taxMode: mode,
            taxValue: value ?? (mode === 'off' ? 0 : prev.taxValue || (mode === 'percent' ? 10 : 0)),
          }
        }
        if (kind === 'discount') {
          return {
            ...prev,
            discountMode: mode,
            discountValue:
              value ?? (mode === 'off' ? 0 : prev.discountValue || (mode === 'percent' ? 5 : 0)),
          }
        }
        return {
          ...prev,
          shippingMode: mode === 'percent' ? 'flat' : mode,
          shippingValue: value ?? (mode === 'off' ? 0 : prev.shippingValue || 0),
        }
      })
    },
    [],
  )

  const setLogo = useCallback((dataUrl: string | null) => {
    setInvoice((prev) => ({ ...prev, logoDataUrl: dataUrl }))
  }, [])

  const reset = useCallback(() => {
    setInvoice(createDefaultInvoice())
  }, [])

  return {
    invoice,
    totals,
    update,
    updateLabel,
    updateItem,
    addItem,
    removeItem,
    setAdjustment,
    setLogo,
    reset,
  }
}
