"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { getCurrentUser, getSession } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function hydrateAuth(): Promise<void> {
      try {
        const session = await getSession();
        const user = session.user ?? (await getCurrentUser());
        if (active) {
          setUser(user);
          setAuthError(null);
        }
      } catch (error: unknown) {
        if (!active) return;
        if (isAxiosError(error) && error.response?.status === 401) {
          clearUser();
        } else {
          setAuthError(
            error instanceof Error
              ? error.message
              : "Unable to verify your session.",
          );
          clearUser();
        }
      } finally {
        if (active) router.refresh();
      }
    }

    void hydrateAuth();
    return () => {
      active = false;
    };
  }, [clearUser, router, setUser]);

  return (
    <>
      {authError ? (
        <p className="authStatusError" role="alert">
          Session status could not be verified: {authError}
        </p>
      ) : null}
      {children}
    </>
  );
}
