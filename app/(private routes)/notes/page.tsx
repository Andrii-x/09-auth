import Link from "next/link";
import css from "@/styles/ProfilePage.module.css";

export default function NotesPage() {
  return (
    <main className={css.mainContent}>
      <section className={css.profileCard} aria-labelledby="notes-title">
        <h1 id="notes-title" className={css.formTitle}>Notes</h1>
        <p className={css.profileInfo}>Your notes will appear here once the app is connected to data storage.</p>
        <div className={css.actions}>
          <Link href="/profile" className={css.editProfileButton}>Back to profile</Link>
        </div>
      </section>
    </main>
  );
}
