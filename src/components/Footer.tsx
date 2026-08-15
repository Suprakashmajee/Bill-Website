export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div>© {new Date().getFullYear()} Bill Store · bill-store.com</div>
        <div>
          <a href="#support">Support</a>
          {' · '}
          <a href="mailto:support@bill-store.com">support@bill-store.com</a>
          {' · '}
          <a href="/privacy.html">Privacy</a>
        </div>
      </div>
    </footer>
  )
}
