export function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a className="brand" href="https://bill-store.com/" aria-label="Bill Store home">
          <span className="brand__mark" aria-hidden>
            B
          </span>
          <span className="brand__name">
            Bill <span>Store</span>
          </span>
        </a>
        <nav className="header-nav" aria-label="Primary">
          <a href="#how-to">How it works</a>
          <a href="#faq">FAQ</a>
          <a href="#support">Support</a>
          <a className="btn btn-primary" href="#invoice">
            Create Invoice
          </a>
        </nav>
      </div>
    </header>
  )
}
