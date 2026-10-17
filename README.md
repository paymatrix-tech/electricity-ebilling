# Electricity eBilling

Full-stack electricity billing and customer management: OTP-based sign-in, role-based portals for **admin**, **field staff**, and **customers**, tariff-aware invoicing, and simulated payments (UPI, card, wallet).

| Layer    | Stack |
|----------|--------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS 4, TanStack Query, React Router 7 |
| Backend  | Spring Boot 4, Java 25, Spring Security (JWT), JPA, Liquibase |
| Database | PostgreSQL 16 |

## Features by role

| Role | Capabilities |
|------|----------------|
| **Admin** | Manage employees, connection types, tariffs; create invoices |
| **Employee** | Customers (single + CSV bulk), connections, invoices, transaction history |
| **Customer** | View bills, pay via UPI / card / wallet flows |

Authentication uses **OTP** (email when SMTP is enabled; otherwise OTP is written to the backend log in local development). Successful verification returns a **JWT** stored in the browser and sent as `Authorization: Bearer …` on API calls.

## Prerequisites

- [Docker](https://www.docker.com/) (for PostgreSQL)
- **Java 25** and Maven (or use `backend/mvnw`)
- **Node.js** 20+ (for the frontend)

## Quick start

### 1. Database

```bash
docker compose up -d
```

PostgreSQL listens on `localhost:5432` with database `electricity_ebilling`, user/password `ebilling` (see `docker-compose.yml`).

### 2. Backend

```bash
cp backend/.env.sample backend/.env
# Edit backend/.env if needed (JWT_SECRET, encryption keys, etc.)

cd backend
./mvnw spring-boot:run
```

- API: `http://localhost:8080`
- OpenAPI JSON: `http://localhost:8080/api-docs`
- Swagger UI: `http://localhost:8080/api-docs/ui`

With profile `local` (default via `.env.sample`), Liquibase runs changesets in context **`seed-dev`** and logs demo login IDs on startup. See [Development seed data](#development-seed-data).

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

App: `http://localhost:5173`. Vite proxies `/api` and `/auth` to the backend, so you usually do not need `VITE_API_BASE_URL` in development.

### 4. Sign in

1. Open `http://localhost:5173/login`.
2. Enter a dev user ID (prefix `USR`, `EMP`, or `CST`).
3. Request OTP; read the code from the **backend console** when `APP_MAIL_ENABLED=false`.
4. Verify OTP to receive a JWT and land on the role-appropriate dashboard.

## Development seed data

Liquibase seeds (only when `spring.liquibase.contexts: seed-dev`, as in `application-local.yml`) include connection types, tariffs, users, sample connections, invoices, and payment history. Fixed IDs keep docs and login hints stable.

| Role | Login ID | Notes |
|------|----------|--------|
| Admin | `USR1000001` | `is_admin` on user record |
| Employee | `EMP1000001` | Linked to user `USR1000003` |
| Customer | `CST1000001` | Demo customer |
| Customer (alt) | `CST1000002` | Second demo customer |

Default admin contact (overridable via `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PHONE` in `.env`):

- Email: `admin@localhost`
- Phone: `9000000000`

**UPI demo (local):** `DevPaymentSeed` creates encrypted UPI credentials for bill payment. Sender UPI `demo@upi`, PIN `1234`. Set `BILLING_RECEIVER_UPI_ID` in `backend/.env` to match the receiver UPI used in the app (default in `.env.sample`: `billing@upi`). Startup logs repeat these hints via `DevSeedLoginHint`.

**Fresh database:** if seeds are missing or IDs conflict with an old database:

```bash
docker compose down -v && docker compose up -d
```

Then restart the backend.

## Project layout

```
electricity-ebilling/
├── backend/          # Spring Boot API (com.ebilling)
├── frontend/         # React SPA
├── docker-compose.yml
├── docs/             # Architecture and design notes
└── .github/workflows # CI (backend tests on main)
```

Deeper structure and request flows: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## API overview

| Area | Base path | Auth |
|------|-----------|------|
| OTP | `/auth/otp` | Public |
| Users, customers, employees | `/api/auth` | JWT; path rules in `SpringSecurity` |
| Connections, types, tariffs, invoices | `/api/billing/connections` | JWT |
| Accounts, UPI, payments | `/api/payments` | JWT |

Responses generally use `CustomApiResponse<T>` (`message`, `data`, `status`). Interactive documentation is available at Swagger UI when the server is running.

## Configuration

Backend environment variables are documented in `backend/.env.sample`. Important groups:

- **Database:** `JDBC_URL`, `DB_USERNAME`, `DB_PASSWORD`
- **JWT:** `JWT_SECRET`, `JWT_EXPIRES_IN`
- **Encryption:** `APP_ENCRYPTION_KEY` (32 chars), `APP_IV_KEY` (16 chars) for sensitive payment fields
- **Mail:** `MAIL_*`, `APP_MAIL_ENABLED`
- **Billing:** `BILLING_RECEIVER_UPI_ID`
- **Production CORS:** `CORS_ALLOWED_ORIGINS` (comma-separated; required for `prod` profile)

Profiles:

- **`local`** — dev seeds, mail often disabled, OTP in logs
- **`prod`** — set `SPRING_PROFILES_ACTIVE=prod` and real secrets; configure CORS for your frontend origin

Frontend production builds should set `VITE_API_BASE_URL` to the public API origin (see `frontend/.env.sample`). Development relies on the Vite proxy in `vite.config.ts`.

## Tests and CI

```bash
cd backend
./mvnw verify
```

GitHub Actions runs `./mvnw verify` on pushes and PRs to `main` (see `.github/workflows/backend-ci.yml`). Tests use in-memory H2 with Liquibase disabled (`application-test.yml`).

## Scripts

| Location | Command | Purpose |
|----------|---------|---------|
| `frontend/` | `npm run dev` | Dev server (port 5173) |
| `frontend/` | `npm run build` | Production build |
| `frontend/` | `npm run lint` | Oxlint |
| `backend/` | `./mvnw spring-boot:run` | Run API |
| `backend/` | `./mvnw verify` | Unit/integration tests |

## License

No license file is included in this repository; add one if you plan to distribute or open-source the project.
