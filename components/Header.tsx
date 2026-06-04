import Link from "next/link";

export default function Header() {
  return (
    <header>
      <nav className="navbar tiny-nav">
        <Link
          className="navbar-brand ms-3 me-4 title title-rotated tiny-nav-brand"
          href="/"
        >
          <h1>TinyApp</h1>
        </Link>
      </nav>
    </header>
  );
}
