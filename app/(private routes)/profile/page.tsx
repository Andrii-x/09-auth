import Link from "next/link";
import css from "@/styles/ProfilePage.module.css";

export default function ProfilePage() {
  return (
    <main className={css.mainContent}>
      <section className={css.profileCard} aria-labelledby="profile-title">
        <div className={css.header}>
          <h1 id="profile-title" className={css.formTitle}>
            Profile Page
          </h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>
        <div className={css.profileInfo}>
          <p>Profile details will appear here after authentication is connected.</p>
        </div>
      </section>
    </main>
  );
}
