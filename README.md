# Task Management API

Production-ready Node.js + Express + TypeScript service implementing a task management domain with strict business rules, JWT authentication (Auth0 compatible), MongoDB persistence, Clean Architecture layering, validation, logging, and Jest unit tests.

## Clean Folder Structure

```
src/
  app.ts                 # Express bootstrap
  server.ts              # Process entrypoint
  config/                # Environment, logger, database wiring
  middleware/            # Auth, validation, error & activity logging
  modules/
    tasks/               # Task bounded context (model, repo, service, controller, routes)
      dto/
      task.model.ts
      task.repository.ts
      task.service.ts
      task.controller.ts
      task.routes.ts
      task.validation.ts
  routes/                # API composition per domain
  shared/                # Cross-cutting concerns (errors, utils, types)
```

## Features

- **Strict task lifecycle**: Status transitions enforced in `TaskService` with atomic MongoDB updates to avoid race conditions.
- **Ownership guarantees**: All task mutations are scoped to the authenticated owner.
- **Idempotent `markAsDone`**: Repeated calls either perform the transition once or return the already completed task without error.
- **Immutable DONE tasks**: Once completed, only title typo fixes are allowed; archived tasks are fully locked.
- **Validation layer**: Zod schemas + reusable `validateRequest` middleware guard params, body, and query data.
- **Authentication**: JWT middleware supports Auth0 JWKS verification and a secret-based fallback for local development.
- **Activity logging**: Every API hit logs timestamp, user, inputs, and a summarized output via Pino.
- **Error handling**: Centralized `AppError` model with consistent JSON responses and structured logs.
- **Testing**: Jest + ts-jest sample unit specs illustrating business rule enforcement.

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Copy environment template**
   ```bash
   cp .env.example .env
   ```
   Fill in MongoDB URI and Auth0 (or local JWT secret) settings.
3. **Run the dev server**
   ```bash
   npm run dev
   ```
4. **Build & run**
   ```bash
   npm run build && npm start
   ```
5. **Execute tests**
   ```bash
   npm test
   ```

## Environment Variables

| Variable | Description |
| --- | --- |
| `PORT` | HTTP port (default 3000) |
| `MONGO_URI` | MongoDB connection string |
| `AUTH_AUDIENCE` | Expected JWT audience |
| `AUTH_ISSUER` | JWT issuer (e.g., `https://YOUR_DOMAIN/`) |
| `AUTH_JWKS_URI` | Auth0 JWKS endpoint (omit to use shared secret mode) |
| `AUTH_ALGORITHMS` | Comma-separated algorithms (e.g., `RS256`, `HS256`) |
| `JWT_SECRET` | HMAC secret for local/testing scenarios |
| `LOG_LEVEL` | Pino log level (default `info`) |

## API Outline

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/tasks` | Create a task (starts in `PENDING`) |
| `GET` | `/api/tasks` | List owner tasks with optional `status` / `search` filters |
| `GET` | `/api/tasks/:taskId` | Retrieve a task by id |
| `PATCH` | `/api/tasks/:taskId` | Edit task details (DONE only allows title edits) |
| `POST` | `/api/tasks/:taskId/transition` | Transition to the next allowed status |
| `POST` | `/api/tasks/:taskId/done` | Idempotently mark as DONE (owner-only) |

All `/api` routes require a valid Bearer token.

## Logging & Observability

- `pino-http` supplies structured request logs.
- `activityLogger` captures domain-level audit trails (timestamp, user id, inputs, summarized output, latency).
- `AppError` instances drive consistent error telemetry and client responses.

## Testing Strategy

- `jest` with `ts-jest` compiles TypeScript tests.
- Sample spec (`src/modules/tasks/task.service.spec.ts`) demonstrates business rule coverage (transition validation, idempotent DONE behavior).
- Extend with additional specs (controllers, repositories) as needed; mocks can be injected through the `TaskService` constructor for isolation.
