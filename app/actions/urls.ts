"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import {
  createUrl,
  deleteUrl,
  updateUrl,
} from "@/lib/urls";

async function requireUserId(): Promise<number> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  return Number(session.user.id);
}

export async function createUrlAction(formData: FormData) {
  const userId = await requireUserId();
  const longUrl = String(formData.get("longUrl") ?? "");

  try {
    await createUrl(longUrl, userId);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not create URL";
    redirect(`/urls/new?error=${encodeURIComponent(message)}`);
  }

  revalidatePath("/urls");
  redirect("/urls");
}

export async function updateUrlAction(formData: FormData) {
  const userId = await requireUserId();
  const shortUrl = String(formData.get("shortUrl") ?? "");
  const longUrl = String(formData.get("longUrl") ?? "");

  try {
    await updateUrl(shortUrl, userId, longUrl);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not update URL";
    redirect(`/urls/${shortUrl}?error=${encodeURIComponent(message)}`);
  }

  revalidatePath("/urls");
  redirect("/urls");
}

export async function deleteUrlAction(formData: FormData) {
  const userId = await requireUserId();
  const shortUrl = String(formData.get("shortUrl") ?? "");

  try {
    await deleteUrl(shortUrl, userId);
  } catch {
    redirect("/urls?error=Could%20not%20delete%20URL");
  }

  revalidatePath("/urls");
  redirect("/urls");
}
