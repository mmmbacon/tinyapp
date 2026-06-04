import Link from "next/link";

export default function HeaderMini() {
  return (
    <header>
      <nav className="navbar fixed-top navbar-dark bg-primary">
        <Link
          className="navbar-brand"
          href="/"
          style={{
            fontFamily: "'Fugaz One', cursive",
            textShadow: "3px 3px 5px rgba(0,0,0,0.2)",
            transform: "rotate(-5deg)",
          }}
        >
          <h1>TinyApp</h1>
        </Link>
      </nav>
    </header>
  );
}
