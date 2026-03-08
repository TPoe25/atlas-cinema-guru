# TMDB Coompanion API — Wireframes

## Swagger UI

The primary user interface for this project is the Swagger UI provided
by Flasgger.

---

### Layout Overview

- Grouped endpoints by category (Auth, Movies, TV, Trending)
- Each endpoint includes documentation and example parameters
- Requests can be executed directly in the browser

---

## Purpose

Swagger UI serves as:
- Interactive documentation
- A testing interface
- A demonstration UI for reviewers

+--------------------------------------------------+
| TMDB Companion API                               |
|--------------------------------------------------|
| [ Auth ]                                         |
|   - GET /auth/guest-session                     |
|                                                  |
| [ Movies ]                                       |
|   - GET /movies/search                           |
|   - GET /movies/{id}                             |
|                                                  |
| [ TV ]                                           |
|   - GET /tv/search                               |
|   - GET /tv/{id}                                 |
|                                                  |
| [ Trending ]                                     |
|   - GET /trending/all                            |
|   - GET /trending/movies                         |
|   - GET /trending/tv                             |
+--------------------------------------------------+
