export function ContentBand() {
  return (
    <section className="content-band">
      <h2 id="how-to">Free Invoice Generator</h2>
      <p>
        Bill Store is a free online invoice maker for freelancers, shops, and small businesses.
        Create professional invoices in your browser, customize every line, and download a polished
        PDF — no signup required.
      </p>

      <h3>How to make an invoice</h3>
      <ol>
        <li>Enter your business details and your customer’s billing information.</li>
        <li>Add an invoice number, date, due date, and payment terms.</li>
        <li>List line items with quantities, rates, tax, discounts, and shipping as needed.</li>
        <li>Review the balance due and download your invoice as a free PDF.</li>
      </ol>

      <h3>When to use an invoice</h3>
      <p>
        Use invoices whenever you bill for products or services. Keep payment terms clear, include
        a due date, and record any amount already paid so the balance due stays accurate.
      </p>

      <div className="faq" id="faq">
        <h3>Invoice FAQ</h3>
        <details open>
          <summary>Is Bill Store’s invoice generator free?</summary>
          <p>Yes. Create and download invoice PDFs for free with no account required.</p>
        </details>
        <details>
          <summary>Can I customize the invoice template?</summary>
          <p>
            Yes. Add your logo, choose a currency and accent color, edit line items, and adjust tax,
            discount, and shipping before downloading the PDF.
          </p>
        </details>
        <details>
          <summary>What is the difference between an invoice and a receipt?</summary>
          <p>
            An invoice requests payment; a receipt confirms payment was received. Use this generator
            to bill clients, then mark amount paid when funds arrive.
          </p>
        </details>
        <details>
          <summary>Does my invoice data leave my browser?</summary>
          <p>
            Invoice editing and PDF generation happen in your browser. Your draft stays on your
            device unless you choose to share the downloaded file yourself.
          </p>
        </details>
      </div>
    </section>
  )
}
