import Link from "next/link";
import HeaderMini from "@/components/HeaderMini";
import PrivacyContent from "@/components/PrivacyContent";

export default function PrivacyPage() {
  return (
    <main>
      <HeaderMini />
      <section className="container">
        <div className="col" style={{ marginTop: 125 }}>
          <Link href="/">&lt;&lt; Back</Link>
        </div>
      </section>
      <PrivacyContent />
    </main>
  );
}
