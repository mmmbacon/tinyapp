import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { loginAction } from "@/app/actions/auth";
import AuthForm from "@/components/AuthForm";

export default async function LoginPage() {
  const session = await auth();
  if (session) {
    redirect("/urls");
  }
  return (
    <AuthForm
      title="Login!"
      quip="welcome back"
      action={loginAction}
      submitLabel="Login"
      extraLinks={
        <>
          <p className="mb-0">
            <small>
              <Link href="/register" className="tiny-muted">
                Register
              </Link>
            </small>
          </p>
          <p className="mb-0">
            <small>
              <Link href="/privacy" className="tiny-muted">
                -&gt; Read the privacy policy
              </Link>
            </small>
          </p>
        </>
      }
    />
  );
}
