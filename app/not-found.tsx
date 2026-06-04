import Link from "next/link";
import Header from "@/components/Header";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="container text-center tiny-page pt-4">
        <h1 className="title">404</h1>
        <p className="subtitle">Page not found</p>
        <Link href="/" className="btn btn-tiny">
          Go home
        </Link>
      </main>
    </>
  );
}
