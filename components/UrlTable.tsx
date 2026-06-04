import Link from "next/link";
import { deleteUrlAction } from "@/app/actions/urls";

export type UrlRow = {
  shortUrl: string;
  longUrl: string;
};

type UrlTableProps = {
  urls: UrlRow[];
};

export default function UrlTable({ urls }: UrlTableProps) {
  return (
    <table className="table table-hover mb-0">
      <thead>
        <tr>
          <th scope="col" className="ps-4">
            Short URL
          </th>
          <th scope="col">Long URL</th>
          <th scope="col">Edit</th>
          <th scope="col" className="text-center">
            Delete
          </th>
        </tr>
      </thead>
      <tbody>
        {urls.map((url) => (
          <tr key={url.shortUrl}>
            <td className="align-middle ps-4">
              <Link href={`/u/${url.shortUrl}`} target="_blank">
                {url.shortUrl}
              </Link>
            </td>
            <td className="align-middle">
              <a href={url.longUrl} target="_blank" rel="noreferrer">
                {url.longUrl}
              </a>
            </td>
            <td className="align-middle">
              <Link href={`/urls/${url.shortUrl}`}>Edit</Link>
            </td>
            <td className="align-middle text-center">
              <form action={deleteUrlAction}>
                <input type="hidden" name="shortUrl" value={url.shortUrl} />
                <button className="btn btn-outline-danger" type="submit">
                  Delete
                </button>
              </form>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
