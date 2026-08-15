export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div>© {new Date().getFullYear()} Bill Store · bill-store.com</div>
        <div>
          <a href="/privacy.html">Privacy</a>
          {' · '}
          Free invoice generator for modern businesses
        </div>
      </div>
    </footer>
  )
}

