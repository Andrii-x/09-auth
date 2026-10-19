"use client";

import { useState, type FormEvent } from "react";
import signInCss from "@/styles/SignInPage.module.css";
import signUpCss from "@/styles/SignUpPage.module.css";

type AuthFormProps = {
  mode: "sign-in" | "sign-up";
};

export default function AuthForm({ mode }: AuthFormProps) {
  const [message, setMessage] = useState("");
  const css = mode === "sign-in" ? signInCss : signUpCss;
  const isSignUp = mode === "sign-up";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Authentication is not configured in this scaffold yet.");
  }

  return (
    <main className={css.mainContent}>
      <form className={css.form} onSubmit={handleSubmit}>
        <h1 className={css.formTitle}>{isSignUp ? "Sign up" : "Sign in"}</h1>

        <div className={css.formGroup}>
          <label htmlFor={`${mode}-email`}>Email</label>
          <input
            id={`${mode}-email`}
            type="email"
            name="email"
            className={css.input}
            autoComplete="email"
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`${mode}-password`}>Password</label>
          <input
            id={`${mode}-password`}
            type="password"
            name="password"
            className={css.input}
            autoComplete={isSignUp ? "new-password" : "current-password"}
            required
          />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>
            {isSignUp ? "Register" : "Log in"}
          </button>
        </div>

        {message ? (
          <p className={css.error} role="status">
            {message}
          </p>
        ) : null}
      </form>
    </main>
  );
}
