"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { login, register } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import signInCss from "@/styles/SignInPage.module.css";
import signUpCss from "@/styles/SignUpPage.module.css";

type AuthFormProps = {
  mode: "sign-in" | "sign-up";
};

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const css = mode === "sign-in" ? signInCss : signUpCss;
  const isSignUp = mode === "sign-up";

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setMessage(null);
    setIsPending(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    try {
      const user = isSignUp
        ? await register({
            username: String(formData.get("username") ?? ""),
            email,
            password,
          })
        : await login({ email, password });
      setUser(user);
      router.replace("/notes");
      router.refresh();
    } catch (error: unknown) {
      setMessage(
        error instanceof Error ? error.message : "Authentication failed.",
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <main className={css.mainContent}>
      <form className={css.form} onSubmit={handleSubmit}>
        <h1 className={css.formTitle}>{isSignUp ? "Sign up" : "Sign in"}</h1>

        {isSignUp ? (
          <div className={css.formGroup}>
            <label htmlFor="auth-username">Username</label>
            <input
              id="auth-username"
              type="text"
              name="username"
              className={css.input}
              autoComplete="username"
              minLength={2}
              required
            />
          </div>
        ) : null}

        <div className={css.formGroup}>
          <label htmlFor="auth-email">Email</label>
          <input
            id="auth-email"
            type="email"
            name="email"
            className={css.input}
            autoComplete="email"
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="auth-password">Password</label>
          <input
            id="auth-password"
            type="password"
            name="password"
            className={css.input}
            autoComplete={isSignUp ? "new-password" : "current-password"}
            minLength={8}
            required
          />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton} disabled={isPending}>
            {isPending ? "Please wait..." : isSignUp ? "Register" : "Log in"}
          </button>
        </div>

        {message ? (
          <p className={css.error} role="alert">
            {message}
          </p>
        ) : null}
      </form>
    </main>
  );
}
