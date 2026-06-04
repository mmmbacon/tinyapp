import { getUrlForRedirect } from "@/lib/urls";
import { redirect } from "next/navigation";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ shortURL: string }> }
) {
  const { shortURL } = await params;
  const url = await getUrlForRedirect(shortURL);

  if (!url) {
    return new Response("Not found", { status: 404 });
  }

  let destination = url.longUrl;
  if (!/^https?:\/\//i.test(destination)) {
    destination = `https://${destination}`;
  }

  redirect(destination);
}
