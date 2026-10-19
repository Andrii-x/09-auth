import Link from "next/link";
import css from "@/styles/AuthNavigation.module.css";

export default function AuthNavigation() {
  return (
    <nav aria-label="Account navigation">
      <ul className="navigationList">
        <li className={css.navigationItem}>
          <Link href="/profile" prefetch={false} className={css.navigationLink}>
            Profile
          </Link>
        </li>
        <li className={css.navigationItem}>
          <Link href="/sign-in" prefetch={false} className={css.navigationLink}>
            Login
          </Link>
        </li>
        <li className={css.navigationItem}>
          <Link href="/sign-up" prefetch={false} className={css.navigationLink}>
            Sign up
          </Link>
        </li>
      </ul>
    </nav>
  );
}
