import Header from "@/components/Header";
import { createUrlAction } from "@/app/actions/urls";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function NewUrlPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <>
      <Header />
      <main style={{ margin: "1em" }}>
        {params.error ? (
          <div className="alert alert-danger" role="alert">
            {decodeURIComponent(params.error)}
          </div>
        ) : null}
        <h3 className="ms-2 mt-4">Create TinyURL</h3>
        <form action={createUrlAction} className="form-inline ms-2 d-flex gap-2">
          <div className="form-group mb-2">
            <label htmlFor="longUrl" className="me-2">
              Enter a URL:
            </label>
            <input
              className="form-control"
              id="longUrl"
              name="longUrl"
              type="url"
              placeholder="https://example.com"
              style={{ width: 300, margin: "1em" }}
              autoFocus
              required
            />
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
