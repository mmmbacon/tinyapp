import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { getUrlForUser } from "@/lib/urls";
import Header from "@/components/Header";
import { updateUrlAction } from "@/app/actions/urls";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ shortURL: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function EditUrlPage({ params, searchParams }: PageProps) {
  const session = await auth();
  const userId = Number(session!.user!.id);
  const { shortURL } = await params;
  const url = await getUrlForUser(shortURL, userId);
  const query = await searchParams;

  if (!url) {
    notFound();
  }

  return (
    <>
      <Header email={session?.user?.email} />
      <div className="card text-center">
        <div className="card-header" />
        <div className="card-body">
          {query.error ? (
            <div className="alert alert-danger" role="alert">
              {decodeURIComponent(query.error)}
            </div>
          ) : null}
          <h5 className="card-title">
            TinyURL for:{" "}
            <a href={url.longUrl} target="_blank" rel="noreferrer">
              {url.longUrl}
            </a>
          </h5>
          <p className="card-text">
            Short URL:{" "}
            <Link href={`/u/${url.shortUrl}`} target="_blank">
              {url.shortUrl}
            </Link>
          </p>
          <h3>Edit URL</h3>
          <form action={updateUrlAction} className="d-flex justify-content-center align-items-center gap-2">
            <input type="hidden" name="shortUrl" value={url.shortUrl} />
            <span className="me-2">New URL:</span>
            <input
              className="form-control"
              name="longUrl"
              type="url"
              defaultValue={url.longUrl}
              required
            />
            <button className="btn btn-primary ms-3" type="submit">
              Submit
            </button>
          </form>
        </div>
        <div className="card-footer text-muted" />
      </div>
    </>
  );
}
