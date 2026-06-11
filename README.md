# RateMyDorm

A platform for university students to discover dormitories and share honest reviews. Browse universities and their residence buildings, read what other students have written, and post your own experiences—with optional photos.

## Features

- **Universities** — Browse schools by name, city, and country
- **Buildings** — Explore dormitories linked to each university
- **Reviews** — Read and write comments about specific buildings
- **Student accounts** — Lightweight auth via Telegram ID (custom user model)
- **Image uploads** — Attach photos to reviews (optional)

## Tech Stack

| Layer    | Technology                          |
| -------- | ----------------------------------- |
| Backend  | Django 5.2, Django REST Framework   |
| Frontend | React 19 (Create React App)         |
| Database | SQLite                              |
| Media    | Pillow (image handling)             |

## Project Structure

```
RateMyDorm/
├── backend/          # Django API
│   ├── university/   # University model & endpoints
│   ├── building/     # Dorm/building model & endpoints
│   ├── student/      # Custom student user model
│   └── comment/      # Review/comment model & endpoints
├── frontend/         # React client
└── requirements.txt  # Python dependencies
```

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+ and npm

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

3. Run migrations:

   ```bash
   cd backend
   python manage.py migrate
   ```

4. (Optional) Create a superuser for the Django admin:

   ```bash
   python manage.py createsuperuser
   ```

5. Start the development server:

   ```bash
   python manage.py runserver
   ```

   The API is available at `http://127.0.0.1:8000/api/`.

### Frontend

1. Install dependencies:

   ```bash
   cd frontend
   npm install
   ```

2. Start the development server:

   ```bash
   npm start
   ```

   The app runs at `http://localhost:3000`.

## API Endpoints

| Method | Endpoint                  | Description                    |
| ------ | ------------------------- | ------------------------------ |
| GET    | `/api/universities/`      | List all universities          |
| POST   | `/api/universities/`      | Create a university            |
| GET    | `/api/universities/{id}/` | Retrieve a university          |
| GET    | `/api/buildings/`         | List all buildings             |
| POST   | `/api/buildings/`         | Create a building              |
| GET    | `/api/buildings/{id}/`    | Retrieve a building            |
| GET    | `/api/students/`          | List students                  |
| POST   | `/api/students/`          | Register a student             |
| GET    | `/api/comments/`          | List all reviews (newest first)|
| POST   | `/api/comments/create/`   | Post a review (auth required)  |
| GET    | `/api/comments/{id}/`     | Retrieve a single review       |

### Creating a Review

Send a `POST` request to `/api/comments/create/` with:

```json
{
  "content": "Great location, quiet at night.",
  "building_id": 1
}
```

An optional `image` file can be included as multipart form data.

## Data Models

- **University** — `name`, `city`, `country`, `description`
- **Building** — `university`, `name`, `address`, `description`
- **Student** — `telegram_id` (login identifier), `username`, `first_name`, `last_name`
- **Comment** — `content`, `building`, `student`, `image`, `created_at`

## Admin Panel

Django admin is available at `http://127.0.0.1:8000/admin/` for managing universities, buildings, students, and comments.

## License

This project is open source. See the repository for details.

---

Special thanks to [soroush](https://github.com/Ox50R0U5H) for his contributions to this project.
