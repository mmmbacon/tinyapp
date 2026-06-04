import { getUrlsForUser } from "@/lib/urls";
import { getOrCreateDefaultUserId } from "@/lib/users";
import Header from "@/components/Header";
import Alert from "@/components/Alert";
import UrlTable from "@/components/UrlTable";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function UrlsPage({ searchParams }: PageProps) {
  const userId = await getOrCreateDefaultUserId();
  const urls = await getUrlsForUser(userId);
  const params = await searchParams;

  const message = params.error ? decodeURIComponent(params.error) : "";

  return (
    <>
      <Header />
      <main>
        <Alert success={!params.error} message={message} />
        <h3 className="m-4">My URLs</h3>
        <UrlTable urls={urls} />
      </main>
    </>
  );
}
