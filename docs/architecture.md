# CareerCommand Architecture

## Current Version

CareerCommand is a client-side React application. The current build uses seeded data in `src/data.ts` so the UI can be evaluated instantly without external services.

## Main Modules

- `src/App.tsx`: Application shell, derived metrics, search/filter state, selected role state, and stage update behavior.
- `src/data.ts`: Typed application model, stage model, and realistic demo records.
- `src/styles.css`: Design tokens, layout primitives, dashboard styling, and responsive behavior.

## Production Path

A production version would split the app into:

- React + TypeScript frontend
- REST or tRPC API
- PostgreSQL database
- Authentication provider
- Background job for follow-up reminders
- CI pipeline for typecheck, lint, unit tests, and Playwright smoke tests

## Example Database Tables

- `users`
- `applications`
- `application_notes`
- `contacts`
- `resume_versions`
- `follow_up_tasks`

## API Endpoints

- `GET /applications`
- `POST /applications`
- `PATCH /applications/:id`
- `DELETE /applications/:id`
- `GET /metrics`
- `POST /follow-ups`
