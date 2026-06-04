import { createUrlAction } from "@/app/actions/urls";

export default function ShortenForm() {
  return (
    <form action={createUrlAction} className="form-inline d-flex">
      <input
        className="form-control"
        name="longUrl"
        type="url"
        placeholder="https://example.com"
        style={{ border: "none", borderRadius: 0 }}
        autoFocus
        required
      />
      <button className="btn btn-outline-primary text-light my-2" type="submit">
        GO
      </button>
    </form>
  );
}
