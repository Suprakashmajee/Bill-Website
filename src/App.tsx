import { useRef, useState } from 'react'
import { AdSenseScript } from './components/AdSenseScript'
import { ContentBand } from './components/ContentBand'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { InvoiceEditor } from './components/InvoiceEditor'
import { Sidebar } from './components/Sidebar'
import { SupportSection } from './components/SupportSection'
import { useInvoice } from './hooks/useInvoice'
import { downloadInvoicePdf } from './lib/pdf'
import './index.css'

export default function App() {
  const {
    invoice,
    totals,
    update,
    updateItem,
    addItem,
    removeItem,
    setAdjustment,
    setLogo,
    reset,
  } = useInvoice()

  const paperRef = useRef<HTMLElement>(null)
  const [downloading, setDownloading] = useState(false)

  const persistInvoice = async () => {
    try {
      await fetch('/api/save-invoice.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...invoice,
          subtotal: totals.subtotal,
          total: totals.total,
          balanceDue: totals.balanceDue,
        }),
      })
    } catch {
      // Saving is optional — PDF download should still succeed offline.
    }
  }

  const handleDownload = async () => {
    if (!paperRef.current || downloading) return
    setDownloading(true)
    try {
      await persistInvoice()
      const name = `invoice-${invoice.invoiceNumber || 'bill-store'}.pdf`
      await downloadInvoicePdf(paperRef.current, name)
    } catch (error) {
      console.error(error)
      window.alert('Could not generate the PDF. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="app-shell">
      <AdSenseScript />
      <Header />

      <main>
        <div className="workspace">
          <InvoiceEditor
            invoice={invoice}
            totals={totals}
            paperRef={paperRef}
            onUpdate={update}
            onUpdateItem={updateItem}
            onAddItem={addItem}
            onRemoveItem={removeItem}
            onSetAdjustment={setAdjustment}
            onSetLogo={setLogo}
          />
          <Sidebar
            currency={invoice.currency}
            accentColor={invoice.accentColor}
            downloading={downloading}
            onCurrencyChange={(currency) => update('currency', currency)}
            onAccentChange={(color) => update('accentColor', color)}
            onDownload={handleDownload}
            onReset={reset}
          />
        </div>

        <ContentBand />
        <SupportSection />
      </main>

      <Footer />

      <div className="mobile-download">
        <button className="btn btn-primary" onClick={handleDownload} disabled={downloading}>
          {downloading ? 'Preparing PDF…' : 'Download Invoice'}
        </button>
      </div>
    </div>
  )
}
