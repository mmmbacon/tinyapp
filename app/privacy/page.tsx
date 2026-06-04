import Link from "next/link";
import Header from "@/components/Header";
import PrivacyContent from "@/components/PrivacyContent";

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="tiny-page">
        <section className="container pt-3">
          <div className="col">
            <Link href="/" className="tiny-muted">
              &lt;&lt; Back
            </Link>
          </div>
        </section>
        <PrivacyContent />
      </main>
    </>
  );
}
