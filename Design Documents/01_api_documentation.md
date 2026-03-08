# TMDB Companion API — API Documentation

## Base URL
http://localhost:5000

---

## Authentication

GET /auth/guest-session  
Creates a TMDB guest session.

---

## Movies

GET /movies/search?q=<query>&page=<page>  
Search for movies.

GET /movies/{movie_id}  
Retrieve movie details.

GET /movies/{movie_id}/recommendations  
Retrieve movie recommendations.

---

## TV

GET /tv/search?q=<query>&page=<page>  
Search for TV shows.

GET /tv/{tv_id}  
Retrieve TV show details.

---

## Trending

GET /trending/all  
GET /trending/movies  
GET /trending/tv  

---

## Health

GET /health  

---

## Notes

- All responses are JSON
- Proper HTTP status codes are used
- Read-only endpoints may be cached
