"use client";

import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { getCurrentUser, updateCurrentUser } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import type { User } from "@/types/user";
import css from "@/styles/EditProfilePage.module.css";

const fallbackAvatar =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128'%3E%3Crect width='100%25' height='100%25' fill='%23dee2e6'/%3E%3Ctext x='50%25' y='55%25' text-anchor='middle' fill='%236c757d' font-size='20'%3EUser%3C/text%3E%3C/svg%3E";

export default function EditProfileForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  const userQuery = useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
  });
  const [username, setUsername] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const updateMutation = useMutation({
    mutationFn: updateCurrentUser,
    onSuccess: async (user: User) => {
      setUser(user);
      await queryClient.setQueryData(["current-user"], user);
      router.back();
      router.refresh();
    },
    onError: (error: Error) => setFormError(error.message),
  });

  if (userQuery.isPending) return <p role="status">Loading profile...</p>;
  if (userQuery.isError) {
    return (
      <p role="alert">
        {userQuery.error instanceof Error
          ? userQuery.error.message
          : "Could not load profile."}
      </p>
    );
  }

  const user = userQuery.data;
  const value = username ?? user.username;

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setFormError(null);
    updateMutation.mutate({ username: value });
  }

  return (
    <main className={css.mainContent}>
      <form className={css.profileCard} onSubmit={handleSubmit}>
        <h1 className={css.formTitle}>Edit profile</h1>
        <Image
          className={css.avatar}
          src={user.avatar || fallbackAvatar}
          alt={`${user.username}'s avatar`}
          width={128}
          height={128}
          unoptimized={!user.avatar}
        />
        <p>{user.email}</p>
        <label className={css.usernameWrapper}>
          Username
          <input
            className={css.input}
            name="username"
            value={value}
            minLength={2}
            required
            onChange={(event) => setUsername(event.currentTarget.value)}
          />
        </label>
        {formError ? <p role="alert">{formError}</p> : null}
        <div className={css.actions}>
          <button
            className={css.saveButton}
            type="submit"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? "Saving..." : "Save changes"}
          </button>
          <button
            className={css.cancelButton}
            type="button"
            onClick={() => router.back()}
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}
