# RateMyDorm

A Telegram Mini App for university students to discover dormitories and share honest reviews. Browse universities and their residence buildings, read what other students have written, and post your own experiences—with optional photos.

## Features

- **Universities** — Browse schools by name, city, and country
- **Buildings** — Explore dormitories linked to each university
- **Reviews** — Read and write star-rated comments about specific buildings
- **Telegram auth** — Sign in automatically via Telegram Mini App
- **Profile setup** — Select your university and current dorm to enable reviewing
- **Image uploads** — Attach photos to reviews (optional)

## Tech Stack

| Layer    | Technology                          |
| -------- | ----------------------------------- |
| Backend  | Django 5.2, Django REST Framework   |
| Frontend | Next.js 15, React 19, Tailwind CSS  |
| Auth     | Telegram WebApp + SimpleJWT         |
| Database | SQLite                              |
| Media    | Pillow (image handling)             |

## Project Structure

```
RateMyDorm/
├── backend/          # Django API
│   ├── university/   # University model & endpoints
│   ├── building/     # Dorm/building model & endpoints
│   ├── student/      # Custom student user model + Telegram auth
│   └── comment/      # Review/comment model & endpoints
├── frontend/         # Next.js Telegram Mini App
└── requirements.txt  # Python dependencies
```

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+ and npm
- A Telegram Bot (from [@BotFather](https://t.me/BotFather)) for Mini App auth

### Backend

1. Create and activate a virtual environment:

   ```bash
   python -m venv .venv
   # Windows
   .venv\Scripts\activate
   # macOS / Linux
   source .venv/bin/activate
   ```

2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Create `backend/.env` with your bot token:

   ```
   TELEGRAM_BOT_TOKEN=your_bot_token_here
   ```

4. Run migrations:

   ```bash
   cd backend
   python manage.py migrate
   ```

5. (Optional) Create a superuser for the Django admin:

   ```bash
   python manage.py createsuperuser
   ```

6. Start the development server:

   ```bash
   python manage.py runserver
   ```

   The API is available at `http://127.0.0.1:8000/api/`.

### Frontend (Next.js)

1. Install dependencies:

   ```bash
   cd frontend
   npm install
   ```

2. Copy environment file:

   ```bash
   cp .env.local.example .env.local
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

   The app runs at `http://localhost:3000`.

### Telegram Mini App Setup

1. Create a bot via [@BotFather](https://t.me/BotFather)
2. Set the Mini App URL to your deployed Next.js frontend (or use a tunnel like ngrok for local dev)
3. Open the Mini App inside Telegram — auth uses `initData` automatically

## Frontend Pages

| Route | Description |
| ----- | ----------- |
| `/` | Home — recent reviews + university browse |
| `/universities` | All universities |
| `/universities/[id]` | University detail with dorm list |
| `/buildings/[id]` | Building detail with reviews |
| `/profile` | Set university & dorm, view account |
| `/review` | Write a review for your assigned dorm |

## API Endpoints

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| POST | `/api/students/auth/telegram/` | Telegram Mini App login |
| GET | `/api/universities/` | List all universities |
| GET | `/api/buildings/` | List all buildings |
| PATCH | `/api/students/{id}/` | Update profile (university, dorm) |
| GET | `/api/comments/` | List all reviews (newest first) |
| POST | `/api/comments/create/` | Post a review (auth required) |

### Creating a Review

Send a `POST` request to `/api/comments/create/` with Bearer token:

```json
{
  "content": "Great location, quiet at night.",
  "building_id": 1,
  "rating": 4
}
```

An optional `image` file can be included as multipart form data.

## Data Models

- **University** — `name`, `city`, `country`, `description`
- **Building** — `university`, `name`, `address`, `description`, `gender`, `facilities`
- **Student** — `telegram_id`, `username`, `first_name`, `last_name`, `university`, `current_building`
- **Comment** — `content`, `rating` (1–5), `building`, `student`, `image`, `created_at`

## License

This project is open source. See the repository for details.

---

Special thanks to [soroush](https://github.com/Ox50R0U5H) for his contributions to this project.
