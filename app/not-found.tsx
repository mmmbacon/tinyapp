import Link from "next/link";
import HeaderMini from "@/components/HeaderMini";

export default function NotFound() {
  return (
    <>
      <HeaderMini />
      <main className="container text-center" style={{ marginTop: 125 }}>
        <h1 className="title">404</h1>
        <p className="subtitle">Page not found</p>
        <Link href="/" className="btn btn-primary">
          Go home
        </Link>
      </main>
    </>
  );
}
