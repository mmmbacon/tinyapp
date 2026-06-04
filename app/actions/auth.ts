"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { signIn } from "@/auth";
import { createUser } from "@/lib/users";

const registerSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Password does not match password confirmation",
    path: ["password_confirmation"],
  });

export type AuthFormState = {
  success: boolean;
  message: string;
};

export async function loginAction(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const result = await signIn("credentials", {
    email,
    password,
    redirect: false,
  });

  if (result?.error) {
    return { success: false, message: "Invalid email or password" };
  }

  redirect("/urls?loggedIn=true");
}

export async function registerAction(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const raw = {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    password_confirmation: String(formData.get("password_confirmation") ?? ""),
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    const message =
      parsed.error.errors[0]?.message ?? "Please check your registration details";
    return { success: false, message };
  }

  try {
    await createUser(parsed.data.email, parsed.data.password);
  } catch (error) {
    if (error instanceof Error && error.message.includes("already registered")) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Could not create account. Please try again." };
  }

  const result = await signIn("credentials", {
    email: parsed.data.email,
    password: parsed.data.password,
    redirect: false,
  });

  if (result?.error) {
    return {
      success: false,
      message: "Account created but sign-in failed. Please log in.",
    };
  }

  redirect("/urls?loggedIn=true");
}

export async function logoutAction() {
  const { signOut } = await import("@/auth");
  await signOut({ redirectTo: "/" });
}
