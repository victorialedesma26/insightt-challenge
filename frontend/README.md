# Task Management Web Client

Frontend for the Task Management technical test. Built with React, TypeScript, Vite, Material UI, Auth0, Axios, and notistack. It authenticates against Auth0, exchanges JWTs with the Node.js API, and provides a rich UX to create, edit, delete, and mark tasks as done.

## Folder Structure

```

  components/
    tasks/
      TaskForm.tsx          # Create/Edit form with validation + LoadingButton
      TaskList.tsx          # Task feed with status chips, actions, empty states
  context/
    AuthProvider.tsx        # Auth0 provider + custom hook exposing login/logout/token helpers
  hooks/
    useTasks.ts             # Data fetching + optimistic updates + snackbar feedback
  services/
    api.ts                  # Axios instance + task API wrapper
  theme/
    index.ts                # Custom MUI theme (palette, typography, shape overrides)
  types/
    task.ts                 # Shared task + status types and helper maps
  App.tsx                   # App shell, layout, guarded content
  main.tsx                  # Entry point wiring ThemeProvider, SnackbarProvider, AuthProvider
```

## Environment Variables

Copy `.env.example` to `.env` and fill in your Auth0 + API details:

```
cp .env.example .env
```

| key | description |
| --- | --- |
| `VITE_API_BASE_URL` | Backend API base URL (e.g., `http://localhost:3000/api`) |
| `VITE_AUTH0_DOMAIN` | Auth0 tenant domain |
| `VITE_AUTH0_CLIENT_ID` | SPA client id |
| `VITE_AUTH0_AUDIENCE` | API identifier configured in Auth0 |

## Available Scripts

```bash
npm install           # install dependencies
npm run dev           # start Vite dev server
npm run build         # production build
npm run preview       # preview production build
```

## UX Highlights

- Auth0 login/logout with cached tokens, stored in React context.
- Axios API layer automatically injects Bearer tokens per request.
- `useTasks` hook centralizes loading states, optimistic UI updates, and snackbar feedback.
- Material UI theme with custom palette, gradient background, and accessible status chips.
- Task form uses `LoadingButton`, inline validation, and edit cancellation.
- Task list shows status colors, refresh control, disabled buttons during in-flight actions, and idempotent “Mark as done”.

## Connecting to the API

1. Run the backend (`npm run dev` at repo root) so the API is reachable.
2. Configure Auth0 to issue JWTs for the backend audience and include the frontend origin in Allowed Callback/Logout URLs.
3. Update `.env` with the API base URL + Auth0 identifiers.
4. Start the frontend (`npm run dev` inside `frontend/`) and log in to manage tasks.
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
