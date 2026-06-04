import { auth } from "@/auth";
import { getUrlsForUser } from "@/lib/urls";
import Header from "@/components/Header";
import Alert from "@/components/Alert";
import UrlTable from "@/components/UrlTable";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ loggedIn?: string; error?: string }>;
};

export default async function UrlsPage({ searchParams }: PageProps) {
  const session = await auth();
  const userId = Number(session!.user!.id);
  const urls = await getUrlsForUser(userId);
  const params = await searchParams;

  const message = params.error
    ? decodeURIComponent(params.error)
    : params.loggedIn === "true"
      ? "Successfully logged in"
      : "";

  return (
    <>
      <Header email={session?.user?.email} />
      <main>
        <Alert success={!params.error} message={message} />
        <h3 className="m-4">My URLs</h3>
        <UrlTable urls={urls} />
      </main>
    </>
  );
}
