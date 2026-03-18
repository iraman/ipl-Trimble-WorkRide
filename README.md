# Trimble WorkRide

Simple web app for employees to book the office shuttle (metro ↔ office). Admin can view bookings, assign vehicles, and mark no-shows.

## Rules

- **Morning slots:** 7:30 AM, 8:30 AM (Metro → Office). **Book by 8 PM previous evening.**
- **Evening slots:** 5:00 PM, 6:00 PM (Office → Metro). **Book by 3 PM same day.**
- **Cancel:** Allowed until **1 hour before** the slot start time.
- **No-show:** 2 consecutive no-shows → employee **can sign in but cannot book for the next 1 day.**

## Stack

- **Backend:** Node.js, Express, JSON file store (no database install)
- **Frontend:** React (Vite), React Router

## Setup

### Backend

```bash
cd backend
npm install
npm run dev        # start API on http://localhost:3001 (creates data/store.json with seed data on first run)
```

### Frontend

```bash
cd frontend
npm install
npm run dev        # start app on http://localhost:5173
```

Open **http://localhost:5173** in the browser. The frontend proxies `/api` to the backend.

## Usage

1. **Login** — Dummy login: choose an account from the list (no password). *Okta integration is planned; this is a placeholder.*
2. **Book Shuttle** — Pick date and slot (bookings are for the logged-in user). Cutoff times are enforced; blocked users cannot book.
3. **My Bookings** — View and cancel your upcoming bookings (cancel allowed until 1 hour before slot).
4. **Admin** — Pick a date to see all bookings, assign vehicles, and mark no-shows. After 2 consecutive no-shows, the user can sign in but cannot book for 1 day.

## Demo data

On first run the backend creates `backend/data/store.json` with:

- **Slots:** 7:30 & 8:30 (morning), 5:00 & 6:00 (evening)
- **Users:** Admin, John Doe, Jane Smith (non-admin)
- **Vehicles:** Shuttle A, Shuttle B

Add more users via **Book Shuttle** (dropdown) or API `POST /api/users`.

## Share & deploy

- **Share with team:** See [DEPLOY_AND_SHARE.md](./DEPLOY_AND_SHARE.md) for Git setup, zip share, and how others can run the app.
- **Deploy to gateway:** Same doc has build steps, production run, env vars, PM2/systemd, and reverse-proxy (e.g. nginx) for deploying Trimble WorkRide.
