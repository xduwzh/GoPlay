# GoPlay

A full‑stack starter for event management with JWT authentication, user profiles, and S3 avatar uploads.

- Frontend: React + Vite + TypeScript, Ant Design, Redux Toolkit, Axios
- Backend: Go (Gin, GORM, JWT), Postgres, AWS SDK v2 (S3 presigned uploads)
- DB: Postgres via Docker Compose

## Features

- Authentication
  - Register, Login, JWT bearer tokens
  - Axios interceptor attaches token; 401 auto-logout
  - Session restore by calling a protected `/profile` on app start
- User Profile
  - GET `/profile` to load username + avatar
  - PUT `/profile` to update username/password/avatar
  - Avatar upload via S3 presigned URL flow
- Events
  - CRUD endpoints (sample)
  - Register and Cancel endpoints; capacity + waiting list logic
- Developer friendly
  - CORS for localhost dev
  - Simple env configuration; Postgres in Docker

## Project structure

- `backend/` Go Gin API server
  - `controllers/` route handlers (auth, profile, events, uploads)
  - `middleware/` JWT auth middleware
  - `models/` GORM models
  - `database/` DB setup and migrations
  - `routes/` route wiring and CORS
  - `docker-compose.yml` Postgres (local dev)
- `frontend/` React app (Vite)
  - `src/apis/` API client (Axios + interceptors)
  - `src/pages/` Login, Profile, Home, etc.
  - `src/components/` Header
  - `src/store/` Redux store

## Getting started

Prereqs

- Node.js 18+
- Go 1.23+
- Docker Desktop (for Postgres)

### 1) Backend – environment

Create `backend/.env` (do not commit it):

```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=yourpassword
POSTGRES_DB=yourdb
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# AWS / S3 for avatar uploads
AWS_REGION=eu-north-1
S3_BUCKET=goplay-assets-prod
# Credentials are loaded from your shell env or AWS config; do NOT commit.
# export AWS_ACCESS_KEY_ID=...
# export AWS_SECRET_ACCESS_KEY=...
```

Git ignores env files at the repo root and in backend/frontend.

### 2) Start Postgres

From `backend/`:

```bash
docker compose up -d
```

### 3) Run the API server

From `backend/`:

```bash
go run main.go
```

The API listens on `http://localhost:8080`.

### 4) Frontend

From `frontend/`:

```bash
npm install
npm run dev
```

The app runs on `http://localhost:5173`.

## S3 avatar upload (presigned flow)

- The browser requests a presigned URL from the backend:
  - POST `/uploads/avatar/presign` with `{ filename, contentType }`
- The browser `PUT`s the file to the returned S3 `uploadUrl` with header `Content-Type: {contentType}`
- The backend returns `publicUrl`; the frontend then `PUT /profile` with `avatar: publicUrl`

S3 CORS (Bucket → Permissions → CORS configuration):

```
[
  {
    "AllowedOrigins": ["http://localhost:5173", "http://127.0.0.1:5173"],
    "AllowedMethods": ["PUT", "GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

To view avatars by direct URL (S3 GET), either:

- Allow public read of the `avatars/*` prefix with a bucket policy, or
- Serve privately via CloudFront. For quick local dev, a minimal policy:

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowPublicReadAvatars",
      "Effect": "Allow",
      "Principal": "*",
      "Action": ["s3:GetObject"],
      "Resource": ["arn:aws:s3:::goplay-assets-prod/avatars/*"]
    }
  ]
}
```

(If using public read, ensure Block Public Access settings are configured to allow bucket policies.)

## API quick reference

- Auth
  - `POST /register` — body: `{ username, password }`
  - `POST /login` — returns `{ token, username, avatar }`
- Profile (JWT protected)
  - `GET /profile` — returns `{ id, username, avatar }`
  - `PUT /profile` — body can include `{ username?, password?, avatar? }`
  - `POST /uploads/avatar/presign` — body `{ filename, contentType }` → `{ uploadUrl, publicUrl }`
- Events
  - `GET /events` — list
  - `GET /events/:id` — detail
  - `POST /events` — create (sample)
  - `PUT /events/:id` — update (sample)
  - `DELETE /events/:id` — delete (sample)
  - `PUT /events/:id/register` (JWT) — register
  - `DELETE /events/:id/register` (JWT) — cancel

## Security notes

- Never commit secrets (.env, keys). The repo `.gitignore` excludes env files.
- If secrets are ever committed, rotate them and purge from history before pushing.

## Troubleshooting

- Port already in use (backend): stop the other process or change port.
- CORS on S3 PUT: ensure CORS JSON includes your origin and methods.
- Avatar not loading: verify S3 object ACL/policy allows GET or use CloudFront.
- 401 on API: token expired; you’ll be redirected to login by the interceptor.

## License

MIT (or your preferred license).
