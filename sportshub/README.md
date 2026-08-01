# SPRINT — Online Sports Accessories Store

Full-stack e-commerce site: **Flask** REST API backend + **React (Vite)** frontend,
styled with Tailwind CSS. Includes auth, product catalog, cart, and checkout.

```
sportshub/
├── backend/          Flask API (SQLAlchemy, JWT auth, SQLite by default)
├── frontend/          React + Vite + Tailwind SPA
└── deploy/            nginx + systemd config templates for production
```

## Features

- Product catalog with categories, search, filtering, sorting, pagination
- JWT-based register/login
- Server-side cart tied to the logged-in user
- Checkout flow that creates an order and decrements stock
- Order history
- Responsive UI with a custom "scoreboard" design system (dark navy + volt accent,
  Bebas Neue display type, monospace price tags)

---

## 1. Local development

### Requirements
- Python 3.10+
- Node.js 18+ and npm

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env            # edit SECRET_KEY / JWT_SECRET_KEY if you like

python seed.py                  # creates sportshub.db and loads sample products
python run.py                   # starts the API on http://localhost:5000
```

The API is now live at `http://localhost:5000/api/...` — try `http://localhost:5000/api/health`.

### Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev                     # starts Vite dev server on http://localhost:5173
```

Vite is pre-configured to proxy `/api` requests to `http://localhost:5000`, so
just open `http://localhost:5173` and everything works together — no extra config.

---

## 2. Production build

### Backend — Gunicorn

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

cp .env.example .env
# Edit .env: set strong SECRET_KEY / JWT_SECRET_KEY, and CORS_ORIGINS to your domain

python seed.py                  # first-time only, populates the catalog

# Quick manual test:
gunicorn --workers 3 --bind 127.0.0.1:8000 wsgi:app
```

For real deployment, run gunicorn on a **unix socket** (faster, and what the
included nginx config expects) instead of a TCP port — see the systemd service
below.

### Frontend — static build

```bash
cd frontend
npm install
npm run build
```

This produces `frontend/dist/` — a folder of static files (HTML/CSS/JS) that
nginx will serve directly. There's nothing to "run" for the frontend in
production; it's just static assets.

---

## 3. Deploying with Nginx + Gunicorn (Ubuntu example)

These steps assume a fresh Ubuntu server and a domain pointed at it. Adjust
paths/usernames as needed.

### Step 1 — Get the code onto the server

```bash
sudo mkdir -p /var/www/sportshub
sudo chown $USER:$USER /var/www/sportshub
# copy/clone the project into /var/www/sportshub so you have:
#   /var/www/sportshub/backend
#   /var/www/sportshub/frontend
#   /var/www/sportshub/deploy
```

### Step 2 — Backend setup

```bash
cd /var/www/sportshub/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

cp .env.example .env
nano .env    # set SECRET_KEY, JWT_SECRET_KEY, CORS_ORIGINS=https://yourdomain.com

python seed.py
deactivate

sudo mkdir -p /var/log/sportshub
sudo chown www-data:www-data /var/log/sportshub /var/www/sportshub/backend
```

### Step 3 — Gunicorn as a systemd service

```bash
sudo cp deploy/sportshub.service /etc/systemd/system/sportshub.service
sudo systemctl daemon-reload
sudo systemctl enable sportshub
sudo systemctl start sportshub
sudo systemctl status sportshub     # confirm it's running
```

This runs gunicorn bound to a unix socket at
`/var/www/sportshub/backend/sportshub.sock`, which nginx will proxy to.

### Step 4 — Build the frontend

```bash
cd /var/www/sportshub/frontend
npm install
npm run build
```

This creates `/var/www/sportshub/frontend/dist`, which the nginx config below
serves directly.

### Step 5 — Nginx

```bash
sudo cp deploy/nginx.conf /etc/nginx/sites-available/sportshub
sudo nano /etc/nginx/sites-available/sportshub   # replace yourdomain.com
sudo ln -s /etc/nginx/sites-available/sportshub /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 6 — (Recommended) HTTPS with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Your site is now live at `https://yourdomain.com`, with:
- `/` served by nginx from the React build
- `/api/*` proxied to gunicorn → Flask

### Updating after code changes

```bash
# backend
cd /var/www/sportshub/backend
source venv/bin/activate && pip install -r requirements.txt && deactivate
sudo systemctl restart sportshub

# frontend
cd /var/www/sportshub/frontend
npm install && npm run build
# nginx serves the new dist/ immediately, no restart needed
```

---

## API reference (quick summary)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | – | Create account, returns JWT |
| POST | `/api/auth/login` | – | Login, returns JWT |
| GET | `/api/auth/me` | ✔ | Current user |
| GET | `/api/products` | – | List products (`?category=&q=&sort=&page=`) |
| GET | `/api/products/<slug>` | – | Product detail |
| GET | `/api/products/categories/all` | – | List categories |
| GET | `/api/cart` | ✔ | Get current user's cart |
| POST | `/api/cart` | ✔ | Add item `{product_id, quantity}` |
| PUT | `/api/cart/<item_id>` | ✔ | Update quantity |
| DELETE | `/api/cart/<item_id>` | ✔ | Remove item |
| POST | `/api/orders/checkout` | ✔ | Place order from cart |
| GET | `/api/orders` | ✔ | Order history |
| GET | `/api/orders/<id>` | ✔ | Order detail |

---

## Notes & next steps

- The database defaults to SQLite for simplicity. For production traffic, set
  `DATABASE_URL` in `.env` to a Postgres/MySQL connection string — SQLAlchemy
  handles the rest.
- Checkout is a demo flow (no real payment gateway). To add real payments,
  integrate Stripe/Razorpay in `app/routes/orders.py` before creating the order.
- Product images currently point to Unsplash URLs for demo purposes — swap in
  your own product photography and host it wherever you like (S3, nginx
  `static/`, etc.), then update `image_url` in `seed.py` or your admin tooling.
- There's no admin UI yet — products are managed via `seed.py`. A natural next
  step is an admin-only set of routes/pages for CRUD on products.
