# 09-auth

A Next.js App Router scaffold for the NoteHub sign-in, sign-up, and profile pages.

## Run locally

```sh
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app includes routes for
`/sign-in`, `/sign-up`, `/profile`, and `/profile/edit`, using the CSS Modules in
`styles/`.

Authentication and profile persistence are not configured. The forms display an
explicit message when submitted; the profile routes are UI scaffolding and are
not protected. Connect an authentication provider and API before using these
routes for real accounts.
