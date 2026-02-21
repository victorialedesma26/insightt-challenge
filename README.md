# Task Management Platform

Full-stack technical assessment composed of a hardened Node.js API and a React + Vite SPA. The backend enforces strict task life-cycle rules, JWT-authenticates every request, and persists data in MongoDB. The frontend authenticates with Auth0, consumes the API via TanStack Query, and offers a polished Material UI experience for capturing, updating, and reviewing personal tasks.

## Repository Layout

```
backend/   # Express + TypeScript service, MongoDB, Jest tests
frontend/  # React SPA (Vite, MUI, Auth0, TanStack Query)
```

## Key Features

- Auth0-compatible JWT authentication and ownership enforcement on every task action.
- Clean architecture separation (controllers, services, repositories, DTOs, middleware).
- Status transition rules with atomic updates, idempotent "mark as done", and immutable archived tasks.
- Rich SPA with Auth0 login, optimistic mutations, snackbar feedback, and gradient UI.
- Shared TypeScript types and strict linting/formatting rules across both apps.

## Prerequisites

- Node.js 20+
- npm 10+
- MongoDB instance (local or managed)
- Auth0 tenant (or equivalent OIDC provider) configured with SPA + API applications

## Backend (API)

1. Install deps:
   ```bash
   cd backend
   npm install
   ```
2. Configure environment:
   ```bash
   cp .env.example .env
   ```
   Fill in values such as:
   | Variable | Purpose |
   | --- | --- |
   | `PORT` | API port (default 3000) |
   | `MONGO_URI` | Mongo connection string |
   | `AUTH_AUDIENCE` / `AUTH_ISSUER` / `AUTH_JWKS_URI` | Auth0 API identifiers |
   | `JWT_SECRET` | Local/testing HMAC secret |
3. Run in dev mode:
   ```bash
   npm run dev
   ```
4. Build & run production bundle:
   ```bash
   npm run build && npm start
   ```
5. Execute tests:
   ```bash
   npm test
   ```

## Frontend (Web Client)

1. Install deps:
   ```bash
   cd frontend
   npm install
   ```
2. Configure environment:
   ```bash
   cp .env.example .env
   ```
   Required keys:
   | Variable | Purpose |
   | --- | --- |
   | `VITE_API_BASE_URL` | Points to backend (e.g., http://localhost:3000/api) |
   | `VITE_AUTH0_DOMAIN` | Auth0 tenant domain |
   | `VITE_AUTH0_CLIENT_ID` | SPA client ID |
   | `VITE_AUTH0_AUDIENCE` | Identifier matching backend JWT audience |
3. Start Vite dev server:
   ```bash
   npm run dev
   ```
4. Create a production build:
   ```bash
   npm run build
   npm run preview
   ```

## Running the Stack

- Open two terminals.
- Start the backend (`npm run dev` inside `backend/`).
- Start the frontend (`npm run dev` inside `frontend/`).
- Navigate to the printed Vite URL (default http://localhost:5173), log in via Auth0, and interact with your task board.

## Troubleshooting

- **Auth errors**: Ensure Auth0 callback/logout URLs include the frontend origin, and the issued token audience matches the API configuration.
- **Mongo connection failures**: Verify `MONGO_URI` and that the database is reachable from your machine.
- **CORS issues**: Confirm the backend `app.ts` enables CORS for the frontend origin (default setup already allows common dev origins).

## Additional Resources

- Backend internals: see `backend/README.md`.
- Frontend specifics: see `frontend/README.md`.
- Command palette: review `COMMANDS.md` for any repo-specific scripts.
