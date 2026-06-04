import Link from "next/link";
import { auth } from "@/auth";
import SocialMedia from "@/components/SocialMedia";
import ShortenForm from "@/components/ShortenForm";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await auth();
  const loggedIn = !!session?.user;

  return (
    <>
      <SocialMedia
        loggedIn={loggedIn}
        email={session?.user?.email}
      />
      <main>
        <div
          className="container d-flex justify-content-center align-items-center"
          style={{ height: "100vh" }}
        >
          <div className="row">
            <div className="col d-flex flex-column align-items-center hero-wrap">
              <div className="col d-flex flex-column align-items-center bg-primary text-light hero-card position-relative">
                <div style={{ height: 75 }} />
                <h1 className="position-absolute text-center px-4 title title-animated hero-title">
                  TinyApp
                </h1>
                <h4 className="mb-3 subtitle">The Tiny URL Shortener</h4>
                {loggedIn ? (
                  <ShortenForm />
                ) : (
                  <>
                    <div className="d-flex flex-column align-items-center gap-2">
                      <Link
                        className="btn btn-warning text-primary"
                        href="/login"
                        role="button"
                      >
                        Login
                      </Link>
                      <Link
                        className="btn btn-warning text-primary"
                        href="/register"
                        role="button"
                      >
                        Register
                      </Link>
                    </div>
                    <p className="mb-0">
                      <small>
                        <Link href="/privacy" className="text-light">
                          -&gt; Read the privacy policy
                        </Link>
                      </small>
                    </p>
                  </>
                )}
              </div>
              <div className="text-end text-primary quip">
                <i>it&apos;s so tiny!</i>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
