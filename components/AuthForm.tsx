"use client";

import { useActionState } from "react";
import type { AuthFormState } from "@/app/actions/auth";

type AuthFormProps = {
  title: string;
  quip: string;
  action: (
    prev: AuthFormState,
    formData: FormData
  ) => Promise<AuthFormState>;
  submitLabel: string;
  showPasswordConfirmation?: boolean;
  extraLinks?: React.ReactNode;
};

const initialState: AuthFormState = { success: true, message: "" };

export default function AuthForm({
  title,
  quip,
  action,
  submitLabel,
  showPasswordConfirmation = false,
  extraLinks,
}: AuthFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <main>
      {!state.success && state.message ? (
        <div className="container-fluid">
          <div
            className="alert alert-danger fixed-bottom w-100"
            role="alert"
          >
            {state.message}
          </div>
        </div>
      ) : null}

      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="row">
          <div className="col d-flex flex-column align-items-center">
            <div className="col d-flex flex-column align-items-center bg-primary text-light py-3 context-card position-relative">
              <div style={{ height: 75 }} />
              <h1 className="position-absolute text-center px-4 title title-animated">
                {title}
              </h1>
              <form className="form" action={formAction}>
                <div className="input-group mb-2">
                  <input
                    className="form-control"
                    name="email"
                    type="email"
                    placeholder="email"
                    required
                  />
                </div>
                <div className="input-group mb-2">
                  <input
                    className="form-control"
                    name="password"
                    type="password"
                    placeholder="password"
                    required
                  />
                </div>
                {showPasswordConfirmation ? (
                  <div className="input-group">
                    <input
                      className="form-control"
                      name="password_confirmation"
                      type="password"
                      placeholder="Password confirmation"
                      required
                    />
                  </div>
                ) : null}
                {extraLinks}
                <button
                  className="btn btn-warning text-primary my-2"
                  type="submit"
                  disabled={pending}
                >
                  {pending ? "Please wait…" : submitLabel}
                </button>
              </form>
            </div>
            <div className="position-absolute text-end text-primary quip">
              <i>{quip}</i>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
