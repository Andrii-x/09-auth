import Link from "next/link";
import css from "@/styles/EditProfilePage.module.css";

export default function EditProfilePage() {
  return (
    <main className={css.mainContent}>
      <section className={css.profileCard} aria-labelledby="edit-profile-title">
        <h1 id="edit-profile-title" className={css.formTitle}>
          Edit Profile
        </h1>
        <p className={css.profileInfo}>
          Profile editing will be available after authentication is connected.
        </p>
        <div className={css.actions}>
          <Link href="/profile" className={css.cancelButton}>
            Back to profile
          </Link>
        </div>
      </section>
    </main>
  );
}
