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

## Deploying behind a reverse proxy

If your server already runs its own nginx reverse-proxy container (fronting other sites too), here's the setup to serve this app under a real domain with the frontend and API on the same origin.

1. Clone the repo and create a real `.env` (copy `.env.sample`) with production values:
   - `SECRET_KEY` — a real generated secret, not `changeme`
   - `DEBUG=False`
   - `ALLOWED_HOSTS=yourdomain.com`
   - `CORS_ALLOWED_ORIGINS=https://yourdomain.com`
   - `CSRF_TRUSTED_ORIGINS=https://yourdomain.com`
   - `DB_PASSWORD` — a real generated password

2. Create `frontend/.env` (gitignored, so it won't come from the clone) with `VITE_API_BASE_URL` left empty/unset. Locally this points at `http://localhost:8000`, but in production nginx serves the frontend and proxies `/api/` to the backend under the same domain, so relative URLs are what you want. This gets baked into the built JS at `npm run build` time, so a stray `localhost` value here will break production.

3. Put `backend`/`frontend` on the same Docker network as your existing reverse-proxy container so it can reach them by service name:
   ```bash
   docker network create web
   ```
   Attach your existing nginx container to it, and add this to `compose.yaml`:
   ```yaml
   services:
     backend:
       networks:
         - default
         - web
     frontend:
       networks:
         - default
         - web

   networks:
     web:
       external: true
   ```

4. Build and start, then run migrations and create an admin user:
   ```bash
   docker compose up --build -d
   docker compose exec backend python manage.py migrate
   docker compose exec backend python manage.py createsuperuser
   ```

5. On your reverse-proxy container, add a server block for your domain. It terminates TLS and routes `/api/`, `/admin/`, and `/static/` (served by whitenoise inside the backend) to `backend:8000`, and everything else to `frontend:80`:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location /.well-known/acme-challenge/ {
           root /var/www/certbot;
       }

       location / {
           return 301 https://$host$request_uri;
       }
   }

   server {
       listen 443 ssl;
       http2 on;
       server_name yourdomain.com;

       ssl_certificate     /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

       location ~ ^/(api|admin|static)/ {
           proxy_pass http://backend:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }

       location / {
           proxy_pass http://frontend:80;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

## API docs

Once the backend's running, check out `/api/docs/` for an interactive Swagger UI, or `/api/redoc/` if you prefer Redoc's layout. Both are generated straight from the code, so they won't go stale.

## Notes

This started as a prototype/learning project, so don't expect enterprise-grade polish everywhere — but the auth, Docker setup, and static file handling are all wired up in a way that's actually meant to survive being deployed somewhere real, not just running on `localhost`.
