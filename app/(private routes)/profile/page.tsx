import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { isAxiosError } from "axios";
import { redirect } from "next/navigation";
import css from "@/styles/ProfilePage.module.css";
import { getCurrentUserServer } from "@/lib/api/serverApi";
import type { User } from "@/types/user";

export const metadata: Metadata = {
  title: "Profile | NoteHub",
  description: "Your NoteHub account profile",
};

const fallbackAvatar =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128'%3E%3Crect width='100%25' height='100%25' fill='%23dee2e6'/%3E%3Ctext x='50%25' y='55%25' text-anchor='middle' fill='%236c757d' font-size='20'%3EUser%3C/text%3E%3C/svg%3E";

export default async function ProfilePage() {
  let user: User;
  try {
    user = (await getCurrentUserServer()).data;
  } catch (error: unknown) {
    if (isAxiosError(error) && error.response?.status === 401) {
      redirect("/sign-in");
    }
    throw error;
  }

  return (
    <main className={css.mainContent}>
      <section className={css.profileCard} aria-labelledby="profile-title">
        <div className={css.header}>
          <h1 id="profile-title" className={css.formTitle}>
            Profile
          </h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit profile
          </Link>
        </div>
        <div className={css.avatarWrapper}>
          <Image
            className={css.avatar}
            src={user.avatar || fallbackAvatar}
            alt={`${user.username}'s avatar`}
            width={128}
            height={128}
            unoptimized={!user.avatar}
          />
        </div>
        <div className={css.profileInfo}>
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </div>
      </section>
    </main>
  );
}
