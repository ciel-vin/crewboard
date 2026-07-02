"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { signIn, signUp, type AuthState } from "./actions";

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-primary w-full justify-center" disabled={pending}>
      {pending ? "Working…" : label}
    </button>
  );
}

export default function LoginPage() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const action = mode === "in" ? signIn : signUp;
  const [state, formAction] = useFormState<AuthState, FormData>(action, {});

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <Link href="/" className="mb-8 flex items-center gap-2.5">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-sm font-bold text-white">
          C
        </span>
        <span className="text-[15px] font-700">CrewBoard</span>
      </Link>

      <div className="card p-7">
        <h1 className="text-2xl font-700">
          {mode === "in" ? "Sign in" : "Create your workspace"}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {mode === "in"
            ? "Welcome back to your team board."
            : "Sign up and we'll seed a private workspace for you."}
        </p>

        <form action={formAction} className="mt-6 space-y-3">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-600">
              Email
            </label>
            <input id="email" name="email" type="email" required className="input" placeholder="you@company.com" />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-600">
              Password
            </label>
            <input id="password" name="password" type="password" required minLength={6} className="input" placeholder="••••••••" />
          </div>

          {state.error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</p>
          )}
          {state.message && (
            <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{state.message}</p>
          )}

          <Submit label={mode === "in" ? "Sign in" : "Sign up"} />
        </form>

        <button
          onClick={() => setMode(mode === "in" ? "up" : "in")}
          className="mt-4 w-full text-center text-sm text-brand hover:underline"
        >
          {mode === "in"
            ? "No account? Create one"
            : "Already have an account? Sign in"}
        </button>
      </div>
    </main>
  );
}
