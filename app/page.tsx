import Link from "next/link";
import SocialMedia from "@/components/SocialMedia";
import ShortenForm from "@/components/ShortenForm";

export default function HomePage() {
  return (
    <>
      <main className="home-page position-relative">
        <Link href="/urls" className="home-my-urls">
          My URLs
        </Link>
        <div
          className="container d-flex justify-content-center align-items-center"
          style={{ height: "100vh" }}
        >
          <div className="row">
            <div className="col d-flex flex-column align-items-center hero-wrap">
              <div className="col d-flex flex-column align-items-center hero-card position-relative">
                <div className="hero-header text-center w-100">
                  <div className="hero-title-wrap">
                    <h1 className="title title-rotated hero-title">TinyApp</h1>
                    <span className="quip title-rotated">
                      &ldquo;its so cute!&rdquo;
                    </span>
                  </div>
                  <h4 className="hero-tagline">The Tiny URL Shortener</h4>
                </div>
                <ShortenForm />
                <SocialMedia />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
