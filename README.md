# 09-auth

NoteHub frontend built with Next.js App Router. The application includes
authentication, profile management, paginated and searchable notes, note
creation/deletion, and intercepted note-detail previews.

## Run locally

```sh
npm install
npm run dev
```

Set `NEXT_PUBLIC_API_URL` to the NoteHub API host (for example,
`https://notehub-public.goit.study`) before starting the app. API requests use
that host with `/api`, send credentials, and use the API's session cookies.

Available routes include `/sign-in`, `/sign-up`, `/notes`, `/profile`, and
`/profile/edit`. Private routes are guarded by the Next.js middleware. Note
queries are cached with TanStack Query; authentication and note-form drafts are
stored with Zustand.
