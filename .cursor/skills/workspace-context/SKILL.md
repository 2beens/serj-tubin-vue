---
name: serj-tubin-workspace-context
description: Provides context about the serj-tubin personal website ecosystem (backend, Vue frontend, gymstats React app). Use when working on serj-tubin-com, serj-tubin-vue, or gymstats features, deployment, or cross-project integration.
---

# Serj-Tubin Workspace Context

This skill gives the agent shared context for the three related personal projects that form the serj-tubin.com site and utilities.

## The Three Projects

| Project | Tech | Purpose |
|--------|------|---------|
| **serj-tubin-com** | Go (Golang) | Backend API and services |
| **serj-tubin-vue** | Vue.js (Vuetify) | Main website frontend |
| **gymstats** | React (Vite, Chart.js) | Gym exercise analytics app (main gymstats experience) |

Gymstats remains in React. The Vue site has a `/gymstats` section (Log, Stats, List) for quick logging and list view; the React app is the primary gymstats experience (analytics, progress charts, progression rate, date-range exercises) and will be deployed at **gymstats.serj-tubin.com** when ready. Not deployed remotely yet.

## Backend (serj-tubin-com)

- **Stack**: Go, PostgreSQL, Redis, Gorilla Mux.
- **Modules** (from `internal/`): `auth`, `blog`, `file_box`, `geoip`, `gymstats` (events + exercises), `misc` (quotes), `netlog` (internet activity), `notes_box`, `spotify`, `visitor_board`, `weather`, middleware, telemetry (Prometheus, Honeycomb, Sentry).
- **Key routes**: Auth (`/a/login`), blog, netlog, gymstats (`/gymstats/...`), notes, visitor board, Spotify, weather, misc. File box is a **separate service** (see Deployment).
- **Config**: `config.toml`; DB name `serj_blogs`. Production: backend on `localhost:1988`; nginx exposes **https://h.serj-tubin.com/api**.
- **Run locally**: `cd docker && make up` in serj-tubin-com (Postgres, Redis, main service on 9000, file service, Adminer).

## Main Frontend (serj-tubin-vue)

- **Stack**: Vue.js, Vuetify, Yarn.
- **Role**: Main site at www.serj-tubin.com (blog, netlog, notes, file box, visitor board, Spotify, weather, utils, gymstats Log/Stats/List).
- **API**: `VITE_API_ENDPOINT=https://h.serj-tubin.com/api` (dev and prod). Also: `VITE_FILE_BOX_ENDPOINT`, URL shortener endpoints, SumUp, etc.
- **Run locally**: `yarn install && yarn serve-dev`; backend (e.g. Docker) as needed.

## Gymstats App (gymstats)

- **Stack**: React 18, Vite, Chart.js, Axios, pnpm.
- **Role**: Single-user gym analytics (progress chart, progression rate, exercises table, filters, metric toggles). Auth via backend `/a/login`; `X-SERJ-TOKEN` header.
- **Backend API**: `/gymstats/stats/progress`, `/gymstats/stats/progression-rate`, `/gymstats/stats/exercises`, `/gymstats/types`, etc.
- **Deploy**: Future **gymstats.serj-tubin.com**; backend CORS will need that origin (`internal/middleware/cors.go` in serj-tubin-com).

## Deployment and Infrastructure

- **Host**: Hetzner (Ubuntu). **DNS**: Namecheap.
- **Sites**: www.serj-tubin.com, 2beens.online; API at **h.serj-tubin.com/api**; file box at **file-box.serj-tubin.com**; gymstats (future) at **gymstats.serj-tubin.com**.
- **On server**: Nginx, main backend, file-box (separate service, same machine), PostgreSQL (`serj_blogs`), Redis; rust-url-shortener, webhooks for redeploy.
- **CI/CD**: serj-tubin-com `.github/workflows/deploy.yml` — **deploy-main-service** and **deploy-file-service** (SSH + remote redeploy script).

## Data and Clients

- **Netlog**: Browser extension (Chrome) on user's computers; sends visit data to backend.
- **Gymstats**: User uses only web clients (Vue + React). iOS app exists but is not in active use.

## Cross-Project Conventions

- **Auth**: Backend owns auth; Vue and gymstats use same login and `X-SERJ-TOKEN` header.
- **Gymstats**: Vue has Log/Stats/List; React app is main gymstats experience (analytics). When adding gymstats.serj-tubin.com, update backend CORS.
- **Local dev**: Backend first (Docker), then frontend(s) at `http://localhost:9000`. Follow Go and Vue best practices.
