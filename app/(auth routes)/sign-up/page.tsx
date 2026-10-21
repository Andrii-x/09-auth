"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import styles from "@/styles/SignUpPage.module.css";

export default function SignUpPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    router.refresh();
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsPending(true);
    const formData = new FormData(event.currentTarget);

    try {
      const user = await register({
        username: String(formData.get("username") ?? ""),
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
      });
      setUser(user);
      router.replace("/notes");
      router.refresh();
    } catch (cause: unknown) {
      setError(cause instanceof Error ? cause.message : "Unable to register.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <main className={styles.mainContent}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.formTitle}>Sign up</h1>
        <div className={styles.formGroup}>
          <label htmlFor="sign-up-username">Username</label>
          <input
            id="sign-up-username"
            className={styles.input}
            type="text"
            name="username"
            autoComplete="username"
            minLength={2}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="sign-up-email">Email</label>
          <input
            id="sign-up-email"
            className={styles.input}
            type="email"
            name="email"
            autoComplete="email"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="sign-up-password">Password</label>
          <input
            id="sign-up-password"
            className={styles.input}
            type="password"
            name="password"
            autoComplete="new-password"
            minLength={8}
            required
          />
        </div>
        <div className={styles.actions}>
          <button className={styles.submitButton} type="submit" disabled={isPending}>
            {isPending ? "Please wait..." : "Register"}
          </button>
        </div>
        {error ? <p className={styles.error} role="alert">{error}</p> : null}
      </form>
    </main>
  );
}
