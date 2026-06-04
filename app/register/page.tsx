import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { registerAction } from "@/app/actions/auth";
import AuthForm from "@/components/AuthForm";

export default async function RegisterPage() {
  const session = await auth();
  if (session) {
    redirect("/urls");
  }
  return (
    <AuthForm
      title="Register!"
      quip="how else will we collect your data?"
      action={registerAction}
      submitLabel="Register"
      showPasswordConfirmation
      extraLinks={
        <>
          <p className="my-0">
            <small>
              By registering, you automatically agree to the privacy policy
            </small>
          </p>
          <p className="mb-2">
            <small>
              <Link href="/privacy" className="text-light">
                -&gt; Read the privacy policy
              </Link>
            </small>
          </p>
        </>
      }
    />
  );
}
