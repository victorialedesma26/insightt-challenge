# Task Management Monorepo

This repository now groups the Express API and the Vite React client into separate packages. Run commands from the repo root so paths stay consistent.

## Project Layout

- `backend/`: Node.js + Express + TypeScript API (MongoDB, Auth0-compatible auth, Jest tests)
- `frontend/`: React + Vite SPA that consumes the API

## Install Dependencies

```bash
cd backend && npm install
cd frontend && npm install
```

## Environment Variables

- Backend env files live in `backend/.env` (copy from `backend/.env.example`).
- Frontend env files follow Vite's `VITE_` naming and should be placed under `frontend/`.

## Run in Development

```bash
# Terminal 1 - API
cd backend && npm run dev

# Terminal 2 - Web client
cd frontend && npm run dev
```

- Backend serves REST API on the port defined in `backend/.env` (default 3000).
- Frontend starts the Vite dev server (default 5173) and should proxy API calls per the frontend `vite.config.ts`.

## Build & Start

```bash
cd backend && npm run build && npm start
cd frontend && npm run build && npm run preview
```

## Tests & Linting

```bash
# Backend unit tests
cd backend && npm test

# Backend type checks
cd backend && npm run lint

# Frontend linting
cd frontend && npm run lint
```

Refer to `backend/README.md` for the detailed API documentation and architecture notes.
