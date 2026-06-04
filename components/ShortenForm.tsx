import { createUrlAction } from "@/app/actions/urls";

export default function ShortenForm() {
  return (
    <form action={createUrlAction} className="shorten-form d-flex flex-column align-items-center gap-2 w-100">
      <input
        className="form-control form-control-glass w-100"
        name="longUrl"
        type="url"
        placeholder="https://example.com"
        autoFocus
        required
      />
      <button className="btn btn-tiny-outline" type="submit">
        Tinyfy
      </button>
    </form>  );
}
