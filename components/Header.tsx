import Link from "next/link";

export default function Header() {
  return (
    <header>
      <nav className="navbar navbar-expand-md navbar-dark bg-primary">
        <Link className="navbar-brand my-4 me-5 title title-rotated" href="/">
          <h1>TinyApp</h1>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <Link className="nav-item nav-link" href="/urls">
              My URLs
            </Link>
            <Link className="nav-item nav-link mb-4 mb-md-1" href="/urls/new">
              Create New URL
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
