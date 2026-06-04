import { getUrlsForUser } from "@/lib/urls";
import { getOrCreateBrowserUserId } from "@/lib/users";
import Header from "@/components/Header";
import Alert from "@/components/Alert";
import UrlTable from "@/components/UrlTable";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function UrlsPage({ searchParams }: PageProps) {
  const userId = await getOrCreateBrowserUserId();
  const urls = await getUrlsForUser(userId);
  const params = await searchParams;

  const message = params.error ? decodeURIComponent(params.error) : "";

  return (
    <>
      <Header />
      <main className="tiny-page">
        <Alert success={!params.error} message={message} />
        <h3 className="m-4 fw-light">My URLs</h3>
        <div className="tiny-panel mx-3 mb-4">
          <UrlTable urls={urls} />
        </div>
      </main>
    </>
  );
}
