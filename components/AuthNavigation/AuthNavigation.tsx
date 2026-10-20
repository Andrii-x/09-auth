"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { logout } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import css from "@/styles/AuthNavigation.module.css";

export default function AuthNavigation() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const clearUser = useAuthStore((state) => state.clearUser);
  const [error, setError] = useState<string | null>(null);

  async function handleLogout(): Promise<void> {
    setError(null);
    try {
      await logout();
    } catch (cause: unknown) {
      setError(cause instanceof Error ? cause.message : "Could not sign out.");
    } finally {
      clearUser();
      router.replace("/sign-in");
      router.refresh();
    }
  }

  return (
    <nav aria-label="Account navigation">
      <ul className="navigationList">
        {user ? (
          <>
            <li className={css.navigationItem}>
              <Link href="/notes" className={css.navigationLink}>
                Notes
              </Link>
            </li>
            <li className={css.navigationItem}>
              <Link href="/profile" className={css.navigationLink}>
                Profile
              </Link>
            </li>
            <li className={css.navigationItem}>
              <span className={css.userEmail}>{user.email}</span>
            </li>
            <li className={css.navigationItem}>
              <button
                type="button"
                className={css.logoutButton}
                onClick={handleLogout}
              >
                Log out
              </button>
            </li>
          </>
        ) : (
          <>
            <li className={css.navigationItem}>
              <Link href="/sign-in" className={css.navigationLink}>
                Sign in
              </Link>
            </li>
            <li className={css.navigationItem}>
              <Link href="/sign-up" className={css.navigationLink}>
                Sign up
              </Link>
            </li>
          </>
        )}
      </ul>
      {error ? <p role="alert">{error}</p> : null}
    </nav>
  );
}
