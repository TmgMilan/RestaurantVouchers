# Restaurant Vouchers

A small full-stack app for managing gift vouchers for a restaurant — create them, look them up, redeem them , and keep track of what's left on each one. Built as a personal project and use for restaurants that still use physical copy to write their vouchers and  to get more comfortable with Django REST Framework and pairing it with a React frontend.

## What it does

- Create vouchers with a recipient, value, optional expiry, and notes
- Each voucher gets a unique code auto-generated on save
- Redeem a voucher for a partial amount or the full remaining balance — it keeps a running `remaining_value` and flips to `redeemed` once it hits zero
- Every redemption is logged separately (`VoucherRedemption`), so you can see a history, not just the current balance
- List view supports filtering by status, searching by recipient/email, and sorting by date
- JWT-based auth (login, refresh, verify) so the API isn't wide open
- Auto-generated API docs via drf-spectacular (Swagger + Redoc)

## Stack

- **Backend:** Django + Django REST Framework, PostgreSQL, JWT auth via `djangorestframework-simplejwt`
- **Frontend:** React (Vite), MUI + Tailwind for styling
- **Docs:** drf-spectacular for OpenAPI schema / Swagger UI / Redoc
- **Deployment:** Docker Compose (Postgres + Django/gunicorn + Nginx serving the built frontend)

## Running it locally

The easiest way is Docker — it spins up Postgres, the Django API, and the frontend together.

1. Copy the env file and fill in real values (or just leave the defaults for local dev):
   ```bash
   cp .env.sample .env
   ```
2. Bring everything up:
   ```bash
   docker compose up --build
   ```
3. You should now have:
   - Frontend at `http://localhost:5173`
   - API at `http://localhost:8000`
   - Swagger docs at `http://localhost:8000/api/docs/`

First time around you'll also want to run migrations and make yourself an admin user:

```bash
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py createsuperuser
```

### Running without Docker (not recommanded)

Backend:

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

You'll still need a Postgres instance running locally and a `.env` pointing at it.

## API docs

Once the backend's running, check out `/api/docs/` for an interactive Swagger UI, or `/api/redoc/` if you prefer Redoc's layout. Both are generated straight from the code, so they won't go stale.

## Notes

This started as a prototype/learning project, so don't expect enterprise-grade polish everywhere — but the auth, Docker setup, and static file handling are all wired up in a way that's actually meant to survive being deployed somewhere real, not just running on `localhost`.
