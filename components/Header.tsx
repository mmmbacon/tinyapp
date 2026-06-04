import Link from "next/link";
import { logoutAction } from "@/app/actions/auth";

type HeaderProps = {
  email?: string | null;
};

export default function Header({ email }: HeaderProps) {
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
        <div className="d-flex align-items-center">
          <label className="form-label text-light me-2 mb-0 d-flex align-items-center">
            <PersonIcon />
            {email ? (
              <Link href="/urls" className="text-light ms-2">
                {email}
              </Link>
            ) : null}
          </label>
          {email ? (
            <form action={logoutAction}>
              <button className="btn btn-warning text-primary ms-2" type="submit">
                Logout
              </button>
            </form>
          ) : (
            <Link href="/login" className="btn btn-warning text-primary ms-2">
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}

function PersonIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="25"
      fill="currentColor"
      viewBox="0 0 16 16"
      aria-hidden
    >
      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
      <path
        fillRule="evenodd"
        d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
      />
    </svg>
  );
}
